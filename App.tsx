
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingItem, ItemStatus } from './types';
import { ItemForm } from './components/ItemForm';
import { ItemCard } from './components/ItemCard';
import { RecycleBinModal } from './components/RecycleBinModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { ExpirationAlertModal } from './components/ExpirationAlertModal';
import { CalendarPicker } from './components/CalendarPicker';
import { loadItemsFromDB, saveItemToDB, deleteItemFromDB, initStoragePersistence, getStorageEstimate } from './services/storage';
import { 
  Plus, Search, ShoppingBag, Utensils, Coffee, Shirt, Monitor, 
  MoreHorizontal, ListFilter, SlidersHorizontal, Grid3X3, Grid2X2, LayoutList, 
  CheckCircle2, AlertCircle, PackageCheck, Settings, X, Moon, Sun, MonitorSmartphone, Languages,
  Trash2, Undo2, Database, HardDrive, Download, Menu, Sparkles, Palette, Pill, FileText, Ban, Home, HelpCircle, Calendar
} from 'lucide-react';
import { TRANSLATIONS, Language, CATEGORY_KEYS } from './constants';

// Helper to get icon for category
const getCategoryIcon = (category: string, size: number = 20) => {
  switch (category) {
    case 'Cooking Ingredients': return <Utensils size={size} />;
    case 'Food & Drinks': return <Coffee size={size} />;
    case 'Household products': return <Home size={size} />;
    case 'Cosmetics': return <Palette size={size} />;
    case 'Medicine': return <Pill size={size} />;
    case 'Clothing': return <Shirt size={size} />;
    case 'Electronics': return <Monitor size={size} />;
    default: return <MoreHorizontal size={size} />;
  }
};

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

type CardSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'dark' | 'system';

interface AppSettings {
  language: Language;
  theme: Theme;
  enableAI: boolean;
  cardSize: CardSize;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  theme: 'system',
  enableAI: true,
  cardSize: 'medium'
};

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  
  // Load settings from localStorage
  const loadSettings = (): AppSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem('smartshop_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn("Failed to load settings", e);
      return DEFAULT_SETTINGS;
    }
  };

  const initialSettings = useRef(loadSettings()).current;

  // Settings State
  const [language, setLanguage] = useState<Language>(initialSettings.language);
  const [theme, setTheme] = useState<Theme>(initialSettings.theme);
  const [enableAI, setEnableAI] = useState<boolean>(initialSettings.enableAI);
  
  // View State
  const [cardSize, setCardSize] = useState<CardSize>(initialSettings.cardSize);
  
  // Save settings effect
  useEffect(() => {
    const settingsToSave: AppSettings = {
      language,
      theme,
      enableAI,
      cardSize
    };
    localStorage.setItem('smartshop_settings', JSON.stringify(settingsToSave));
    
    document.documentElement.lang = language === 'ja' ? 'ja' : 'en';
  }, [language, theme, enableAI, cardSize]);

  // Check for first-time visit
  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('smartshop_language_selected');
    const hasSeenOnboarding = localStorage.getItem('smartshop_onboarding_seen');
    if (!hasSelectedLanguage) {
        setIsLanguageSelectorOpen(true);
    } else if (!hasSeenOnboarding) {
        setIsOnboardingOpen(true);
    }
  }, []);

  const handleLanguageSelect = (selectedLang: Language) => {
    setLanguage(selectedLang);
    localStorage.setItem('smartshop_language_selected', 'true');
    setIsLanguageSelectorOpen(false);
    setTimeout(() => setIsOnboardingOpen(true), 100);
  };

  const handleCloseOnboarding = () => {
    localStorage.setItem('smartshop_onboarding_seen', 'true');
    setIsOnboardingOpen(false);
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatuses, setActiveStatuses] = useState<ItemStatus[]>([]);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({min: '', max: ''});

  // Expiration Filter
  const [isExpiryFilterActive, setIsExpiryFilterActive] = useState(false);
  const [isFilterCalendarOpen, setIsFilterCalendarOpen] = useState(false);
  const [expiryFilterDate, setExpiryFilterDate] = useState<number>(new Date().setHours(12, 0, 0, 0));

  const formatFilterDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  // Expiration Alert State
  const hasCheckedExpiryRef = useRef(false);
  const [isExpiryAlertOpen, setIsExpiryAlertOpen] = useState(false);
  const [expiringItems, setExpiringItems] = useState<ShoppingItem[]>([]);

  // Toast & Scroll State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [lastDeletedId, setLastDeletedId] = useState<string | null>(null);
  const [isMainScrolling, setIsMainScrolling] = useState(false);
  const [storageStats, setStorageStats] = useState<{usage: number, quota: number} | null>(null);
  const mainScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = TRANSLATIONS[language];

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Load items
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await initStoragePersistence();
        const storedItems = await loadItemsFromDB();
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        const validItems = storedItems.map(item => ({
          ...item,
          currency: item.currency || 'JPY'
        })).filter(item => {
          if (!item.deletedAt) return true;
          if (Date.now() - item.deletedAt > THIRTY_DAYS_MS) {
            deleteItemFromDB(item.id).catch(console.error);
            return false;
          }
          return true;
        });
        setItems(validItems);
      } catch (error) {
        console.error("Failed to load items from DB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchStorageStats = async () => {
      const stats = await getStorageEstimate();
      setStorageStats(stats);
    };
    fetchStorageStats();
  }, [items]);

  // Expiry checks
  useEffect(() => {
    if (!isLoading && !hasCheckedExpiryRef.current) {
      hasCheckedExpiryRef.current = true;
      if (items.length > 0) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const thresholdDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
        thresholdDate.setHours(23, 59, 59, 999);
        const threshold = thresholdDate.getTime();

        const upcoming = items.filter(item => {
          if (item.deletedAt) return false;
          if (item.status !== 'in-stock' && item.status !== 'low') return false;
          if (!item.expiryDate) return false;
          return item.expiryDate >= todayStart && item.expiryDate <= threshold;
        });

        if (upcoming.length > 0) {
          upcoming.sort((a, b) => (a.expiryDate || 0) - (b.expiryDate || 0));
          setExpiringItems(upcoming);
          setIsExpiryAlertOpen(true);
        }
      }
    }
  }, [isLoading, items]);

  const handleAddItem = async (itemData: Omit<ShoppingItem, 'id' | 'createdAt'>) => {
    const newItem: ShoppingItem = { ...itemData, id: generateId(), createdAt: Date.now() };
    setItems((prev) => [newItem, ...prev]);
    setIsFormOpen(false);
    await saveItemToDB(newItem);
  };

  const handleUpdateItem = async (itemData: Omit<ShoppingItem, 'id' | 'createdAt'>) => {
    if (!editingItem) return;
    if (editingItem.id === '') {
       await handleAddItem(itemData);
       setEditingItem(null);
       return;
    }
    const updatedItem = { ...editingItem, ...itemData };
    setItems((prev) => prev.map((item) => item.id === editingItem.id ? updatedItem : item));
    setEditingItem(null);
    setIsFormOpen(false);
    await saveItemToDB(updatedItem);
  };

  const handleDeleteItem = async (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;
    const deletedItem = { ...itemToDelete, deletedAt: Date.now() };
    setItems((prev) => prev.map((i) => i.id === id ? deletedItem : i));
    await saveItemToDB(deletedItem);
    setLastDeletedId(id);
    setToastMessage(t.itemMovedToTrash);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
      setIsFormOpen(false);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteItemFromDB(id);
  };

  const handleRestoreItem = async (id: string) => {
    const itemToRestore = items.find(i => i.id === id);
    if (!itemToRestore) return;
    const restoredItem = { ...itemToRestore, deletedAt: undefined };
    setItems((prev) => prev.map((i) => i.id === id ? restoredItem : i));
    await saveItemToDB(restoredItem);
  };

  const toggleItemStatus = async (id: string, currentStatus: string) => {
    const newStatus: ItemStatus = currentStatus === 'to-buy' ? 'in-stock' : 'to-buy';
    const item = items.find(i => i.id === id);
    if (item) {
      const updatedItem = { ...item, status: newStatus };
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
      await saveItemToDB(updatedItem);
    }
  };

  const toggleStatusFilter = (status: ItemStatus) => {
    setActiveStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      setSelectedCategories(['All']);
      return;
    }

    setSelectedCategories((prev) => {
      const isAllSelected = prev.includes('All');
      const isAlreadySelected = prev.includes(cat);

      if (isAllSelected) {
        return [cat];
      }

      if (isAlreadySelected) {
        const next = prev.filter((c) => c !== cat);
        return next.length === 0 ? ['All'] : next;
      }

      return [...prev, cat];
    });
  };

  const filteredItems = items.filter((item) => {
    if (item.deletedAt) return false;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.store && item.store.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(item.category);
    const matchesStatus = activeStatuses.length === 0 || activeStatuses.includes(item.status);

    let matchesPrice = true;
    if (isPriceFilterActive) {
      const p = item.price;
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      matchesPrice = p !== null && p >= min && p <= max;
    }

    let matchesExpiry = true;
    if (isExpiryFilterActive && expiryFilterDate) {
       if (!item.expiryDate) {
         matchesExpiry = false;
       } else {
         const itemDate = new Date(item.expiryDate).setHours(0,0,0,0);
         const filterDate = new Date(expiryFilterDate).setHours(0,0,0,0);
         matchesExpiry = itemDate <= filterDate;
       }
    }
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesExpiry;
  });

  const trashItems = items.filter(item => item.deletedAt).sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));

  const handleMainScroll = () => {
    setIsMainScrolling(true);
    if (mainScrollTimeoutRef.current) clearTimeout(mainScrollTimeoutRef.current);
    mainScrollTimeoutRef.current = setTimeout(() => setIsMainScrolling(false), 1000);
  };

  const categoriesToShow = selectedCategories.includes('All') 
    ? CATEGORY_KEYS.filter(cat => filteredItems.some(item => item.category === cat))
    : CATEGORY_KEYS.filter(cat => selectedCategories.includes(cat));

  const getGridClasses = () => {
    switch (cardSize) {
      case 'small': return 'grid-cols-1 gap-3';
      case 'large': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
      default: return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-indigo-600 dark:text-indigo-400">
           <Database size={40} className="animate-bounce" />
           <p className="font-medium">Loading your list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans text-gray-900 dark:text-white transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[80] md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[90] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
             <ShoppingBag size={28} />
             <h1 className="text-2xl font-bold tracking-tight">{t.appName}</h1>
           </div>
           <button 
             onClick={() => setIsSidebarOpen(false)}
             className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
           >
             <X size={20} />
           </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => toggleCategory('All')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              selectedCategories.includes('All') 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ListFilter size={20} />
            <span className="text-sm">{t.all}</span>
          </button>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-2"></div>
          {CATEGORY_KEYS.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                selectedCategories.includes(cat)
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={selectedCategories.includes(cat) ? 'scale-110 transition-transform' : ''}>
                {getCategoryIcon(cat)}
              </div>
              <span className="text-sm flex-1 text-left">{t.categories[cat as keyof typeof t.categories] || cat}</span>
              {selectedCategories.includes(cat) && <CheckCircle2 size={16} className="text-indigo-500" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <button 
            onClick={() => { setIsOnboardingOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <HelpCircle size={20} />
            <span className="text-sm">{t.help}</span>
          </button>
          <button 
            onClick={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <Settings size={20} />
            <span className="text-sm">{t.settings}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full max-w-full">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 flex flex-col transition-colors duration-200 w-full">
          <div className="p-4 flex items-center justify-between gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder={t.search} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="px-4 pb-3 border-t border-gray-100 dark:border-gray-700 pt-3">
             <div className="flex flex-col md:flex-row md:items-center gap-3">
               <div className="grid grid-cols-4 gap-2 w-full md:w-auto md:flex md:items-center md:gap-1.5">
                  <button onClick={() => toggleStatusFilter('to-buy')} className={`w-full md:w-auto justify-center flex items-center gap-1 px-2 py-2 md:py-1.5 rounded-lg md:rounded-full text-[9px] sm:text-xs font-medium border transition-all ${activeStatuses.includes('to-buy') ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-800 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                    <CheckCircle2 size={16} strokeWidth={2.5} /> <span className="truncate">{t.toBuy}</span>
                  </button>
                  <button onClick={() => toggleStatusFilter('low')} className={`w-full md:w-auto justify-center flex items-center gap-1 px-2 py-2 md:py-1.5 rounded-lg md:rounded-full text-[9px] sm:text-xs font-medium border transition-all ${activeStatuses.includes('low') ? 'bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/40 dark:border-orange-800 dark:text-orange-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                    <AlertCircle size={16} strokeWidth={2.5} /> <span className="truncate">{t.low}</span>
                  </button>
                  <button onClick={() => toggleStatusFilter('in-stock')} className={`w-full md:w-auto justify-center flex items-center gap-1 px-2 py-2 md:py-1.5 rounded-lg md:rounded-full text-[9px] sm:text-xs font-medium border transition-all ${activeStatuses.includes('in-stock') ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-indigo-800 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                    <PackageCheck size={16} strokeWidth={2.5} /> <span className="truncate">{t.inStock}</span>
                  </button>
                  <button onClick={() => toggleStatusFilter('dont-like')} className={`w-full md:w-auto justify-center flex items-center gap-1 px-2 py-2 md:py-1.5 rounded-lg md:rounded-full text-[9px] sm:text-xs font-medium border transition-all ${activeStatuses.includes('dont-like') ? 'bg-red-100 border-red-200 text-red-700 dark:bg-red-900/40 dark:border-red-800 dark:text-red-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                    <Ban size={16} strokeWidth={2.5} /> <span className="truncate">{t.dontLike}</span>
                  </button>
               </div>
               <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
               <div className="flex items-center justify-between flex-1 gap-3">
                   <div className="flex items-center gap-2">
                       <button onClick={() => setIsPriceFilterActive(!isPriceFilterActive)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isPriceFilterActive ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                         <SlidersHorizontal size={14} /> {t.price}
                       </button>
                       <button onClick={() => setIsExpiryFilterActive(!isExpiryFilterActive)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isExpiryFilterActive ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/40 dark:border-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                         <Calendar size={14} /> {t.expiryDate}
                       </button>
                   </div>
                   <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 ml-auto">
                      <button onClick={() => setCardSize('small')} className={`p-1.5 rounded-md transition-all ${cardSize === 'small' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} title="List View"><LayoutList size={16} /></button>
                      <button onClick={() => setCardSize('medium')} className={`p-1.5 rounded-md transition-all ${cardSize === 'medium' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Medium Grid View"><Grid3X3 size={16} /></button>
                      <button onClick={() => setCardSize('large')} className={`p-1.5 rounded-md transition-all ${cardSize === 'large' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Large Grid View"><Grid2X2 size={16} /></button>
                   </div>
               </div>
             </div>
          </div>

          <div className="flex flex-col w-full overflow-hidden">
              {isPriceFilterActive && (
                <div className="px-4 pb-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.priceRange}:</span>
                  <div className="flex items-center gap-2">
                    <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} placeholder={t.min} className="w-20 px-2 py-1 text-base sm:text-sm border bg-white text-gray-900 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
                    <span className="text-gray-400">-</span>
                    <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} placeholder={t.max} className="w-20 px-2 py-1 text-base sm:text-sm border bg-white text-gray-900 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
              )}
              {isExpiryFilterActive && (
                <div className="px-4 pb-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.expiryDate} (&le;):</span>
                  <button 
                    onClick={() => setIsFilterCalendarOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    <Calendar size={14} className="text-indigo-500" />
                    {formatFilterDate(expiryFilterDate)}
                  </button>
                  {isFilterCalendarOpen && (
                    <CalendarPicker 
                      value={expiryFilterDate} 
                      onChange={(ts) => { if (ts) setExpiryFilterDate(ts); }} 
                      onClose={() => setIsFilterCalendarOpen(false)} 
                    />
                  )}
                </div>
              )}
          </div>
        </header>

        {/* Scrollable List */}
        <main onScroll={handleMainScroll} className={`flex-1 overflow-y-auto p-3 md:p-8 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col fade-scrollbar ${isMainScrolling ? 'scrolling' : ''} w-full max-w-full overflow-x-hidden`}>
          {filteredItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-center min-h-[300px]">
              <ShoppingBag size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">{t.noItems}</p>
              <p className="text-sm">{t.emptyState}</p>
              {items.filter(i => !i.deletedAt).length === 0 && (
                <button onClick={() => setIsFormOpen(true)} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium shadow-lg shadow-indigo-200 hover:shadow-indigo-300 dark:shadow-none transition-all">{t.createFirst}</button>
              )}
            </div>
          ) : (
            <div className="space-y-6 flex-1 w-full max-w-full">
              {categoriesToShow.map((cat) => {
                const categoryItems = filteredItems.filter(i => i.category === cat);
                if (categoryItems.length === 0) return null;
                return (
                  <div key={cat} className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-full">
                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      {getCategoryIcon(cat, 18)} {t.categories[cat as keyof typeof t.categories] || cat}
                      <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{categoryItems.length}</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-4"></div>
                    </h2>
                    <div className={`grid w-full ${getGridClasses()}`}>
                      {categoryItems.map((item) => (
                        <ItemCard key={item.id} item={item} size={cardSize} onStatusToggle={toggleItemStatus} onDelete={handleDeleteItem} onClick={(i) => { setEditingItem(i); setIsFormOpen(true); }} lang={language} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <footer className="mt-12 py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pb-24 md:pb-8">
            <p>{t.footerCreatedBy} <span className="font-semibold text-gray-900 dark:text-gray-200">Khant Si Thu</span>.</p>
            <p className="mt-1">
              {t.footerEmailPrompt}
              <br className="md:hidden" />
              <a href="mailto:khantsithu.1999.work@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline decoration-2 underline-offset-2 ml-0 md:ml-1">
                {t.footerClickHere}
              </a>
            </p>
          </footer>
        </main>

        {!isFormOpen && !isSettingsOpen && (
          <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="fixed right-6 bottom-6 md:right-8 md:bottom-8 z-30 bg-gradient-to-br from-indigo-500/90 to-purple-600/90 hover:from-indigo-400/90 hover:to-purple-500/90 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-white h-12 w-12 flex items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-all duration-300" aria-label="Add Item"><Plus size={24} /></button>
        )}

        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-xl z-[100] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-sm max-w-[90vw]">
             {toastMessage === t.itemImported ? <Download size={16} /> : <span className="font-medium truncate">{toastMessage}</span>}
             {toastMessage === t.itemMovedToTrash ? (
               <>
                 <div className="h-4 w-px bg-white/20 dark:bg-black/20"></div>
                 <button onClick={() => { if (lastDeletedId) handleRestoreItem(lastDeletedId); setShowToast(false); setLastDeletedId(null); }} className="flex items-center gap-1.5 text-indigo-400 dark:text-indigo-600 font-bold hover:underline whitespace-nowrap"><Undo2 size={16} />{t.undo}</button>
               </>
             ) : (
                <span className="font-medium">{toastMessage === t.itemImported ? toastMessage : ''}</span>
             )}
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-x-hidden">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl h-full transform transition-transform duration-300 overflow-x-hidden">
            <ItemForm initialData={editingItem || undefined} onSubmit={editingItem ? handleUpdateItem : handleAddItem} onCancel={() => setIsFormOpen(false)} onDelete={handleDeleteItem} lang={language} enableAI={enableAI} />
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transform transition-all overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><Settings className="text-indigo-600 dark:text-indigo-400" />{t.settings}</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><HardDrive size={16} />{t.storage}</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
                  {storageStats ? (
                    <>
                      <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-600 dark:text-gray-300 font-medium">{formatBytes(storageStats.usage)} {t.used}</span><span className="text-gray-400 dark:text-gray-500">{formatBytes(storageStats.quota)} {t.available}</span></div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden"><div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((storageStats.usage / storageStats.quota) * 100, 100)}%` }}></div></div>
                    </>
                  ) : (
                    <div className="h-6 w-full animate-pulse bg-gray-200 dark:bg-gray-600 rounded"></div>
                  )}
                </div>
              </div>
              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2"><Sparkles size={16} />{t.enableAI}</div>
                  <button onClick={() => setEnableAI(!enableAI)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${enableAI ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enableAI ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Languages size={16} />{t.language}</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-base sm:text-sm text-gray-900 dark:text-white">
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="my">မြန်မာ</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><MonitorSmartphone size={16} />{t.theme}</label>
                <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                  <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${theme === 'light' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}><Sun size={18} />{t.light}</button>
                  <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}><Moon size={18} />{t.dark}</button>
                  <button onClick={() => setTheme('system')} className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${theme === 'system' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}><MonitorSmartphone size={18} />{t.system}</button>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
                 <button onClick={() => { setIsSettingsOpen(false); setIsRecycleBinOpen(true); }} className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors group">
                   <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200"><Trash2 size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" /><span className="text-sm font-medium">{t.openRecycleBin}</span></div>
                   <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-xs flex items-center justify-center text-gray-600 dark:text-gray-300">{trashItems.length}</div>
                 </button>
                 <button onClick={() => setIsTermsOpen(true)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 group">
                   <FileText size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" /><span className="text-sm font-medium">{t.termsAndConditions}</span>
                 </button>
              </div>
            </div>
            <div className="flex-shrink-0 p-6 pt-4 border-t dark:border-gray-700">
              <button onClick={() => setIsSettingsOpen(false)} className="w-full py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">{t.close}</button>
            </div>
          </div>
        </div>
      )}

      {isTermsOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm" onClick={() => setIsTermsOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><FileText className="text-indigo-600 dark:text-indigo-400" size={20} />{t.termsTitle}</h2>
              <button onClick={() => setIsTermsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: t.termsContent }} />
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <button onClick={() => setIsTermsOpen(false)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">{t.close}</button>
            </div>
          </div>
        </div>
      )}

      <RecycleBinModal isOpen={isRecycleBinOpen} onClose={() => setIsRecycleBinOpen(false)} items={trashItems} onRestore={handleRestoreItem} onDeletePermanent={handlePermanentDelete} onEmptyBin={() => { setItems((prev) => prev.filter((i) => !i.deletedAt)); }} lang={language} />
      <ExpirationAlertModal isOpen={isExpiryAlertOpen} onClose={() => setIsExpiryAlertOpen(false)} items={expiringItems} lang={language} />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={handleCloseOnboarding} lang={language} />
      <LanguageSelectorModal isOpen={isLanguageSelectorOpen} onSelect={handleLanguageSelect} />
    </div>
  );
};

export default App;
