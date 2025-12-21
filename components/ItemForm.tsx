
import React, { useState, useEffect } from 'react';
import { ShoppingItem, MediaItem, ItemStatus } from '../types';
import { MediaUploader } from './MediaUploader';
import { analyzeItemImage } from '../services/geminiService';
import { Loader2, Sparkles, Save, X, Trash2, Share2, Check, Info, Calendar } from 'lucide-react';
import { TRANSLATIONS, Language, CATEGORY_KEYS, CURRENCY_OPTIONS } from '../constants';

interface ItemFormProps {
  initialData?: Partial<ShoppingItem>;
  onSubmit: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  lang?: Language;
  enableAI?: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  onDelete,
  lang = 'en', 
  enableAI = true
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORY_KEYS[0]);
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [currency, setCurrency] = useState(initialData?.currency || 'JPY');
  const [isPriceUnknown, setIsPriceUnknown] = useState(initialData?.price === null);
  const [store, setStore] = useState(initialData?.store || '');
  const [isStoreUnknown, setIsStoreUnknown] = useState(initialData?.store === null);
  const [status, setStatus] = useState<ItemStatus>(initialData?.status || 'to-buy');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [media, setMedia] = useState<MediaItem[]>(initialData?.media || []);
  const [expiryDate, setExpiryDate] = useState<number | undefined>(initialData?.expiryDate);
  const [isAIEnabled, setIsAIEnabled] = useState(enableAI);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [showAITip, setShowAITip] = useState(false);

  const EXPIRY_CATEGORIES = ['Cooking Ingredients', 'Food & Drinks', 'Cosmetics', 'Medicine'];
  const showExpiryDate = EXPIRY_CATEGORIES.includes(category);

  useEffect(() => {
     if (initialData?.category && !CATEGORY_KEYS.includes(initialData.category)) setCategory('Others');
  }, [initialData]);

  useEffect(() => {
    if (shareFeedback) {
      const timer = setTimeout(() => setShareFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [shareFeedback]);

  useEffect(() => {
    if (showAITip) {
      const handleGlobalClick = () => setShowAITip(false);
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }
  }, [showAITip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      price: isPriceUnknown ? null : (parseFloat(price) || 0),
      currency,
      store: isStoreUnknown ? null : store,
      status,
      notes,
      media,
      expiryDate: showExpiryDate ? expiryDate : undefined,
    });
  };

  const handleAutoFill = async (file: File) => {
    if (!isAIEnabled) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeItemImage(file, currency);
      setName(result.name);
      setCategory(CATEGORY_KEYS.find(c => c.toLowerCase() === result.category.toLowerCase()) || 'Others');
      if (result.price !== null) {
        setPrice(result.price.toString());
        setIsPriceUnknown(false);
      } else {
        setPrice('');
        setIsPriceUnknown(true);
      }
      if (result.notes) setNotes((prev) => prev ? `${prev}\nAI Note: ${result.notes}` : result.notes);
    } catch (err) {
      console.error("Failed to analyze image", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShare = async () => {
    const payload = { n: name, c: category, p: isPriceUnknown ? null : price, s: store, st: status, nt: notes };
    try {
      const json = JSON.stringify(payload);
      const encoded = btoa(encodeURIComponent(json));
      const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
      await navigator.clipboard.writeText(url);
      setShareFeedback(t.shareWarning);
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const toInputDateValue = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white dark:bg-gray-800 transition-colors relative overflow-x-hidden">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{initialData ? t.edit : t.create}</h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleShare} className="text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 p-2 rounded-full transition-colors cursor-pointer relative" title={t.share}>{shareFeedback === t.shareSuccess ? <Check size={20} /> : <Share2 size={20} />}</button>
          {initialData?.id && onDelete && <button type="button" onClick={() => initialData.id && onDelete(initialData.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full transition-colors cursor-pointer" title={t.delete}><Trash2 size={20} /></button>}
          <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={24} /></button>
        </div>
      </div>
      
      {shareFeedback && <div className="absolute top-[70px] left-0 right-0 mx-4 z-10"><div className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2"><Check size={14} className="flex-shrink-0" /><p className="flex-1">{t.shareSuccess} <span className="opacity-80 block text-[10px] mt-0.5 font-normal">{t.shareWarning}</span></p></div></div>}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 overflow-x-hidden">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.mediaTitle}</label>
          <div className="flex items-center gap-3 mb-3 relative">
             <button type="button" onClick={() => setIsAIEnabled(!isAIEnabled)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isAIEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}><span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isAIEnabled ? 'translate-x-5' : 'translate-x-1'}`} /></button>
              <span className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none" onClick={() => setIsAIEnabled(!isAIEnabled)}>{t.enableAI}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setShowAITip(!showAITip); }} className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors ml-1"><Info size={16} /></button>
              {showAITip && <div className="absolute top-8 left-0 z-20 w-64 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs p-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-1">{t.aiLanguageWarning}</div>}
          </div>
          {isAIEnabled && <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 mb-4 text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><Sparkles size={16} className="mt-0.5 flex-shrink-0" /><p key={`tip-${lang}`}>{t.uploadTip}</p></div>}
          <MediaUploader media={media} onMediaChange={setMedia} onAnalyzeReq={isAIEnabled ? handleAutoFill : undefined} lang={lang} />
          {isAnalyzing && <div className="mt-2 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm animate-pulse"><Loader2 size={16} className="animate-spin" /><span>{t.analyzing}</span></div>}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.nameLabel}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base" placeholder={t.namePlaceholder} />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.catLabel}</label>
             <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base">
               {CATEGORY_KEYS.map(cat => <option key={cat} value={cat}>{t.categories[cat as keyof typeof t.categories] || cat}</option>)}
             </select>
          </div>
          {showExpiryDate && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-500 dark:text-gray-400" />
                {t.expiryDate} <span className="text-[10px] opacity-70 font-normal ml-auto">(YYYY/MM/DD)</span>
              </label>
              <input type="date" value={toInputDateValue(expiryDate)} onChange={(e) => { const val = e.target.value; if (val) { const d = new Date(val); d.setHours(12, 0, 0, 0); setExpiryDate(d.getTime()); } else { setExpiryDate(undefined); } }} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.priceLabel}</label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} disabled={isPriceUnknown} className="w-24 px-2 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 text-base">
                  {CURRENCY_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.value} ({opt.symbol})</option>)}
                </select>
                <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} disabled={isPriceUnknown} className="flex-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:text-gray-400 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base" placeholder={isPriceUnknown ? "-" : "0.00"} />
              </div>
              <div className="flex items-center">
                 <input type="checkbox" id="unknownPrice" checked={isPriceUnknown} onChange={(e) => { setIsPriceUnknown(e.target.checked); if (e.target.checked) setPrice(''); }} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                <label htmlFor="unknownPrice" className="ml-2 text-base text-gray-700 dark:text-gray-300 select-none">{t.dontKnow}</label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.storeLabel}</label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input type="text" value={store} onChange={(e) => setStore(e.target.value)} disabled={isStoreUnknown} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:text-gray-400 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base" placeholder={isStoreUnknown ? "-" : t.storePlaceholder} />
              </div>
              <div className="flex items-center h-[48px]">
                <input type="checkbox" id="unknownStore" checked={isStoreUnknown} onChange={(e) => { setIsStoreUnknown(e.target.checked); if (e.target.checked) setStore(''); }} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                <label htmlFor="unknownStore" className="ml-2 text-base text-gray-700 dark:text-gray-300 select-none">{t.dontKnow}</label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.statusLabel}</label>
            <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button type="button" onClick={() => setStatus('to-buy')} className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${status === 'to-buy' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>{t.toBuy}</button>
              <button type="button" onClick={() => setStatus('low')} className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${status === 'low' ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>{t.low}</button>
              <button type="button" onClick={() => setStatus('in-stock')} className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${status === 'in-stock' ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>{t.inStock}</button>
              <button type="button" onClick={() => setStatus('dont-like')} className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${status === 'dont-like' ? 'bg-white dark:bg-gray-600 text-red-600 dark:text-red-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>{t.dontLike}</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.noteLabel}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base" placeholder={t.notePlaceholder} />
          </div>
        </div>
      </div>
      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2 text-base"><Save size={20} />{t.save}</button>
      </div>
    </form>
  );
};
