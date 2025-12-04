
export type Language = 'en' | 'ja' | 'zh' | 'my' | 'ko';

export const CATEGORY_KEYS = ['Cooking Ingredients', 'Food & Drinks', 'Household products', 'Cosmetics', 'Medicine', 'Clothing', 'Electronics', 'Others'];

export type Currency = 'USD' | 'JPY' | 'CNY' | 'MMK' | 'KRW' | 'SGD';

export const CURRENCY_OPTIONS: {value: Currency, label: string, symbol: string}[] = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { value: 'CNY', label: 'CNY (¥)', symbol: '¥' },
  { value: 'MMK', label: 'MMK (K)', symbol: 'K' },
  { value: 'KRW', label: 'KRW (₩)', symbol: '₩' },
  { value: 'SGD', label: 'SGD (S$)', symbol: 'S$' },
];

export const TRANSLATIONS = {
  en: {
    appName: 'SmartShop',
    all: 'All Items',
    search: 'Search items...',
    filter: 'Filter:',
    toBuy: 'To Buy',
    low: 'Low Stock',
    inStock: 'In Stock',
    dontLike: "Don't Like",
    price: 'Price',
    priceRange: 'Price Range',
    min: 'Min',
    max: 'Max',
    settings: 'Settings',
    help: 'Help & Guide',
    theme: 'Theme',
    language: 'Language',
    currency: 'Currency',
    enableAI: 'Enable AI Auto-fill',
    aiLanguageWarning: 'Fill details using AI will only be available in ENGLISH.',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    close: 'Close',
    save: 'Save Item',
    delete: 'Delete',
    cancel: 'Cancel',
    edit: 'Edit Item',
    create: 'New Item',
    mediaTitle: 'Photos & Videos',
    uploadTip: 'Upload a photo to automatically fill details using AI!',
    analyzing: 'Analyzing...',
    nameLabel: 'Item Name',
    namePlaceholder: 'e.g., Milk, Batteries',
    catLabel: 'Category',
    priceLabel: 'Price',
    storeLabel: 'Store / Location',
    storePlaceholder: 'e.g., Supermarket, Online',
    statusLabel: 'Status',
    noteLabel: 'Notes',
    notePlaceholder: 'Size, color, quantity, etc.',
    dontKnow: "Don't know",
    noItems: 'No items found',
    emptyState: 'Try adjusting your filters or search query.',
    createFirst: 'Create First Item',
    markBought: 'Mark Bought',
    addList: 'Add to List',
    confirmDelete: 'Are you sure you want to delete this item?',
    addMedia: 'Add Media',
    recycleBin: 'Recycle Bin',
    recentlyDeleted: 'Recently Deleted',
    openRecycleBin: 'Recently Deleted',
    restore: 'Restore',
    deletePermanently: 'Delete Permanently',
    emptyBin: 'Empty Bin',
    noTrashItems: 'Trash is empty',
    trashTip: 'Items in trash will be automatically deleted after 30 days.',
    itemMovedToTrash: 'Item moved to trash',
    undo: 'Undo',
    storage: 'Storage',
    used: 'Used',
    available: 'Available',
    footerCreatedBy: 'Created by',
    footerEmailPrompt: 'Feel free to email me if you have any ideas for this web app.',
    footerClickHere: 'Click here.',
    share: 'Share',
    shareSuccess: 'Link copied to clipboard!',
    shareWarning: 'Link generated. Note: Photos/Videos are not shared.',
    itemImported: 'Shared item imported!',
    termsAndConditions: 'Terms & Conditions',
    termsTitle: 'Data Storage & Privacy Policy',
    daysLeft: 'days left',
    totalItems: 'Total items',
    deletionInfo: 'Items show the days remaining before deletion. After that time, items will be permanently deleted.',
    onboarding: {
      welcomeTitle: 'Welcome to SmartShop',
      welcomeDesc: 'The intelligent way to organize your shopping list and home inventory.',
      aiTitle: 'AI-Powered Entry',
      aiDesc: 'Simply upload a photo of a product. Our AI will identify the name, category, and even estimate the price for you.',
      trackTitle: 'Track Status',
      trackDesc: 'Easily filter items by "To Buy", "In Stock", or "Low Stock". Tap the icon on any item to quickly toggle its status.',
      privacyTitle: 'Private & Local',
      privacyDesc: 'Your data and photos are stored directly on your device. We value your privacy. More details can be checked in the Terms & Conditions.',
      next: 'Next',
      prev: 'Back',
      start: 'Get Started'
    },
    termsContent: `
    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">1. What kind of storage is used?</h3>
    <p class="mb-4">The application uses <strong class="text-gray-900 dark:text-white">IndexedDB.</strong><br/>
    This is a standard, low-level API provided by modern web browsers to store significant amounts of structured data, including files/blobs, directly inside the user's browser.</p>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">2. Where are the media files uploaded?</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">They are stored locally on the user's device.</strong></p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">No Cloud Server:</strong> The app does not upload your photos or videos to a cloud server (like AWS S3, Firebase, or a dedicated backend).</li>
      <li><strong class="text-gray-900 dark:text-white">Local Blob Storage:</strong> When a user selects a file, the binary data (the file itself) is saved directly into the browser's IndexedDB database under the store name SmartShopDB.</li>
      <li>Note: There is one exception. If the user uses the "AI Auto-fill" feature, the image is temporarily sent to Google's Gemini API for analysis, but it is not stored there permanently for the app's hosting purposes.</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">3. Is it safe?</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">Privacy-wise: Yes.</strong></p>
    <p class="mb-4">Since the data lives on the user's device, you (the developer) and other users cannot see their data. It is completely private to the specific browser and device they are using.</p>

    <p class="mb-2"><strong class="text-gray-900 dark:text-white">Data Security-wise: Moderate Risk.</strong></p>
    <p class="mb-2">Because there is no cloud backup:</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>If the user clears their browser's "Site Data" or "Cache," <strong class="text-gray-900 dark:text-white">all data (including photos) will be lost.</strong></li>
      <li>If the user loses their phone or their computer crashes, the data is unrecoverable.</li>
      <li>The data does not sync between devices (e.g., adding an item on a phone won't show up on a laptop).</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">4. How long does the media last?</h3>
    <p class="mb-2">The media lasts <strong class="text-gray-900 dark:text-white">indefinitely</strong>, with specific conditions:</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">Persistence Request:</strong> Your code calls initStoragePersistence() in services/storage.ts. This asks the browser not to delete the data automatically, even if device storage is running low. If the browser grants this, the data is very stable.</li>
      <li><strong class="text-gray-900 dark:text-white">User Action:</strong> The media stays until the user explicitly deletes the item.</li>
      <li><strong class="text-gray-900 dark:text-white">Trash Logic:</strong> Your App.tsx contains logic that automatically permanently deletes items that have been in the "Recycle Bin" (deleted status) for more than <strong class="text-gray-900 dark:text-white">30 days</strong>.</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">Summary for Users</h3>
    <p>Your data is stored privately on your device. We do not upload your personal photos to the cloud. However, please do not clear your browser data for this site, or you will lose your list.</p>
    `,
    categories: {
      'Cooking Ingredients': 'Cooking Ingredients',
      'Food & Drinks': 'Food & Drinks',
      'Household products': 'Household Products',
      'Cosmetics': 'Cosmetics',
      'Medicine': 'Medicine',
      'Clothing': 'Clothing',
      'Electronics': 'Electronics',
      'Others': 'Others'
    }
  },
  ja: {
    appName: 'SmartShop',
    all: 'すべて',
    search: '検索...',
    filter: 'フィルター:',
    toBuy: '買うもの',
    low: '残りわずか',
    inStock: '在庫あり',
    dontLike: "買わない",
    price: '価格',
    priceRange: '価格範囲',
    min: '最小',
    max: '最大',
    settings: '設定',
    help: 'ヘルプとガイド',
    theme: 'テーマ',
    language: '言語',
    currency: '通貨',
    enableAI: 'AI自動入力を有効化',
    aiLanguageWarning: 'AIによる自動入力は英語のみ利用可能です。',
    light: 'ライト',
    dark: 'ダーク',
    system: 'システム',
    close: '閉じる',
    save: '保存',
    delete: '削除',
    cancel: 'キャンセル',
    edit: '編集',
    create: '新規作成',
    mediaTitle: '写真・動画',
    uploadTip: '写真をアップロードするとAIが自動入力します！',
    analyzing: '解析中...',
    nameLabel: '商品名',
    namePlaceholder: '例: 牛乳、電池',
    catLabel: 'カテゴリー',
    priceLabel: '価格',
    storeLabel: '店 / 場所',
    storePlaceholder: '例: スーパー、オンライン',
    statusLabel: '状態',
    noteLabel: 'メモ',
    notePlaceholder: 'サイズ、色、数量など',
    dontKnow: "不明",
    noItems: 'アイテムが見つかりません',
    emptyState: 'フィルターや検索条件を変更してください。',
    createFirst: '最初のアイテムを作成',
    markBought: '購入済みにする',
    addList: 'リストに追加',
    confirmDelete: '本当に削除しますか？',
    addMedia: 'メディア追加',
    recycleBin: 'ゴミ箱',
    recentlyDeleted: '最近削除した項目',
    openRecycleBin: '最近削除した項目',
    restore: '復元',
    deletePermanently: '完全に削除',
    emptyBin: 'ゴミ箱を空にする',
    noTrashItems: 'ゴミ箱は空です',
    trashTip: 'アイテムは30日後に自動的に削除されます。',
    itemMovedToTrash: 'ゴミ箱に移動しました',
    undo: '元に戻す',
    storage: 'ストレージ',
    used: '使用中',
    available: '利用可能',
    footerCreatedBy: '作成者:',
    footerEmailPrompt: 'ご意見やアイデアがございましたら、お気軽にメールください。',
    footerClickHere: 'ここをクリック',
    share: '共有',
    shareSuccess: 'リンクをコピーしました！',
    shareWarning: 'リンクを作成しました。注意：写真や動画は共有されません。',
    itemImported: '共有アイテムを読み込みました！',
    termsAndConditions: '利用規約とプライバシー',
    termsTitle: 'データ保存とプライバシーポリシー',
    daysLeft: '日残り',
    totalItems: '合計アイテム',
    deletionInfo: 'アイテムは表示されている残り日数が経過すると完全に削除されます。',
    onboarding: {
      welcomeTitle: 'SmartShopへようこそ',
      welcomeDesc: '買い物リストと家庭の在庫を整理するスマートな方法です。',
      aiTitle: 'AIによる自動入力',
      aiDesc: '商品の写真をアップロードするだけです。AIが名前、カテゴリー、価格を自動的に特定します。',
      trackTitle: 'ステータス管理',
      trackDesc: '「買うもの」「在庫あり」「残りわずか」で簡単にフィルタリングできます。アイコンをタップして切り替えます。',
      privacyTitle: 'プライバシーとローカル保存',
      privacyDesc: 'データと写真はすべてお使いのデバイスに直接保存されます。クラウドには送信されません。詳細は利用規約で確認できます。',
      next: '次へ',
      prev: '戻る',
      start: '始める'
    },
    termsContent: `
    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">1. どのようなストレージを使用していますか？</h3>
    <p class="mb-4">このアプリケーションは<strong class="text-gray-900 dark:text-white">IndexedDB</strong>を使用しています。<br/>
    これは、最新のWebブラウザが提供する標準的なAPIで、ファイルや写真などの構造化されたデータを、ユーザーのブラウザ内に直接保存する仕組みです。</p>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">2. メディアファイルはどこにアップロードされますか？</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">すべて「ユーザーのデバイス内」に保存されます。</strong></p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">クラウドサーバーなし:</strong> このアプリは、写真や動画をAWSやFirebaseなどのクラウドサーバーにアップロードしません。</li>
      <li><strong class="text-gray-900 dark:text-white">ローカル保存:</strong> ユーザーがファイルを選択すると、そのデータはブラウザ内のIndexedDBに直接保存されます。</li>
      <li>注意: 「AI自動入力」機能を使用する場合のみ、画像分析のために一時的にGoogle Gemini APIに送信されますが、アプリのホスティング目的で永続的に保存されることはありません。</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">3. 安全ですか？</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">プライバシーの観点: はい。</strong></p>
    <p class="mb-4">データはユーザーのデバイス内にのみ存在するため、開発者や他のユーザーがデータを見ることはできません。完全にプライベートです。</p>

    <p class="mb-2"><strong class="text-gray-900 dark:text-white">データの安全性の観点: 中程度のリスク。</strong></p>
    <p class="mb-2">クラウドバックアップがないため、以下の点にご注意ください。</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>ブラウザの「サイトデータ」や「キャッシュ」を削除すると、<strong class="text-gray-900 dark:text-white">写真を含むすべてのデータが消えます。</strong></li>
      <li>スマートフォンを紛失したり、故障した場合、データの復旧はできません。
      <li>デバイス間（スマホとPCなど）でのデータ同期は行われません。</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">4. データはいつまで保存されますか？</h3>
    <p class="mb-2">基本的に<strong class="text-gray-900 dark:text-white">無期限</strong>ですが、いくつかの条件があります。</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">永続化リクエスト:</strong> アプリはブラウザに対してデータを自動削除しないよう要求しています。許可されれば、データは安定して保持されます。</li>
      <li><strong class="text-gray-900 dark:text-white">ユーザーの操作:</strong> ユーザーが削除しない限り残ります。</li>
      <li><strong class="text-gray-900 dark:text-white">ゴミ箱のロジック:</strong> 「ゴミ箱」に入れたアイテムは、<strong class="text-gray-900 dark:text-white">30日</strong>経過すると自動的に完全に削除されます。</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">ユーザーへの要約</h3>
    <p>あなたのデータは、あなたのデバイス内にプライベートに保存されています。個人の写真をクラウドにアップロードすることはありません。ただし、ブラウザのデータをクリアするとリストが失われるため、ご注意ください。</p>
    `,
    categories: {
      'Cooking Ingredients': '食材',
      'Food & Drinks': '食品・飲料',
      'Household products': '日用品',
      'Cosmetics': '化粧品',
      'Medicine': '医薬品',
      'Clothing': '衣類',
      'Electronics': '家電',
      'Others': 'その他'
    }
  },
  zh: {
    appName: 'SmartShop',
    all: '所有物品',
    search: '搜索...',
    filter: '筛选:',
    toBuy: '待购买',
    low: '库存不足',
    inStock: '有库存',
    dontLike: "不买/不喜欢",
    price: '价格',
    priceRange: '价格范围',
    min: '最小',
    max: '最大',
    settings: '设置',
    help: '帮助与指南',
    theme: '主题',
    language: '语言',
    currency: '货币',
    enableAI: '启用 AI 自动填充',
    aiLanguageWarning: 'AI 自动填充仅支持英语。',
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
    close: '关闭',
    save: '保存',
    delete: '删除',
    cancel: '取消',
    edit: '编辑',
    create: '新建物品',
    mediaTitle: '照片与视频',
    uploadTip: '上传照片，AI将自动填写详情！',
    analyzing: '分析中...',
    nameLabel: '名称',
    namePlaceholder: '例如：牛奶、电池',
    catLabel: '类别',
    priceLabel: '价格',
    storeLabel: '商店 / 地点',
    storePlaceholder: '例如：超市、网购',
    statusLabel: '状态',
    noteLabel: '备注',
    notePlaceholder: '尺寸、颜色、数量等',
    dontKnow: "未知",
    noItems: '未找到物品',
    emptyState: '请尝试调整筛选或搜索条件。',
    createFirst: '创建第一个物品',
    markBought: '标记为已购',
    addList: '加入清单',
    confirmDelete: '确定要删除此物品吗？',
    addMedia: '添加媒体',
    recycleBin: '回收站',
    recentlyDeleted: '最近删除',
    openRecycleBin: '最近删除',
    restore: '恢复',
    deletePermanently: '永久删除',
    emptyBin: '清空回收站',
    noTrashItems: '回收站为空',
    trashTip: '物品将在30天后自动删除。',
    itemMovedToTrash: '物品已移至回收站',
    undo: '撤销',
    storage: '存储空间',
    used: '已用',
    available: '可用',
    footerCreatedBy: '创建者:',
    footerEmailPrompt: '如果您有任何想法，请随时发邮件给我。',
    footerClickHere: '点击这里',
    share: '分享',
    shareSuccess: '链接已复制！',
    shareWarning: '链接已生成。注意：照片/视频无法共享。',
    itemImported: '已导入分享的物品！',
    termsAndConditions: '条款与隐私',
    termsTitle: '数据存储与隐私政策',
    daysLeft: '天剩余',
    totalItems: '总项目',
    deletionInfo: '显示的剩余天数归零后，项目将被永久删除。',
    onboarding: {
      welcomeTitle: '欢迎使用 SmartShop',
      welcomeDesc: '管理购物清单和家庭库存的智能方式。',
      aiTitle: 'AI 智能录入',
      aiDesc: '只需上传产品照片，AI 将为您识别名称、类别甚至估算价格。',
      trackTitle: '状态追踪',
      trackDesc: '轻松筛选“待购买”、“有库存”或“库存不足”的物品。点击图标即可快速切换状态。',
      privacyTitle: '隐私与本地存储',
      privacyDesc: '您的数据和照片直接存储在您的设备上。我们非常重视您的隐私。更多详情请查看条款与条件。',
      next: '下一步',
      prev: '返回',
      start: '开始使用'
    },
    termsContent: `
    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">1. 使用了什么类型的存储？</h3>
    <p class="mb-4">应用程序使用 <strong class="text-gray-900 dark:text-white">IndexedDB</strong>。<br/>
    这是现代网络浏览器提供的标准底层 API，用于直接在用户浏览器中存储大量结构化数据（包括文件/图像）。</p>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">2. 媒体文件上传到了哪里？</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">它们存储在用户设备的本地。</strong></p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">无云端服务器：</strong> 此应用不会将您的照片或视频上传到云服务器（如 AWS S3、Firebase 或专用后端）。</li>
      <li><strong class="text-gray-900 dark:text-white">本地 Blob 存储：</strong> 当用户选择文件时，二进制数据（文件本身）直接保存到浏览器的 IndexedDB 数据库中。</li>
      <li>注意：有一个例外。如果用户使用“AI 自动填充”功能，图像会临时发送到 Google Gemini API 进行分析，但不会为了应用的托管目的而永久存储。</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">3. 安全吗？</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">隐私方面：是的。</strong></p>
    <p class="mb-4">由于数据存储在用户设备上，开发者和其他用户无法查看您的数据。它对于特定的浏览器和设备是完全私密的。</p>

    <p class="mb-2"><strong class="text-gray-900 dark:text-white">数据安全方面：中等风险。</strong></p>
    <p class="mb-2">因为没有云备份：</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>如果用户清除浏览器的“站点数据”或“缓存”，<strong class="text-gray-900 dark:text-white">所有数据（包括照片）都将丢失。</strong></li>
      <li>如果手机丢失或电脑崩溃，数据将无法恢复。</li>
      <li>数据不会在设备之间同步（例如，在手机上添加的物品不会显示在电脑上）。</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">4. 媒体文件能保存多久？</h3>
    <p class="mb-2">媒体文件将<strong class="text-gray-900 dark:text-white">无限期</strong>保存，但有特定条件：</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">持久化请求：</strong> 代码调用了 storage.ts 中的 initStoragePersistence()。这请求浏览器不要自动删除数据，即使设备存储空间不足。如果浏览器批准，数据将非常稳定。</li>
      <li><strong class="text-gray-900 dark:text-white">用户操作：</strong> 除非用户明确删除物品，否则媒体将一直保留。</li>
      <li><strong class="text-gray-900 dark:text-white">回收站逻辑：</strong> App.tsx 包含逻辑，会自动永久删除在“回收站”中停留超过 <strong class="text-gray-900 dark:text-white">30 天</strong>的物品。</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">给用户的总结</h3>
    <p>您的数据私密地存储在您的设备上。我们不会将您的个人照片上传到云端。但是，请不要清除此网站的浏览器数据，否则您的清单将会丢失。</p>
    `,
    categories: {
      'Cooking Ingredients': '烹饪原料',
      'Food & Drinks': '食品饮料',
      'Household products': '家居用品',
      'Cosmetics': '化妆品',
      'Medicine': '药品',
      'Clothing': '服装',
      'Electronics': '电子产品',
      'Others': '其他'
    }
  },
  my: {
    appName: 'SmartShop',
    all: 'ပစ္စည်းအားလုံး',
    search: 'ရှာဖွေရန်...',
    filter: 'စစ်ထုတ်ရန်:',
    toBuy: 'ဝယ်ရန်',
    low: 'လက်ကျန်နည်း',
    inStock: 'ရှိသည်',
    dontLike: "မဝယ်တော့ပါ",
    price: 'ဈေးနှုန်း',
    priceRange: 'ဈေးနှုန်း အကွာအဝေး',
    min: 'အနည်းဆုံး',
    max: 'အများဆုံး',
    settings: 'ဆက်တင်များ',
    help: 'လမ်းညွှန်',
    theme: 'အသွင်အပြင်',
    language: 'ဘာသာစကား',
    currency: 'ငွေကြေး',
    enableAI: 'AI အလိုအလျောက်ဖြည့်သွင်းမှုကို ဖွင့်ရန်',
    aiLanguageWarning: 'AI ဖြင့် အချက်အလက်ဖြည့်သွင်းခြင်းကို အင်္ဂလိပ်စာဖြင့်သာ ရရှိနိုင်ပါသည်။',
    light: 'အလင်း',
    dark: 'အမှောင်',
    system: 'System အတိုင်း',
    close: 'ပိတ်ရန်',
    save: 'သိမ်းဆည်းရန်',
    delete: 'ဖျက်ရန်',
    cancel: 'မလုပ်တော့ပါ',
    edit: 'ပြင်ဆင်ရန်',
    create: 'အသစ်ဖန်တီးရန်',
    mediaTitle: 'ဓာတ်ပုံနှင့်ဗီဒီယိုများ',
    uploadTip: 'ဓာတ်ပုံတင်ပြီး AI ဖြင့်အချက်အလက်များကို အလိုအလျောက်ဖြည့်ပါ!',
    analyzing: 'လေ့လာဆန်းစစ်နေသည်...',
    nameLabel: 'ပစ္စည်းအမည်',
    namePlaceholder: 'ဥပမာ - နို့၊ ဓာတ်ခဲ',
    catLabel: 'အမျိုးအစား',
    priceLabel: 'ဈေးနှုန်း',
    storeLabel: 'ဆိုင် / နေရာ',
    storePlaceholder: 'ဥပမာ - စူပါမားကတ်၊ အွန်လိုင်း',
    statusLabel: 'အခြေအနေ',
    noteLabel: 'မှတ်ချက်များ',
    notePlaceholder: 'အရွယ်အစား၊ အရောင်၊ အရေအတွက် စသည်',
    dontKnow: "မသိပါ",
    noItems: 'ပစ္စည်းမတွေ့ပါ',
    emptyState: 'စစ်ထုတ်မှုများ သို့မဟုတ် ရှာဖွေမှုကို ပြင်ဆင်ကြည့်ပါ။',
    createFirst: 'ပထမဆုံးပစ္စည်းကို ဖန်တီးပါ',
    markBought: 'ဝယ်ပြီးကြောင်းမှတ်သားမည်',
    addList: 'စာရင်းထဲထည့်မည်',
    confirmDelete: 'ဤပစ္စည်းကို ဖျက်မည်မှာ သေချာပါသလား?',
    addMedia: 'မီဒီယာထည့်ရန်',
    recycleBin: 'အမှိုက်ပုံး',
    recentlyDeleted: 'မကြာသေးမီက ဖျက်လိုက်သည်များ',
    openRecycleBin: 'မကြာသေးမီက ဖျက်လိုက်သည်များ',
    restore: 'ပြန်လည်ရယူရန်',
    deletePermanently: 'အပြီးတိုင်ဖျက်ရန်',
    emptyBin: 'အမှိုက်ပုံးရှင်းရန်',
    noTrashItems: 'အမှိုက်ပုံး ရှင်းနေပါသည်',
    trashTip: 'ပစ္စည်းများကို ရက် ၃၀ ကြာလျှင် အလိုအလျောက် ဖျက်ပါမည်။',
    itemMovedToTrash: 'ပစ္စည်းကို အမှိုက်ပုံးသို့ ရွှေ့လိုက်ပါပြီ',
    undo: 'ပြန်သွားရန်',
    storage: 'သိုလှောင်ခန်း',
    used: 'သုံးပြီး',
    available: 'ကျန်ရှိ',
    footerCreatedBy: 'ဖန်တီးသူ -',
    footerEmailPrompt: 'ဤ Web App အတွက် အကြံဉာဏ်များရှိပါက ကျွန်ုပ်ထံ အီးမေးလ်ပေးပို့နိုင်ပါသည်။',
    footerClickHere: 'ဒီမှာနှိပ်ပါ',
    share: 'မျှဝေရန်',
    shareSuccess: 'လင့်ခ်ကို ကူးယူပြီးပါပြီ!',
    shareWarning: 'လင့်ခ်ထုတ်ပြီးပါပြီ။ ဓာတ်ပုံ/ဗီဒီယိုများ မပါဝင်ပါ။',
    itemImported: 'မျှဝေထားသောပစ္စည်းကို ထည့်သွင်းပြီးပါပြီ!',
    termsAndConditions: 'စည်းမျဉ်းများနှင့် မူဝါဒများ',
    termsTitle: 'ဒေတာသိမ်းဆည်းမှုနှင့် လုံခြုံရေးမူဝါဒ',
    daysLeft: 'ရက်ကျန်',
    totalItems: 'စုစုပေါင်း',
    deletionInfo: 'ဤအချိန်ကျော်လွန်ပါက ပစ္စည်းများ အပြီးတိုင် ပျက်သွားပါမည်။',
    onboarding: {
      welcomeTitle: 'SmartShop မှ ကြိုဆိုပါတယ်',
      welcomeDesc: 'ဈေးဝယ်စာရင်းနှင့် အိမ်တွင်းပစ္စည်းများကို စနစ်တကျစီမံခန့်ခွဲနိုင်သော Smart Application ဖြစ်ပါသည်။',
      aiTitle: 'AI အကူအညီ',
      aiDesc: 'ကုန်ပစ္စည်းဓာတ်ပုံကို တင်လိုက်ရုံဖြင့် အမည်၊ အမျိုးအစားနှင့် ဈေးနှုန်းများကို AI က အလိုအလျောက် ဖြည့်ပေးပါလိမ့်မည်။',
      trackTitle: 'အခြေအနေစစ်ဆေးခြင်း',
      trackDesc: '"ဝယ်ရန်"၊ "ရှိသည်"၊ "လက်ကျန်နည်း" စသည်ဖြင့် ခွဲခြားသိမ်းဆည်းနိုင်ပြီး အိုင်ကွန်ကိုနှိပ်၍ လွယ်ကူစွာ ပြောင်းလဲနိုင်ပါသည်။',
      privacyTitle: 'လုံခြုံမှု',
      privacyDesc: 'သင့်ဒေတာနှင့် ဓာတ်ပုံများသည် သင့်ဖုန်း/ကွန်ပျူတာထဲတွင်သာ သိမ်းဆည်းထားမည်ဖြစ်၍ လုံခြုံမှုရှိပါသည်။ အသေးစိတ်အချက်အလက်များကို စည်းမျဉ်းများနှင့် မူဝါဒများတွင် ကြည့်ရှုနိုင်ပါသည်။',
      next: 'ရှေ့သို့',
      prev: 'နောက်သို့',
      start: 'စတင်မည်'
    },
    termsContent: `
    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">1. မည်သို့သော Storage ကို အသုံးပြုထားသနည်း?</h3>
    <p class="mb-4">ဤ Application သည် <strong class="text-gray-900 dark:text-white">IndexedDB</strong> ကို အသုံးပြုထားပါသည်။<br/>
    ၎င်းသည် ခေတ်မီ Web Browser များတွင် ပါဝင်သော စနစ်တစ်ခုဖြစ်ပြီး ဒေတာများ၊ ဓာတ်ပုံများကို Browser အတွင်း၌ပင် တိုက်ရိုက်သိမ်းဆည်းပေးပါသည်။</p>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">2. ဓာတ်ပုံနှင့် ဗီဒီယိုများကို ဘယ်မှာသိမ်းဆည်းသနည်း?</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">၎င်းတို့ကို သင့်ဖုန်း/ကွန်ပျူတာထဲတွင်သာ သိမ်းဆည်းပါသည်။</strong></p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">Cloud Server မရှိပါ:</strong> ဤ App သည် သင့်ဓာတ်ပုံများကို အင်တာနက်ပေါ်ရှိ Server များ (AWS, Firebase စသည်) သို့ ပေးပို့ခြင်းမရှိပါ။</li>
      <li><strong class="text-gray-900 dark:text-white">Local Storage:</strong> သင်ရွေးချယ်လိုက်သော ဖိုင်များသည် သင့် Browser ၏ Database ထဲသို့ တိုက်ရိုက်ရောက်ရှိသွားပါသည်။</li>
      <li>မှတ်ချက်: "AI Auto-fill" ကိုအသုံးပြုပါက ဓာတ်ပုံကို Google Gemini API သို့ ခေတ္တခဏ ပေးပို့၍ အချက်အလက်ဖတ်ရှုမည်ဖြစ်သော်လည်း အမြဲတမ်းသိမ်းဆည်းထားမည် မဟုတ်ပါ။</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">3. လုံခြုံမှုရှိပါသလား?</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">ကိုယ်ရေးကိုယ်တာလုံခြုံမှု: ရှိပါသည်။</strong></p>
    <p class="mb-4">ဒေတာများသည် သင့်စက်ထဲတွင်သာ ရှိသောကြောင့် ဖန်တီးသူ (ကျွန်ုပ်) သော်လည်းကောင်း၊ အခြားသူများသော်လည်းကောင်း သင့်ဒေတာကို မမြင်နိုင်ပါ။</p>

    <p class="mb-2"><strong class="text-gray-900 dark:text-white">ဒေတာပျောက်ဆုံးနိုင်မှု: အသင့်အတင့်ရှိပါသည်။</strong></p>
    <p class="mb-2">Cloud Backup မရှိသောကြောင့် -</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>Browser ၏ "Site Data" သို့မဟုတ် "Clear Cache" လုပ်လိုက်ပါက <strong class="text-gray-900 dark:text-white">ဓာတ်ပုံများအပါအဝင် ဒေတာအားလုံး ပျက်သွားပါမည်။</strong></li>
      <li>ဖုန်းပျောက်သွားပါက (သို့) ပျက်သွားပါက ဒေတာများပြန်ယူ၍ မရနိုင်ပါ။</li>
      <li>စက်တစ်လုံးနှင့်တစ်လုံး ချိတ်ဆက်ထားခြင်းမရှိပါ (ဥပမာ- ဖုန်းထဲတွင် မှတ်ထားသည်ကို ကွန်ပျူတာတွင် မပေါ်နိုင်ပါ)။</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">4. မီဒီယာဖိုင်များ ဘယ်လောက်ကြာကြာခံမည်နည်း?</h3>
    <p class="mb-2">ပုံမှန်အားဖြင့် <strong class="text-gray-900 dark:text-white">အကန့်အသတ်မရှိ</strong> ခံပါသည်။</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">Persistence:</strong> သင့်ဖုန်း Storage ပြည့်နေလျှင်တောင် Browser မှ ဒေတာများကို အလိုအလျောက်မဖျက်ရန် App က တောင်းဆိုထားပါသည်။</li>
      <li><strong class="text-gray-900 dark:text-white">User Action:</strong> သင်ကိုယ်တိုင် မဖျက်မချင်း ရှိနေပါမည်။</li>
      <li><strong class="text-gray-900 dark:text-white">အမှိုက်ပုံး:</strong> "Recycle Bin" ထဲရောက်နေသော ပစ္စည်းများကို <strong class="text-gray-900 dark:text-white">ရက် ၃၀</strong> ကြာပါက အလိုအလျောက် အပြီးတိုင် ဖျက်ဆီးပါမည်။</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">အနှစ်ချုပ်</h3>
    <p>သင့်ဒေတာများသည် သင့်စက်ထဲတွင်သာ သီးသန့်ရှိနေပါသည်။ သင့်ကိုယ်ရေးကိုယ်တာပုံများကို အင်တာနက်ပေါ်သို့ တင်ခြင်းမရှိပါ။ သို့သော် ဤဆိုက်အတွက် Browser Data များကို ရှင်းလင်းခြင်း (Clear Data) မပြုလုပ်မိရန် သတိပြုပါ။</p>
    `,
    categories: {
      'Cooking Ingredients': 'ချက်ပြုတ်ပစ္စည်းများ',
      'Food & Drinks': 'အစားအသောက်',
      'Household products': 'အိမ်သုံးပစ္စည်းများ',
      'Cosmetics': 'အလှကုန်',
      'Medicine': 'ဆေးဝါး',
      'Clothing': 'အဝတ်အစား',
      'Electronics': 'လျှပ်စစ်ပစ္စည်း',
      'Others': 'အခြား'
    }
  },
  ko: {
    appName: 'SmartShop',
    all: '모든 항목',
    search: '검색...',
    filter: '필터:',
    toBuy: '구매 예정',
    low: '재고 부족',
    inStock: '재고 있음',
    dontLike: "비추천/안 삼",
    price: '가격',
    priceRange: '가격 범위',
    min: '최소',
    max: '최대',
    settings: '설정',
    help: '도움말',
    theme: '테마',
    language: '언어',
    currency: '통화',
    enableAI: 'AI 자동 완성 활성화',
    aiLanguageWarning: 'AI 자동 완성 기능은 영어로만 제공됩니다.',
    light: '라이트',
    dark: '다크',
    system: '시스템',
    close: '닫기',
    save: '저장',
    delete: '삭제',
    cancel: '취소',
    edit: '편집',
    create: '새 항목',
    mediaTitle: '사진 및 동영상',
    uploadTip: '사진을 업로드하면 AI가 자동으로 세부 정보를 입력합니다!',
    analyzing: '분석 중...',
    nameLabel: '상품명',
    namePlaceholder: '예: 우유, 건전지',
    catLabel: '카테고리',
    priceLabel: '가격',
    storeLabel: '상점 / 위치',
    storePlaceholder: '예: 슈퍼마켓, 온라인',
    statusLabel: '상태',
    noteLabel: '메모',
    notePlaceholder: '크기, 색상, 수량 등',
    dontKnow: "모름",
    noItems: '항목을 찾을 수 없습니다',
    emptyState: '필터나 검색어를 조정해 보세요.',
    createFirst: '첫 번째 항목 만들기',
    markBought: '구매 완료 표시',
    addList: '목록에 추가',
    confirmDelete: '이 항목을 삭제하시겠습니까?',
    addMedia: '미디어 추가',
    recycleBin: '휴지통',
    recentlyDeleted: '최근 삭제된 항목',
    openRecycleBin: '최근 삭제된 항목',
    restore: '복원',
    deletePermanently: '영구 삭제',
    emptyBin: '휴지통 비우기',
    noTrashItems: '휴지통이 비어 있습니다',
    trashTip: '항목은 30일 후 자동으로 삭제됩니다.',
    itemMovedToTrash: '항목이 휴지통으로 이동되었습니다',
    undo: '실행 취소',
    storage: '저장 공간',
    used: '사용됨',
    available: '사용 가능',
    footerCreatedBy: '제작:',
    footerEmailPrompt: '이 앱에 대한 아이디어가 있으시면 언제든지 이메일을 보내주세요.',
    footerClickHere: '여기를 클릭하세요',
    share: '공유',
    shareSuccess: '링크가 복사되었습니다!',
    shareWarning: '링크가 생성되었습니다. 주의: 사진/동영상은 공유되지 않습니다.',
    itemImported: '공유된 항목을 가져왔습니다!',
    termsAndConditions: '이용 약관 및 개인정보',
    termsTitle: '데이터 저장 및 개인정보 처리방침',
    daysLeft: '일 남음',
    totalItems: '총 항목',
    deletionInfo: '표시된 일수가 지나면 항목이 영구적으로 삭제됩니다.',
    onboarding: {
      welcomeTitle: 'SmartShop에 오신 것을 환영합니다',
      welcomeDesc: '쇼핑 목록과 재고를 정리하는 스마트한 방법입니다.',
      aiTitle: 'AI 기반 입력',
      aiDesc: '제품 사진을 업로드하기만 하면 AI가 이름, 카테고리, 예상 가격까지 자동으로 입력해 줍니다.',
      trackTitle: '상태 추적',
      trackDesc: '"구매 예정", "재고 있음", "재고 부족" 등으로 쉽게 분류하세요. 아이콘을 탭하여 상태를 빠르게 전환할 수 있습니다.',
      privacyTitle: '철저한 보안',
      privacyDesc: '모든 데이터와 사진은 기기에 직접 저장됩니다. 클라우드로 전송되지 않습니다. 자세한 내용은 이용 약관에서 확인할 수 있습니다.',
      next: '다음',
      prev: '이전',
      start: '시작하기'
    },
    termsContent: `
    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">1. 어떤 종류의 저장소를 사용하나요?</h3>
    <p class="mb-4">이 애플리케이션은 <strong class="text-gray-900 dark:text-white">IndexedDB</strong>를 사용합니다.<br/>
    이는 최신 웹 브라우저에서 제공하는 표준 API로, 파일이나 사진을 포함한 구조화된 데이터를 사용자의 브라우저 내부에 직접 저장합니다.</p>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">2. 미디어 파일은 어디에 업로드되나요?</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">사용자의 기기에 로컬로 저장됩니다.</strong></p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">클라우드 서버 없음:</strong> 이 앱은 사진이나 동영상을 클라우드 서버(AWS, Firebase 등)에 업로드하지 않습니다.</li>
      <li><strong class="text-gray-900 dark:text-white">로컬 Blob 저장소:</strong> 파일을 선택하면 바이너리 데이터(파일 자체)가 브라우저의 IndexedDB 데이터베이스에 직접 저장됩니다.</li>
      <li>참고: 한 가지 예외가 있습니다. "AI 자동 완성" 기능을 사용하는 경우, 이미지 분석을 위해 일시적으로 Google Gemini API로 전송되지만, 앱 호스팅 목적으로 영구 저장되지는 않습니다.</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">3. 안전한가요?</h3>
    <p class="mb-2"><strong class="text-gray-900 dark:text-white">개인정보 측면: 예.</strong></p>
    <p class="mb-4">데이터가 사용자 기기에만 존재하므로 개발자나 다른 사용자가 데이터를 볼 수 없습니다. 전적으로 사용자의 브라우저와 기기에 비공개로 유지됩니다.</p>

    <p class="mb-2"><strong class="text-gray-900 dark:text-white">데이터 보안 측면: 중간 정도의 위험.</strong></p>
    <p class="mb-2">클라우드 백업이 없기 때문입니다.</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>브라우저의 "사이트 데이터" 또는 "캐시"를 삭제하면 <strong class="text-gray-900 dark:text-white">사진을 포함한 모든 데이터가 손실됩니다.</strong></li>
      <li>휴대폰을 분실하거나 컴퓨터가 고장 나면 데이터를 복구할 수 없습니다.</li>
      <li>기기 간 데이터 동기화가 되지 않습니다(예: 휴대폰에서 추가한 항목이 노트북에 표시되지 않음).</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">4. 미디어는 얼마나 오래 보관되나요?</h3>
    <p class="mb-2">기본적으로 <strong class="text-gray-900 dark:text-white">무기한</strong> 보관되지만 몇 가지 조건이 있습니다.</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li><strong class="text-gray-900 dark:text-white">영구 저장 요청:</strong> 코드가 브라우저에 데이터를 자동 삭제하지 않도록 요청합니다(Persistent Storage). 브라우저가 이를 승인하면 데이터는 매우 안정적으로 유지됩니다.</li>
      <li><strong class="text-gray-900 dark:text-white">사용자 조치:</strong> 사용자가 직접 항목을 삭제할 때까지 유지됩니다.</li>
      <li><strong class="text-gray-900 dark:text-white">휴지통 로직:</strong> "휴지통"에 있는 항목은 <strong class="text-gray-900 dark:text-white">30일</strong>이 지나면 자동으로 영구 삭제됩니다.</li>
    </ul>

    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">사용자 요약</h3>
    <p>귀하의 데이터는 귀하의 기기에 비공개로 저장됩니다. 개인 사진을 클라우드에 업로드하지 않습니다. 그러나 이 사이트의 브라우저 데이터를 지우면 목록이 손실되므로 주의하십시오.</p>
    `,
    categories: {
      'Cooking Ingredients': '요리 재료',
      'Food & Drinks': '식음료',
      'Household products': '생활용품',
      'Cosmetics': '화장품',
      'Medicine': '의약품',
      'Clothing': '의류',
      'Electronics': '전자제품',
      'Others': '기타'
    }
  }
};
