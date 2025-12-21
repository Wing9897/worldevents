/**
 * 國際化翻譯表
 * 支援語言: zh-tw, zh-cn, en, ja, ko
 */
const I18N = {
    'zh-tw': {
        title: '世界事件 Dashboard',
        filters: '🔍 過濾器',
        clear: '清除',
        timeRange: '時間範圍',
        walletAddress: '錢包地址',
        walletPlaceholder: '輸入 Solana 地址...',
        keywords: '關鍵字標籤',
        keywordsPlaceholder: '輸入關鍵字...',
        keywordsHint: '多個關鍵字用逗號分隔',
        tagsPlaceholder: '會議, 科技, 區塊鏈...',
        applyFilters: '套用過濾器',
        addEvent: '➕ 新增事件',
        addEventTitle: '➕ 新增事件',
        addEventHint: '右鍵地圖可直接新增事件',
        addEventHintDisconnected: '連接錢包後，右鍵地圖可直接新增事件',
        connectWallet: '連接 Phantom 錢包',
        disconnect: '斷開',
        lat: '緯度',
        lng: '經度',
        addEventHere: '在此位置新增事件',
        eventName: '事件名稱 *',
        eventNamePlaceholder: '輸入事件名稱',
        description: '描述',
        eventDescPlaceholder: '輸入詳細描述...',
        date: '日期 *',
        datetime: '日期與時間 *',
        startDateTime: '開始日期與時間 *',
        endDateTime: '結束日期與時間 (可選)',
        selectIcon: '選擇圖標',
        uploadImage: '上傳圖片',
        clickToUpload: '點擊或拖拽上傳圖片',
        uploading: '上傳中...',
        uploadSuccess: '圖片上傳成功',
        uploadFailed: '上傳失敗',
        language: '語言',
        eventLanguage: '事件語言',
        allLanguages: '全部語言',
        eventRegion: '地區',
        allRegions: '全部地區',
        regionTW: '台灣',
        regionCN: '中國',
        regionGB: '英國',
        regionUS: '美國',
        regionJP: '日本',
        regionKR: '韓國',
        regionES: '西班牙',
        regionFR: '法國',
        regionDE: '德國',
        regionBR: '巴西',
        regionRU: '俄羅斯',
        cancel: '取消',
        confirm: '確定',
        create: '創建事件',
        locationNotSelected: '請在地圖上右鍵選擇位置',
        today: '今日',
        week: '本週',
        month: '本月',
        year: '本年',
        all: '全部',
        hour1: '1小時',
        hour3: '3小時',
        hour6: '6小時',
        hour12: '12小時',
        from: '從',
        to: '至',
        remaining: '剩餘',
        times: '次',
        selectDateTime: '選擇日期時間',
        selectStartTime: '選擇開始時間',
        selectEndTime: '選擇結束時間',
        filterMode: '篩選模式',
        modeOverlap: '正在進行',
        modeStart: '開始於',
        modeEnd: '結束於',
        eventSource: '事件來源',
        sourceOfficial: '官方/認證',
        sourceSubscribed: '已訂閱',
        sourceMy: '我的事件',
        subscribe: '訂閱',
        unsubscribe: '取消訂閱',
        subscribed: '已訂閱',
        subscribers: '訂閱者',
        roleOfficial: '官方',
        roleVerified: '認證',
        roleCommunity: '社群',
        roleInstitution: '機構',
        roleUser: '用戶',
        startLabel: '開始：',
        endLabel: '結束：',
        endTimeLabel: '結束時間:',
        noDescription: '無描述',
        walletConnected: '錢包已連接',
        walletDisconnected: '錢包已斷開',
        addressCopied: '地址已複製到剪貼板',
        eventCreated: '事件創建成功！',
        loadError: '載入事件失敗',
        networkError: '網絡錯誤',
        pleaseConnectWallet: '請先連接錢包',
        installPhantom: '請安裝 Phantom 錢包擴展',
        walletConnectionError: '連接錢包失敗: ',
        selectImageFile: '請選擇圖片文件',
        createFailed: '創建失敗',
        darkTheme: '已切換為暗黑主題',
        lightTheme: '已切換為光亮主題',
        langSwitched: '語言已切換為',
        profile: '👤 個人資料',
        myEvents: '👤 我的事件',
        myEventsTitle: '👤 我的事件管理',
        managementCenter: '⚙️ 管理中心',
        profileTab: '個人資料',
        myEventsTab: '我的事件',
        subscriptionsTab: '訂閱管理',
        profileTitle: '👤 個人資料',
        displayName: '顯示名稱',
        displayNamePlaceholder: '輸入你的名稱...',
        saveProfile: '儲存',
        profileSaved: '已儲存',
        remainingCredits: '剩餘創建次數',
        noNameSet: '未設定名稱',
        eventCount: '事件數',
        myEventsList: '我的事件',
        noEvents: '尚無建立的事件',
        deleteConfirm: '確定要刪除此事件嗎？',
        deleteSuccess: '刪除成功',
        delete: '刪除',
        manageSubscriptions: '📋 訂閱管理',
        mySubscriptions: '我的訂閱',
        recommendedAccounts: '推薦帳號',
        noSubscriptions: '尚無訂閱的帳號',
        confirmUnsubscribe: '確定要取消訂閱此帳號嗎？',
        unsubscribeSuccess: '取消訂閱成功',
        subscribeSuccess: '訂閱成功',
        loadMore: '加載更多',
        viewOnSolana: '在 Solana Explorer 查看',
        storageMode: '儲存模式',
        storageOnchain: '上鏈儲存',
        storageOnchainDesc: '永久記錄在 Solana 區塊鏈 (字數限制)',
        storageLocal: '本地儲存',
        storageLocalDesc: '儲存在伺服器資料庫 (無字數限制)',
        joinCommunity: '加入社群',
        region: '地區',
        selectRegion: '-- 請選擇地區 --'
    },
    'zh-cn': {
        title: '世界事件 Dashboard',
        filters: '🔍 过滤器',
        clear: '清除',
        timeRange: '时间范围',
        walletAddress: '钱包地址',
        walletPlaceholder: '输入 Solana 地址...',
        keywords: '关键字标签',
        keywordsPlaceholder: '输入关键字...',
        keywordsHint: '多个关键字用逗号分隔',
        tagsPlaceholder: '会议, 科技, 区块链...',
        applyFilters: '应用过滤器',
        addEvent: '➕ 新增事件',
        addEventTitle: '➕ 新增事件',
        addEventHint: '右键地图可直接新增事件',
        addEventHintDisconnected: '连接钱包后，右键地图可直接新增事件',
        connectWallet: '连接 Phantom 钱包',
        disconnect: '断开',
        lat: '纬度',
        lng: '经度',
        addEventHere: '在此位置新增事件',
        eventName: '事件名称 *',
        eventNamePlaceholder: '输入事件名称',
        description: '描述',
        eventDescPlaceholder: '输入详细描述...',
        date: '日期 *',
        startDateTime: '开始日期与时间 *',
        endDateTime: '结束日期与时间 (可选)',
        selectIcon: '选择图标',
        uploadImage: '上传图片',
        clickToUpload: '点击或拖拽上传图片',
        uploading: '上传中...',
        uploadSuccess: '图片上传成功',
        uploadFailed: '上传失败',
        language: '语言',
        eventLanguage: '事件语言',
        allLanguages: '全部语言',
        eventRegion: '地区',
        allRegions: '全部地区',
        regionTW: '台湾',
        regionCN: '中国',
        regionGB: '英国',
        regionUS: '美国',
        regionJP: '日本',
        regionKR: '韩国',
        regionES: '西班牙',
        regionFR: '法国',
        regionDE: '德国',
        regionBR: '巴西',
        regionRU: '俄罗斯',
        cancel: '取消',
        confirm: '确定',
        create: '创建事件',
        locationNotSelected: '请在地图上右键选择位置',
        today: '今日',
        week: '本周',
        month: '本月',
        year: '本年',
        all: '全部',
        hour1: '1小时',
        hour3: '3小时',
        hour6: '6小时',
        hour12: '12小时',
        from: '从',
        to: '至',
        remaining: '剩余',
        times: '次',
        selectDateTime: '选择日期时间',
        selectStartTime: '选择开始时间',
        selectEndTime: '选择结束时间',
        filterMode: '筛选模式',
        modeOverlap: '正在进行',
        modeStart: '开始于',
        modeEnd: '结束于',
        eventSource: '事件来源',
        sourceOfficial: '官方/认证',
        sourceSubscribed: '已订阅',
        sourceMy: '我的事件',
        subscribe: '订阅',
        unsubscribe: '取消订阅',
        subscribed: '已订阅',
        subscribers: '订阅者',
        roleOfficial: '官方',
        roleVerified: '认证',
        roleCommunity: '社群',
        roleInstitution: '机构',
        roleUser: '用户',
        startLabel: '开始：',
        endLabel: '结束：',
        endTimeLabel: '结束时间:',
        noDescription: '无描述',
        walletConnected: '钱包已连接',
        walletDisconnected: '钱包已断开',
        eventCreated: '事件创建成功！',
        loadError: '加载事件失败',
        networkError: '网络错误',
        pleaseConnectWallet: '请先连接钱包',
        installPhantom: '请安装 Phantom 钱包扩展',
        walletConnectionError: '连接钱包失败: ',
        selectImageFile: '请选择图片文件',
        createFailed: '创建失败',
        darkTheme: '已切换为暗黑主题',
        lightTheme: '已切换为光亮主题',
        langSwitched: '语言已切换为',
        profile: '👤 个人资料',
        myEvents: '👤 我的事件',
        myEventsTitle: '👤 我的事件管理',
        managementCenter: '⚙️ 管理中心',
        profileTab: '个人资料',
        myEventsTab: '我的事件',
        subscriptionsTab: '订阅管理',
        profileTitle: '👤 个人资料',
        displayName: '显示名称',
        displayNamePlaceholder: '输入你的名称...',
        saveProfile: '保存',
        profileSaved: '已保存',
        remainingCredits: '剩余创建次数',
        noNameSet: '未设定名称',
        eventCount: '事件数',
        myEventsList: '我的事件',
        noEvents: '尚无建立的事件',
        deleteConfirm: '确定要删除此事件吗？',
        deleteSuccess: '删除成功',
        delete: '删除',
        manageSubscriptions: '📋 订阅管理',
        mySubscriptions: '我的订阅',
        recommendedAccounts: '推荐账号',
        noSubscriptions: '尚无订阅的账号',
        confirmUnsubscribe: '确定要取消订阅此账号吗？',
        unsubscribeSuccess: '取消订阅成功',
        subscribeSuccess: '订阅成功',
        loadMore: '加载更多',
        viewOnSolana: '在 Solana Explorer 查看',
        storageMode: '存储模式',
        storageOnchain: '上链存储',
        storageOnchainDesc: '永久记录在 Solana 区块链 (字数限制)',
        storageLocal: '本地存储',
        storageLocalDesc: '存储在服务器数据库 (无字数限制)',
        joinCommunity: '加入社群',
        region: '地区',
        selectRegion: '-- 请选择地区 --'
    },
    'en': {
        title: 'World Events Dashboard',
        filters: '🔍 Filters',
        clear: 'Clear',
        timeRange: 'Time Range',
        walletAddress: 'Wallet Address',
        walletPlaceholder: 'Enter Solana address...',
        keywords: 'Keywords',
        keywordsPlaceholder: 'Enter keywords...',
        keywordsHint: 'Separate with commas',
        tagsPlaceholder: 'meeting, tech, blockchain...',
        applyFilters: 'Apply Filters',
        addEvent: '➕ Add Event',
        addEventTitle: '➕ Add Event',
        addEventHint: 'Right-click map to add event',
        addEventHintDisconnected: 'Connect wallet, then right-click map to add',
        connectWallet: 'Connect Phantom',
        disconnect: 'Disconnect',
        lat: 'Lat',
        lng: 'Lng',
        addEventHere: 'Add event here',
        eventName: 'Event Name *',
        eventNamePlaceholder: 'Enter event name',
        description: 'Description',
        eventDescPlaceholder: 'Enter detailed description...',
        date: 'Date *',
        startDateTime: 'Start Date & Time *',
        endDateTime: 'End Date & Time (Optional)',
        selectIcon: 'Select Icon',
        uploadImage: 'Upload Image',
        clickToUpload: 'Click or drag to upload',
        uploading: 'Uploading...',
        uploadSuccess: 'Image uploaded',
        uploadFailed: 'Upload failed',
        language: 'Language',
        eventLanguage: 'Event Language',
        allLanguages: 'All Languages',
        eventRegion: 'Region',
        allRegions: 'All Regions',
        regionTW: 'Taiwan',
        regionCN: 'China',
        regionGB: 'United Kingdom',
        regionUS: 'United States',
        regionJP: 'Japan',
        regionKR: 'South Korea',
        regionES: 'Spain',
        regionFR: 'France',
        regionDE: 'Germany',
        regionBR: 'Brazil',
        regionRU: 'Russia',
        cancel: 'Cancel',
        confirm: 'OK',
        create: 'Create',
        locationNotSelected: 'Right-click map to select location',
        today: 'Today',
        week: 'Week',
        month: 'Month',
        year: 'Year',
        all: 'All',
        hour1: '1h',
        hour3: '3h',
        hour6: '6h',
        hour12: '12h',
        from: 'From',
        to: 'To',
        remaining: 'Remaining',
        times: 'times',
        startLabel: 'Start: ',
        endLabel: 'End: ',
        endTimeLabel: 'End Time:',
        selectDateTime: 'Select Date & Time',
        selectStartTime: 'Select Start Time',
        selectEndTime: 'Select End Time',
        filterMode: 'Filter Mode',
        modeOverlap: 'Active during',
        modeStart: 'Starts within',
        modeEnd: 'Ends within',
        eventSource: 'Event Source',
        sourceOfficial: 'Official/Verified',
        sourceSubscribed: 'Subscribed',
        sourceMy: 'My Events',
        subscribe: 'Subscribe',
        unsubscribe: 'Unsubscribe',
        subscribed: 'Subscribed',
        subscribers: 'Subscribers',
        roleOfficial: 'Official',
        roleVerified: 'Verified',
        roleCommunity: 'Community',
        roleInstitution: 'Institution',
        roleUser: 'User',
        noDescription: 'No description',
        walletConnected: 'Wallet connected',
        walletDisconnected: 'Wallet disconnected',
        eventCreated: 'Event created!',
        loadError: 'Failed to load events',
        networkError: 'Network error',
        pleaseConnectWallet: 'Please connect wallet first',
        installPhantom: 'Please install Phantom wallet extension',
        walletConnectionError: 'Failed to connect wallet: ',
        selectImageFile: 'Please select an image file',
        createFailed: 'Creation failed',
        darkTheme: 'Switched to dark theme',
        lightTheme: 'Switched to light theme',
        langSwitched: 'Language switched to',
        profile: '👤 Profile',
        myEvents: '👤 My Events',
        myEventsTitle: '👤 Manage My Events',
        managementCenter: '⚙️ Management',
        profileTab: 'Profile',
        myEventsTab: 'My Events',
        subscriptionsTab: 'Subscriptions',
        profileTitle: '👤 Profile',
        displayName: 'Display Name',
        displayNamePlaceholder: 'Enter your name...',
        saveProfile: 'Save',
        profileSaved: 'Saved',
        remainingCredits: 'Remaining Credits',
        noNameSet: 'No name set',
        eventCount: 'Events',
        myEventsList: 'My Events',
        noEvents: 'No events created yet',
        deleteConfirm: 'Are you sure you want to delete this event?',
        deleteSuccess: 'Deleted successfully',
        delete: 'Delete',
        manageSubscriptions: '📋 Subscriptions',
        mySubscriptions: 'My Subscriptions',
        recommendedAccounts: 'Recommended',
        noSubscriptions: 'No subscriptions yet',
        confirmUnsubscribe: 'Are you sure you want to unsubscribe?',
        unsubscribeSuccess: 'Unsubscribed successfully',
        subscribeSuccess: 'Subscribed successfully',
        loadMore: 'Load More',
        viewOnSolana: 'View on Solana Explorer',
        storageMode: 'Storage Mode',
        storageOnchain: 'On-Chain',
        storageOnchainDesc: 'Permanently recorded on Solana blockchain (character limit)',
        storageLocal: 'Local',
        storageLocalDesc: 'Store in server database (no limit)',
        joinCommunity: 'Join Community',
        region: 'Region',
        selectRegion: '-- Select Region --'
    },
    'ja': {
        title: 'ワールドイベント Dashboard',
        filters: '🔍 フィルター',
        clear: 'クリア',
        timeRange: '期間',
        walletAddress: 'ウォレットアドレス',
        walletPlaceholder: 'Solana アドレスを入力...',
        keywords: 'キーワード',
        keywordsPlaceholder: 'キーワードを入力...',
        keywordsHint: 'カンマで区切る',
        tagsPlaceholder: '会議, テック, ブロックチェーン...',
        applyFilters: 'フィルター適用',
        addEvent: '➕ イベント追加',
        addEventTitle: '➕ イベント追加',
        addEventHint: '右クリックでイベント追加',
        addEventHintDisconnected: 'ウォレット接続後、右クリックで追加',
        connectWallet: 'Phantom 接続',
        disconnect: '切断',
        lat: '緯度',
        lng: '経度',
        addEventHere: 'ここにイベントを追加',
        eventName: 'イベント名 *',
        eventNamePlaceholder: 'イベント名を入力',
        description: '説明',
        eventDescPlaceholder: '詳細な説明を入力...',
        date: '日付 *',
        datetime: '日付と時刻 *',
        startDateTime: '開始日時 *',
        endDateTime: '終了日時 (任意)',
        selectIcon: 'アイコンを選択',
        uploadImage: '画像をアップロード',
        clickToUpload: 'クリックまたはドラッグでアップロード',
        uploading: 'アップロード中...',
        uploadSuccess: 'アップロード成功',
        uploadFailed: 'アップロード失敗',
        language: '言語',
        eventLanguage: 'イベント言語',
        allLanguages: 'すべての言語',
        eventRegion: '地域',
        allRegions: 'すべての地域',
        regionTW: '台湾',
        regionCN: '中国',
        regionGB: 'イギリス',
        regionUS: 'アメリカ',
        regionJP: '日本',
        regionKR: '韓国',
        regionES: 'スペイン',
        regionFR: 'フランス',
        regionDE: 'ドイツ',
        regionBR: 'ブラジル',
        regionRU: 'ロシア',
        cancel: 'キャンセル',
        confirm: 'OK',
        create: '作成',
        locationNotSelected: '右クリックで場所を選択',
        today: '今日',
        week: '今週',
        month: '今月',
        year: '今年',
        all: '全て',
        hour1: '1時間',
        hour3: '3時間',
        hour6: '6時間',
        hour12: '12時間',
        from: '開始',
        to: '終了',
        remaining: '残り',
        times: '回',
        selectDateTime: '日時を選択',
        selectStartTime: '開始日時を選択',
        selectEndTime: '終了日時を選択',
        filterMode: 'フィルターモード',
        modeOverlap: '進行中',
        modeStart: '開始',
        modeEnd: '終了',
        eventSource: 'イベントソース',
        sourceOfficial: '公式/認証',
        sourceSubscribed: 'フォロー中',
        sourceMy: 'マイイベント',
        subscribe: 'フォロー',
        unsubscribe: 'フォロー解除',
        subscribed: 'フォロー中',
        subscribers: 'フォロワー',
        roleOfficial: '公式',
        roleVerified: '認証',
        roleCommunity: 'コミュニティ',
        roleInstitution: '機関',
        roleUser: 'ユーザー',
        startLabel: '開始：',
        endLabel: '終了：',
        endTimeLabel: '終了時間:',
        noDescription: '説明なし',
        walletConnected: 'ウォレット接続済み',
        walletDisconnected: 'ウォレット切断済み',
        addressCopied: 'アドレスをコピーしました',
        eventCreated: 'イベント作成成功！',
        loadError: 'イベント読み込み失敗',
        networkError: 'ネットワークエラー',
        pleaseConnectWallet: 'ウォレットを接続してください',
        installPhantom: 'Phantom ウォレット拡張機能をインストールしてください',
        walletConnectionError: 'ウォレット接続失敗: ',
        selectImageFile: '画像ファイルを選択してください',
        createFailed: '作成失敗',
        darkTheme: 'ダークテーマに切替',
        lightTheme: 'ライトテーマに切替',
        langSwitched: '言語を切替:',
        profile: '👤 プロフィール',
        myEvents: '👤 マイイベント',
        myEventsTitle: '👤 マイイベント管理',
        managementCenter: '⚙️ 管理',
        profileTab: 'プロフィール',
        myEventsTab: 'マイイベント',
        subscriptionsTab: 'フォロー',
        profileTitle: '👤 プロフィール',
        displayName: '表示名',
        displayNamePlaceholder: '名前を入力...',
        saveProfile: '保存',
        profileSaved: '保存しました',
        remainingCredits: '残り作成回数',
        noNameSet: '名前未設定',
        eventCount: 'イベント数',
        myEventsList: 'マイイベント',
        noEvents: '作成したイベントはまだありません',
        deleteConfirm: 'このイベントを削除してもよろしいですか？',
        deleteSuccess: '削除しました',
        delete: '削除',
        manageSubscriptions: '📋 フォロー管理',
        mySubscriptions: 'フォロー中',
        recommendedAccounts: 'おすすめ',
        noSubscriptions: 'フォロー中のアカウントはありません',
        confirmUnsubscribe: 'このアカウントのフォローを解除しますか？',
        unsubscribeSuccess: 'フォロー解除しました',
        subscribeSuccess: 'フォローしました',
        loadMore: 'もっと読み込む',
        viewOnSolana: 'Solana Explorerで確認',
        storageMode: '保存モード',
        storageOnchain: 'オンチェーン',
        storageOnchainDesc: 'Solanaブロックチェーンに永久記録 (文字数制限)',
        storageLocal: 'ローカル',
        storageLocalDesc: 'サーバーデータベースに保存（制限なし）',
        joinCommunity: 'コミュニティに参加',
        region: '地域',
        selectRegion: '-- 地域を選択 --'
    },
    'ko': {
        title: '월드 이벤트 Dashboard',
        filters: '🔍 필터',
        clear: '지우기',
        timeRange: '기간',
        walletAddress: '지갑 주소',
        walletPlaceholder: 'Solana 주소 입력...',
        keywords: '키워드',
        keywordsPlaceholder: '키워드 입력...',
        keywordsHint: '쉼표로 구분',
        tagsPlaceholder: '회의, 기술, 블록체인...',
        applyFilters: '필터 적용',
        addEvent: '➕ 이벤트 추가',
        addEventTitle: '➕ 이벤트 추가',
        addEventHint: '우클릭으로 이벤트 추가',
        addEventHintDisconnected: '지갑 연결 후 우클릭으로 추가',
        connectWallet: 'Phantom 연결',
        disconnect: '연결 해제',
        lat: '위도',
        lng: '경도',
        addEventHere: '여기에 이벤트 추가',
        eventName: '이벤트 이름 *',
        eventNamePlaceholder: '이벤트 이름 입력',
        description: '설명',
        eventDescPlaceholder: '상세 설명 입력...',
        date: '날짜 *',
        datetime: '날짜 및 시간 *',
        startDateTime: '시작 날짜 및 시간 *',
        endDateTime: '종료 날짜 및 시간 (선택사항)',
        selectIcon: '아이콘 선택',
        uploadImage: '이미지 업로드',
        clickToUpload: '클릭 또는 드래그하여 업로드',
        uploading: '업로드 중...',
        uploadSuccess: '업로드 성공',
        uploadFailed: '업로드 실패',
        language: '언어',
        eventLanguage: '이벤트 언어',
        allLanguages: '모든 언어',
        eventRegion: '지역',
        allRegions: '모든 지역',
        regionTW: '대만',
        regionCN: '중국',
        regionGB: '영국',
        regionUS: '미국',
        regionJP: '일본',
        regionKR: '한국',
        regionES: '스페인',
        regionFR: '프랑스',
        regionDE: '독일',
        regionBR: '브라질',
        regionRU: '러시아',
        cancel: '취소',
        confirm: '확인',
        create: '생성',
        locationNotSelected: '우클릭으로 위치 선택',
        today: '오늘',
        week: '이번 주',
        month: '이번 달',
        year: '올해',
        all: '전체',
        hour1: '1시간',
        hour3: '3시간',
        hour6: '6시간',
        hour12: '12시간',
        from: '시작',
        to: '종료',
        remaining: '남음',
        times: '회',
        selectDateTime: '일시 선택',
        selectStartTime: '시작 시간 선택',
        selectEndTime: '종료 시간 선택',
        filterMode: '필터 모드',
        modeOverlap: '진행 중',
        modeStart: '시작',
        modeEnd: '종료',
        eventSource: '이벤트 소스',
        sourceOfficial: '공식/인증',
        sourceSubscribed: '구독 중',
        sourceMy: '내 이벤트',
        subscribe: '구독',
        unsubscribe: '구독 취소',
        subscribed: '구독 중',
        subscribers: '구독자',
        roleOfficial: '공식',
        roleVerified: '인증',
        roleCommunity: '커뮤니티',
        roleInstitution: '기관',
        roleUser: '사용자',
        startLabel: '시작:',
        endLabel: '종료:',
        endTimeLabel: '종료 시간:',
        noDescription: '설명 없음',
        walletConnected: '지갑 연결됨',
        walletDisconnected: '지갑 연결 해제됨',
        addressCopied: '주소가 복사되었습니다',
        eventCreated: '이벤트 생성 완료!',
        loadError: '이벤트 로드 실패',
        networkError: '네트워크 오류',
        pleaseConnectWallet: '지갑을 먼저 연결하세요',
        installPhantom: 'Phantom 지갑 확장 프로그램을 설치하세요',
        walletConnectionError: '지갑 연결 실패: ',
        selectImageFile: '이미지 파일을 선택하세요',
        createFailed: '생성 실패',
        darkTheme: '다크 테마로 전환',
        lightTheme: '라이트 테마로 전환',
        langSwitched: '언어 변경:',
        profile: '👤 프로필',
        myEvents: '👤 내 이벤트',
        myEventsTitle: '👤 내 이벤트 관리',
        managementCenter: '⚙️ 관리',
        profileTab: '프로필',
        myEventsTab: '내 이벤트',
        subscriptionsTab: '구독',
        profileTitle: '👤 프로필',
        displayName: '표시 이름',
        displayNamePlaceholder: '이름 입력...',
        saveProfile: '저장',
        profileSaved: '저장됨',
        remainingCredits: '남은 횟수',
        noNameSet: '이름 미설정',
        eventCount: '이벤트 수',
        myEventsList: '내 이벤트',
        noEvents: '생성된 이벤트가 없습니다',
        deleteConfirm: '이 이벤트를 삭제하시겠습니까?',
        deleteSuccess: '삭제되었습니다',
        delete: '삭제',
        manageSubscriptions: '📋 구독 관리',
        mySubscriptions: '내 구독',
        recommendedAccounts: '추천',
        noSubscriptions: '구독 중인 계정이 없습니다',
        confirmUnsubscribe: '이 계정의 구독을 취소하시겠습니까?',
        unsubscribeSuccess: '구독이 취소되었습니다',
        subscribeSuccess: '구독되었습니다',
        loadMore: '더 보기',
        viewOnSolana: 'Solana Explorer에서 보기',
        storageMode: '저장 모드',
        storageOnchain: '온체인',
        storageOnchainDesc: 'Solana 블록체인에 영구 기록 (글자 수 제한)',
        storageLocal: '로컬',
        storageLocalDesc: '서버 데이터베이스에 저장 (제한 없음)',
        joinCommunity: '커뮤니티 가입',
        region: '지역',
        selectRegion: '-- 지역 선택 --'
    },
    'es': {
        title: 'Panel de Eventos Mundiales',
        filters: '🔍 Filtros',
        clear: 'Limpiar',
        timeRange: 'Rango de Tiempo',
        walletAddress: 'Dirección de Billetera',
        walletPlaceholder: 'Ingresar dirección Solana...',
        keywords: 'Palabras clave',
        keywordsPlaceholder: 'Ingresar palabras clave...',
        keywordsHint: 'Separar con comas',
        tagsPlaceholder: 'reunión, tecnología, blockchain...',
        applyFilters: 'Aplicar Filtros',
        addEvent: '➕ Añadir Evento',
        addEventTitle: '➕ Añadir Evento',
        addEventHint: 'Clic derecho en el mapa para añadir',
        addEventHintDisconnected: 'Conectar billetera, luego clic derecho',
        connectWallet: 'Conectar Phantom',
        disconnect: 'Desconectar',
        lat: 'Lat',
        lng: 'Long',
        addEventHere: 'Añadir evento aquí',
        eventName: 'Nombre del Evento *',
        eventNamePlaceholder: 'Ingresar nombre',
        description: 'Descripción',
        eventDescPlaceholder: 'Ingresar descripción detallada...',
        date: 'Fecha *',
        datetime: 'Fecha y Hora *',
        startDateTime: 'Fecha y Hora de Inicio *',
        endDateTime: 'Fecha y Hora de Fin (Opcional)',
        selectIcon: 'Seleccionar Icono',
        uploadImage: 'Subir Imagen',
        clickToUpload: 'Clic o arrastrar para subir',
        uploading: 'Subiendo...',
        uploadSuccess: 'Imagen subida',
        uploadFailed: 'Error al subir',
        language: 'Idioma',
        eventLanguage: 'Idioma del Evento',
        allLanguages: 'Todos los Idiomas',
        eventRegion: 'Región',
        allRegions: 'Todas las Regiones',
        regionTW: 'Taiwán',
        regionCN: 'China',
        regionGB: 'Reino Unido',
        regionUS: 'Estados Unidos',
        regionJP: 'Japón',
        regionKR: 'Corea del Sur',
        regionES: 'España',
        regionFR: 'Francia',
        regionDE: 'Alemania',
        regionBR: 'Brasil',
        regionRU: 'Rusia',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        create: 'Crear',
        locationNotSelected: 'Clic derecho en el mapa para seleccionar ubicación',
        today: 'Hoy',
        week: 'Semana',
        month: 'Mes',
        year: 'Año',
        all: 'Todos',
        hour1: '1h',
        hour3: '3h',
        hour6: '6h',
        hour12: '12h',
        from: 'Desde',
        to: 'Hasta',
        remaining: 'Restante',
        times: 'veces',
        startLabel: 'Inicio: ',
        endLabel: 'Fin: ',
        endTimeLabel: 'Hora Fin:',
        selectDateTime: 'Seleccionar Fecha y Hora',
        selectStartTime: 'Seleccionar Hora Inicio',
        selectEndTime: 'Seleccionar Hora Fin',
        filterMode: 'Modo de Filtro',
        modeOverlap: 'En curso',
        modeStart: 'Empieza en',
        modeEnd: 'Termina en',
        eventSource: 'Fuente',
        sourceOfficial: 'Oficial/Verificado',
        sourceSubscribed: 'Suscrito',
        sourceMy: 'Mis Eventos',
        subscribe: 'Suscribirse',
        unsubscribe: 'Darse de baja',
        subscribed: 'Suscrito',
        subscribers: 'Suscriptores',
        roleOfficial: 'Oficial',
        roleVerified: 'Verificado',
        roleCommunity: 'Comunidad',
        roleInstitution: 'Institución',
        roleUser: 'Usuario',
        noDescription: 'Sin descripción',
        walletConnected: 'Billetera conectada',
        walletDisconnected: 'Billetera desconectada',
        eventCreated: '¡Evento creado!',
        loadError: 'Error al cargar eventos',
        networkError: 'Error de red',
        pleaseConnectWallet: 'Por favor conectar billetera',
        installPhantom: 'Por favor instalar Phantom wallet',
        walletConnectionError: 'Error al conectar billetera: ',
        selectImageFile: 'Por favor seleccionar archivo de imagen',
        createFailed: 'Fallo al crear',
        darkTheme: 'Tema oscuro activado',
        lightTheme: 'Tema claro activado',
        langSwitched: 'Idioma cambiado a',
        profile: '👤 Perfil',
        myEvents: '👤 Mis Eventos',
        myEventsTitle: '👤 Gestionar Mis Eventos',
        managementCenter: '⚙️ Gestión',
        profileTab: 'Perfil',
        myEventsTab: 'Mis Eventos',
        subscriptionsTab: 'Suscripciones',
        profileTitle: '👤 Perfil',
        displayName: 'Nombre',
        displayNamePlaceholder: 'Ingresa tu nombre...',
        saveProfile: 'Guardar',
        profileSaved: 'Guardado',
        remainingCredits: 'Créditos restantes',
        noNameSet: 'Sin nombre',
        eventCount: 'Eventos',
        myEventsList: 'Mis Eventos',
        noEvents: 'Aún no hay eventos',
        deleteConfirm: '¿Estás seguro de eliminar este evento?',
        deleteSuccess: 'Eliminado con éxito',
        delete: 'Eliminar',
        manageSubscriptions: '📋 Suscripciones',
        mySubscriptions: 'Mis Suscripciones',
        recommendedAccounts: 'Recomendado',
        noSubscriptions: 'No hay suscripciones',
        confirmUnsubscribe: '¿Darse de baja de esta cuenta?',
        unsubscribeSuccess: 'Dada de baja con éxito',
        subscribeSuccess: 'Suscrito con éxito',
        loadMore: 'Cargar más',
        viewOnSolana: 'Ver en Solana Explorer',
        storageMode: 'Modo de Almacenamiento',
        storageOnchain: 'On-chain',
        storageOnchainDesc: 'Registro permanente en Solana (límite de caracteres)',
        storageLocal: 'Local',
        storageLocalDesc: 'Almacenar en base de datos del servidor (sin límite)',
        joinCommunity: 'Únete a la Comunidad',
        region: 'Región',
        selectRegion: '-- Seleccione Región --'
    },
    'fr': {
        title: 'Tableau de bord mondial',
        filters: '🔍 Filtres',
        clear: 'Effacer',
        timeRange: 'Période',
        walletAddress: 'Adresse Portefeuille',
        walletPlaceholder: 'Entrez adresse Solana...',
        keywords: 'Mots-clés',
        keywordsPlaceholder: 'Entrez mots-clés...',
        keywordsHint: 'Séparer par virgules',
        tagsPlaceholder: 'réunion, tech, blockchain...',
        applyFilters: 'Appliquer',
        addEvent: '➕ Ajouter',
        addEventTitle: '➕ Ajouter Événement',
        addEventHint: 'Clic droit sur carte pour ajouter',
        addEventHintDisconnected: 'Connectez portefeuille, puis clic droit',
        connectWallet: 'Connecter Phantom',
        disconnect: 'Déconnecter',
        lat: 'Lat',
        lng: 'Long',
        addEventHere: 'Ajouter événement ici',
        eventName: 'Nom de l\'événement *',
        eventNamePlaceholder: 'Entrez le nom',
        description: 'Description',
        eventDescPlaceholder: 'Description détaillée...',
        date: 'Date *',
        datetime: 'Date et Heure *',
        startDateTime: 'Début *',
        endDateTime: 'Fin (Optionnel)',
        selectIcon: 'Choisir Icône',
        uploadImage: 'Télécharger Image',
        clickToUpload: 'Cliquer ou glisser pour uploader',
        uploading: 'Envoi...',
        uploadSuccess: 'Image envoyée',
        uploadFailed: 'Échec de l\'envoi',
        language: 'Langue',
        eventLanguage: 'Langue de l\'événement',
        allLanguages: 'Toutes les langues',
        eventRegion: 'Région',
        allRegions: 'Toutes les régions',
        regionTW: 'Taïwan',
        regionCN: 'Chine',
        regionGB: 'Royaume-Uni',
        regionUS: 'États-Unis',
        regionJP: 'Japón',
        regionKR: 'Corée du Sud',
        regionES: 'Espagne',
        regionFR: 'France',
        regionDE: 'Allemagne',
        regionBR: 'Brésil',
        regionRU: 'Russie',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        create: 'Créer',
        locationNotSelected: 'Clic droit pour choisir lieu',
        today: 'Aujourd\'hui',
        week: 'Semaine',
        month: 'Mois',
        year: 'Année',
        all: 'Tous',
        hour1: '1h',
        hour3: '3h',
        hour6: '6h',
        hour12: '12h',
        from: 'De',
        to: 'À',
        remaining: 'Restant',
        times: 'fois',
        startLabel: 'Début: ',
        endLabel: 'Fin: ',
        endTimeLabel: 'Heure Fin:',
        selectDateTime: 'Choisir Date/Heure',
        selectStartTime: 'Heure Début',
        selectEndTime: 'Heure Fin',
        filterMode: 'Mode Filtre',
        modeOverlap: 'En cours',
        modeStart: 'Commence dans',
        modeEnd: 'Finit dans',
        eventSource: 'Source',
        sourceOfficial: 'Officiel',
        sourceSubscribed: 'Abonné',
        sourceMy: 'Mes événements',
        subscribe: 'S\'abonner',
        unsubscribe: 'Se désabonner',
        subscribed: 'Abonné',
        subscribers: 'Abonnés',
        roleOfficial: 'Officiel',
        roleVerified: 'Vérifié',
        roleCommunity: 'Communauté',
        roleInstitution: 'Institution',
        roleUser: 'Utilisateur',
        noDescription: 'Pas de description',
        walletConnected: 'Connecté',
        walletDisconnected: 'Déconnecté',
        eventCreated: 'Événement créé!',
        loadError: 'Erreur chargement',
        networkError: 'Erreur réseau',
        pleaseConnectWallet: 'Connectez portefeuille SVP',
        installPhantom: 'Installez Phantom SVP',
        walletConnectionError: 'Erreur connexion: ',
        selectImageFile: 'Sélectionnez une image',
        createFailed: 'Échec création',
        darkTheme: 'Thème sombre',
        lightTheme: 'Thème clair',
        langSwitched: 'Langue changée',
        profile: '👤 Profil',
        myEvents: '👤 Mes Événements',
        myEventsTitle: '👤 Gérer Mes Événements',
        managementCenter: '⚙️ Gestion',
        profileTab: 'Profil',
        myEventsTab: 'Mes Événements',
        subscriptionsTab: 'Abonnements',
        profileTitle: '👤 Profil',
        displayName: 'Nom affiché',
        displayNamePlaceholder: 'Entrez votre nom...',
        saveProfile: 'Enregistrer',
        profileSaved: 'Enregistré',
        remainingCredits: 'Crédits restants',
        noNameSet: 'Aucun nom',
        eventCount: 'Événements',
        myEventsList: 'Mes Événements',
        noEvents: 'Aucun événement',
        deleteConfirm: 'Supprimer cet événement?',
        deleteSuccess: 'Supprimé avec succès',
        delete: 'Supprimer',
        manageSubscriptions: '📋 Abonnements',
        mySubscriptions: 'Mes Abonnements',
        recommendedAccounts: 'Recommandé',
        noSubscriptions: 'Aucun abonnement',
        confirmUnsubscribe: 'Se désabonner?',
        unsubscribeSuccess: 'Désabonné',
        subscribeSuccess: 'Abonné',
        loadMore: 'Voir plus',
        viewOnSolana: 'Voir sur Solana Explorer',
        storageMode: 'Mode de Stockage',
        storageOnchain: 'On-chain',
        storageOnchainDesc: 'Stockage permanent Solana',
        storageLocal: 'Local',
        storageLocalDesc: 'Stocker dans la base de données du serveur (sans limite)',
        joinCommunity: 'Rejoindre la Communauté',
        region: 'Région',
        selectRegion: '-- Sélectionnez la Région --'
    },
    'de': {
        title: 'Welt-Event-Dashboard',
        filters: '🔍 Filter',
        clear: 'Löschen',
        timeRange: 'Zeitraum',
        walletAddress: 'Wallet-Adresse',
        walletPlaceholder: 'Solana-Adresse eingeben...',
        keywords: 'Schlüsselwörter',
        keywordsPlaceholder: 'Suchbegriffe...',
        keywordsHint: 'Mit Kommas trennen',
        tagsPlaceholder: 'Meeting, Tech, Blockchain...',
        applyFilters: 'Filter anwenden',
        addEvent: '➕ Event hinzufügen',
        addEventTitle: '➕ Event erstellen',
        addEventHint: 'Rechtsklick auf Karte zum Hinzufügen',
        addEventHintDisconnected: 'Wallet verbinden, dann Rechtsklick',
        connectWallet: 'Phantom verbinden',
        disconnect: 'Trennen',
        lat: 'Breite',
        lng: 'Länge',
        addEventHere: 'Event hier hinzufügen',
        eventName: 'Eventname *',
        eventNamePlaceholder: 'Name eingeben',
        description: 'Beschreibung',
        eventDescPlaceholder: 'Details eingeben...',
        date: 'Datum *',
        datetime: 'Datum & Zeit *',
        startDateTime: 'Startzeit *',
        endDateTime: 'Endzeit (Optional)',
        selectIcon: 'Icon wählen',
        uploadImage: 'Bild hochladen',
        clickToUpload: 'Klicken oder ziehen zum Hochladen',
        uploading: 'Lädt hoch...',
        uploadSuccess: 'Bild hochgeladen',
        uploadFailed: 'Upload fehlgeschlagen',
        language: 'Sprache',
        eventLanguage: 'Eventsprache',
        allLanguages: 'Alle Sprachen',
        eventRegion: 'Region',
        allRegions: 'Alle Regionen',
        regionTW: 'Taiwan',
        regionCN: 'China',
        regionGB: 'Vereinigtes Königreich',
        regionUS: 'USA',
        regionJP: 'Japan',
        regionKR: 'Südkorea',
        regionES: 'Spanien',
        regionFR: 'Frankreich',
        regionDE: 'Deutschland',
        regionBR: 'Brasilien',
        regionRU: 'Russland',
        cancel: 'Abbrechen',
        confirm: 'OK',
        create: 'Erstellen',
        locationNotSelected: 'Ort auf Karte wählen',
        today: 'Heute',
        week: 'Woche',
        month: 'Monat',
        year: 'Jahr',
        all: 'Alle',
        hour1: '1h',
        hour3: '3h',
        hour6: '6h',
        hour12: '12h',
        from: 'Von',
        to: 'Bis',
        remaining: 'Verbleibend',
        times: 'mal',
        startLabel: 'Start: ',
        endLabel: 'Ende: ',
        endTimeLabel: 'Endzeit:',
        selectDateTime: 'Datum/Zeit wählen',
        selectStartTime: 'Startzeit wählen',
        selectEndTime: 'Endzeit wählen',
        filterMode: 'Filtermodus',
        modeOverlap: 'Aktiv während',
        modeStart: 'Startet in',
        modeEnd: 'Endet in',
        eventSource: 'Quelle',
        sourceOfficial: 'Offiziell',
        sourceSubscribed: 'Abonniert',
        sourceMy: 'Meine Events',
        subscribe: 'Abonnieren',
        unsubscribe: 'Deabonnieren',
        subscribed: 'Abonniert',
        subscribers: 'Abonnenten',
        roleOfficial: 'Offiziell',
        roleVerified: 'Verifiziert',
        roleCommunity: 'Community',
        roleInstitution: 'Institution',
        roleUser: 'Benutzer',
        noDescription: 'Keine Beschreibung',
        walletConnected: 'Wallet verbunden',
        walletDisconnected: 'Wallet getrennt',
        eventCreated: 'Event erstellt!',
        loadError: 'Ladefehler',
        networkError: 'Netzwerkfehler',
        pleaseConnectWallet: 'Bitte Wallet verbinden',
        installPhantom: 'Bitte Phantom installieren',
        walletConnectionError: 'Verbindungsfehler: ',
        selectImageFile: 'Bitte Bild wählen',
        createFailed: 'Erstellung fehlgeschlagen',
        darkTheme: 'Dunkles Design',
        lightTheme: 'Helles Design',
        langSwitched: 'Sprache geändert',
        profile: '👤 Profil',
        myEvents: '👤 Meine Events',
        myEventsTitle: '👤 Events verwalten',
        managementCenter: '⚙️ Verwaltung',
        profileTab: 'Profil',
        myEventsTab: 'Meine Events',
        subscriptionsTab: 'Abonnements',
        profileTitle: '👤 Profil',
        displayName: 'Anzeigename',
        displayNamePlaceholder: 'Gib deinen Namen ein...',
        saveProfile: 'Speichern',
        profileSaved: 'Gespeichert',
        remainingCredits: 'Verbleibende Credits',
        noNameSet: 'Kein Name',
        eventCount: 'Events',
        myEventsList: 'Meine Events',
        noEvents: 'Keine Events',
        deleteConfirm: 'Event wirklich löschen?',
        deleteSuccess: 'Gelöscht',
        delete: 'Löschen',
        manageSubscriptions: '📋 Abonnements',
        mySubscriptions: 'Meine Abos',
        recommendedAccounts: 'Empfohlen',
        noSubscriptions: 'Keine Abos',
        confirmUnsubscribe: 'Abo beenden?',
        unsubscribeSuccess: 'Abo beendet',
        subscribeSuccess: 'Abonniert',
        loadMore: 'Mehr laden',
        viewOnSolana: 'Auf Solana Explorer ansehen',
        storageMode: 'Speichermodus',
        storageOnchain: 'On-chain',
        storageOnchainDesc: 'Permanent auf Solana',
        storageLocal: 'Lokal',
        storageLocalDesc: 'In Serverdatenbank speichern (kein Limit)',
        joinCommunity: 'Der Community beitreten',
        region: 'Region',
        selectRegion: '-- Region auswählen --'
    },
    'pt': {
        title: 'Painel de Eventos Mundiais',
        filters: '🔍 Filtros',
        clear: 'Limpar',
        timeRange: 'Intervalo',
        walletAddress: 'Endereço Carteira',
        walletPlaceholder: 'Endereço Solana...',
        keywords: 'Palavras-chave',
        keywordsPlaceholder: 'Digite palavras-chave...',
        keywordsHint: 'Separar por vírgulas',
        tagsPlaceholder: 'meeting, tech, blockchain...',
        applyFilters: 'Aplicar',
        addEvent: '➕ Adicionar',
        addEventTitle: '➕ Novo Evento',
        addEventHint: 'Clique direito no mapa para adicionar',
        addEventHintDisconnected: 'Conecte carteira, depois clique direito',
        connectWallet: 'Conectar Phantom',
        disconnect: 'Desconectar',
        lat: 'Lat',
        lng: 'Long',
        addEventHere: 'Adicionar evento aqui',
        eventName: 'Nome do Evento *',
        eventNamePlaceholder: 'Digite o nome',
        description: 'Descrição',
        eventDescPlaceholder: 'Descrição detalhada...',
        date: 'Data *',
        datetime: 'Data e Hora *',
        startDateTime: 'Início *',
        endDateTime: 'Fim (Opcional)',
        selectIcon: 'Ícone',
        uploadImage: 'Upload Imagem',
        clickToUpload: 'Clique ou arraste para upload',
        uploading: 'Enviando...',
        uploadSuccess: 'Sucesso',
        uploadFailed: 'Falha no upload',
        language: 'Idioma',
        eventLanguage: 'Idioma do Evento',
        allLanguages: 'Todos os Idiomas',
        eventRegion: 'Região',
        allRegions: 'Todas as Regiões',
        regionTW: 'Taiwan',
        regionCN: 'China',
        regionGB: 'Reino Unido',
        regionUS: 'Estados Unidos',
        regionJP: 'Japão',
        regionKR: 'Coreia do Sul',
        regionES: 'Espanha',
        regionFR: 'França',
        regionDE: 'Alemanha',
        regionBR: 'Brasil',
        regionRU: 'Rússia',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        create: 'Criar',
        locationNotSelected: 'Selecione local no mapa',
        today: 'Hoje',
        week: 'Semana',
        month: 'Mês',
        year: 'Ano',
        all: 'Todos',
        hour1: '1h',
        hour3: '3h',
        hour6: '6h',
        hour12: '12h',
        from: 'De',
        to: 'Até',
        remaining: 'Restante',
        times: 'vezes',
        startLabel: 'Início: ',
        endLabel: 'Fim: ',
        endTimeLabel: 'Hora Fim:',
        selectDateTime: 'Selecionar Data/Hora',
        selectStartTime: 'Hora Início',
        selectEndTime: 'Hora Fim',
        filterMode: 'Modo Filtro',
        modeOverlap: 'Em andamento',
        modeStart: 'Começa em',
        modeEnd: 'Termina em',
        eventSource: 'Fonte',
        sourceOfficial: 'Oficial',
        sourceSubscribed: 'Inscrito',
        sourceMy: 'Meus Eventos',
        subscribe: 'Inscrever-se',
        unsubscribe: 'Cancelar inscrição',
        subscribed: 'Inscrito',
        subscribers: 'Inscritos',
        roleOfficial: 'Oficial',
        roleVerified: 'Verificado',
        roleCommunity: 'Comunidade',
        roleInstitution: 'Instituição',
        roleUser: 'Usuário',
        noDescription: 'Sem descrição',
        walletConnected: 'Conectado',
        walletDisconnected: 'Desconectado',
        eventCreated: 'Evento criado!',
        loadError: 'Erro ao carregar',
        networkError: 'Erro de rede',
        pleaseConnectWallet: 'Conecte a carteira',
        installPhantom: 'Instale Phantom',
        walletConnectionError: 'Erro conexão: ',
        selectImageFile: 'Selecione imagem',
        createFailed: 'Falha ao criar',
        darkTheme: 'Modo escuro',
        lightTheme: 'Modo claro',
        langSwitched: 'Idioma alterado',
        profile: '👤 Perfil',
        myEvents: '👤 Meus Eventos',
        myEventsTitle: '👤 Gerenciar Eventos',
        managementCenter: '⚙️ Gestão',
        profileTab: 'Perfil',
        myEventsTab: 'Meus Eventos',
        subscriptionsTab: 'Inscrições',
        profileTitle: '👤 Perfil',
        displayName: 'Nome',
        displayNamePlaceholder: 'Digite seu nome...',
        saveProfile: 'Salvar',
        profileSaved: 'Salvo',
        remainingCredits: 'Créditos restantes',
        noNameSet: 'Sem nome',
        eventCount: 'Eventos',
        myEventsList: 'Meus Eventos',
        noEvents: 'Nenhum evento',
        deleteConfirm: 'Excluir este evento?',
        deleteSuccess: 'Excluído',
        delete: 'Excluir',
        manageSubscriptions: '📋 Inscrições',
        mySubscriptions: 'Minhas Inscrições',
        recommendedAccounts: 'Recomendado',
        noSubscriptions: 'Nenhuma inscrição',
        confirmUnsubscribe: 'Cancelar inscrição?',
        unsubscribeSuccess: 'Cancelado',
        subscribeSuccess: 'Inscrito',
        loadMore: 'Carregar mais',
        viewOnSolana: 'Ver no Solana Explorer',
        storageMode: 'Modo de Armazenamento',
        storageOnchain: 'On-chain',
        storageOnchainDesc: 'Armazenamento permanente Solana',
        storageLocal: 'Local',
        storageLocalDesc: 'Almacenar en base de datos del servidor (sin límite)',
        joinCommunity: 'Únete a la Comunidad',
        region: 'Região',
        selectRegion: '-- Selecione Região --'
    },
    'ru': {
        title: 'Панель мировых событий',
        filters: '🔍 Фильтры',
        clear: 'Очистить',
        timeRange: 'Период',
        walletAddress: 'Адрес кошелька',
        walletPlaceholder: 'Введите адрес Solana...',
        keywords: 'Ключевые слова',
        keywordsPlaceholder: 'Введите слова...',
        keywordsHint: 'Через запятую',
        tagsPlaceholder: 'встреча, технологии, блокчейн...',
        applyFilters: 'Применить',
        addEvent: '➕ Добавить',
        addEventTitle: '➕ Новое событие',
        addEventHint: 'ПКМ на карте чтобы добавить',
        addEventHintDisconnected: 'Подключите кошелек, затем ПКМ',
        connectWallet: 'Подключить Phantom',
        disconnect: 'Отключить',
        lat: 'Широта',
        lng: 'Долгота',
        addEventHere: 'Добавить событие здесь',
        eventName: 'Название *',
        eventNamePlaceholder: 'Введите название',
        description: 'Описание',
        eventDescPlaceholder: 'Введите описание...',
        date: 'Дата *',
        datetime: 'Дата и время *',
        startDateTime: 'Начало *',
        endDateTime: 'Конец (опц.)',
        selectIcon: 'Выберите иконку',
        uploadImage: 'Загрузить фото',
        clickToUpload: 'Нажмите или перетащите',
        uploading: 'Загрузка...',
        uploadSuccess: 'Загружено',
        uploadFailed: 'Ошибка загрузки',
        language: 'Язык',
        eventLanguage: 'Язык события',
        allLanguages: 'Все языки',
        eventRegion: 'Регион',
        allRegions: 'Все регионы',
        regionTW: 'Тайвань',
        regionCN: 'Китай',
        regionGB: 'Великобритания',
        regionUS: 'США',
        regionJP: 'Япония',
        regionKR: 'Южная Корея',
        regionES: 'Испания',
        regionFR: 'Франция',
        regionDE: 'Германия',
        regionBR: 'Бразилия',
        regionRU: 'Россия',
        cancel: 'Отмена',
        confirm: 'ОК',
        create: 'Создать',
        locationNotSelected: 'Выберите место на карте',
        today: 'Сегодня',
        week: 'Неделя',
        month: 'Месяц',
        year: 'Год',
        all: 'Все',
        hour1: '1ч',
        hour3: '3ч',
        hour6: '6ч',
        hour12: '12ч',
        from: 'От',
        to: 'До',
        remaining: 'Ост.',
        times: 'раз',
        startLabel: 'Начало: ',
        endLabel: 'Конец: ',
        endTimeLabel: 'Конец:',
        selectDateTime: 'Выбрать время',
        selectStartTime: 'Время начала',
        selectEndTime: 'Время конца',
        filterMode: 'Режим',
        modeOverlap: 'Идет сейчас',
        modeStart: 'Начнется через',
        modeEnd: 'Закончится через',
        eventSource: 'Источник',
        sourceOfficial: 'Офиц./Пров.',
        sourceSubscribed: 'Подписки',
        sourceMy: 'Мои события',
        subscribe: 'Подписаться',
        unsubscribe: 'Отписаться',
        subscribed: 'Подписан',
        subscribers: 'Подписчики',
        roleOfficial: 'Официальный',
        roleVerified: 'Проверенный',
        roleCommunity: 'Сообщество',
        roleInstitution: 'Институт',
        roleUser: 'Пользователь',
        noDescription: 'Нет описания',
        walletConnected: 'Кошелек подключен',
        walletDisconnected: 'Отключено',
        eventCreated: 'Событие создано!',
        loadError: 'Ошибка загрузки',
        networkError: 'Ошибка сети',
        pleaseConnectWallet: 'Подключите кошелек',
        installPhantom: 'Установите Phantom',
        walletConnectionError: 'Ошибка подключения: ',
        selectImageFile: 'Выберите файл',
        createFailed: 'Ошибка создания',
        darkTheme: 'Темная тема',
        lightTheme: 'Светлая тема',
        langSwitched: 'Язык изменен',
        profile: '👤 Профиль',
        myEvents: '👤 Мои события',
        myEventsTitle: '👤 Управление событиями',
        managementCenter: '⚙️ Управление',
        profileTab: 'Профиль',
        myEventsTab: 'Мои события',
        subscriptionsTab: 'Подписки',
        profileTitle: '👤 Профиль',
        displayName: 'Имя',
        displayNamePlaceholder: 'Введите ваше имя...',
        saveProfile: 'Сохранить',
        profileSaved: 'Сохранено',
        remainingCredits: 'Осталось',
        noNameSet: 'Имя не установлено',
        eventCount: 'События',
        myEventsList: 'Мои события',
        noEvents: 'Нет событий',
        deleteConfirm: 'Удалить событие?',
        deleteSuccess: 'Удалено',
        delete: 'Удалить',
        manageSubscriptions: '📋 Подписки',
        mySubscriptions: 'Мои подписки',
        recommendedAccounts: 'Рекомендации',
        noSubscriptions: 'Нет подписок',
        confirmUnsubscribe: 'Отписаться?',
        unsubscribeSuccess: 'Отписан',
        subscribeSuccess: 'Подписан',
        loadMore: 'Еще',
        viewOnSolana: 'В Solana Explorer',
        storageMode: 'Хранение',
        storageOnchain: 'On-chain',
        storageOnchainDesc: 'На блокчейне Solana',
        storageLocal: 'Локально',
        storageLocalDesc: 'Хранить в базе данных сервера (без ограничения)',
        joinCommunity: 'Присоединиться к сообществу',
        region: 'Регион',
        selectRegion: '-- Выберите регион --'
    }
};

/**
 * 語言配置列表 (UI 語言，不含「全部」選項)
 */
const LANGUAGES = [
    { code: 'zh-tw', flag: 'tw', name: '繁體中文', countryCode: 'tw' },
    { code: 'zh-cn', flag: 'cn', name: '简体中文', countryCode: 'cn' },
    { code: 'en', flag: 'gb', name: 'English', countryCode: 'gb' },
    { code: 'en-us', flag: 'us', name: 'English (US)', countryCode: 'us' },
    { code: 'ja', flag: 'jp', name: '日本語', countryCode: 'jp' },
    { code: 'ko', flag: 'kr', name: '한국어', countryCode: 'kr' },
    { code: 'es', flag: 'es', name: 'Español', countryCode: 'es' },
    { code: 'fr', flag: 'fr', name: 'Français', countryCode: 'fr' },
    { code: 'de', flag: 'de', name: 'Deutsch', countryCode: 'de' },
    { code: 'pt', flag: 'br', name: 'Português', countryCode: 'br' },
    { code: 'ru', flag: 'ru', name: 'Русский', countryCode: 'ru' }
];

/**
 * 地區配置列表 (包含「全部」選項，用於過濾)
 * name 為 i18n key 或原生名稱
 */
const REGIONS = [
    { code: '', flag: 'un', nameKey: 'allRegions', countryCode: 'un' },
    { code: 'zh-tw', flag: 'tw', nameKey: 'regionTW', countryCode: 'tw' },
    { code: 'zh-cn', flag: 'cn', nameKey: 'regionCN', countryCode: 'cn' },
    { code: 'en', flag: 'gb', nameKey: 'regionGB', countryCode: 'gb' },
    { code: 'en-us', flag: 'us', nameKey: 'regionUS', countryCode: 'us' },
    { code: 'ja', flag: 'jp', nameKey: 'regionJP', countryCode: 'jp' },
    { code: 'ko', flag: 'kr', nameKey: 'regionKR', countryCode: 'kr' },
    { code: 'es', flag: 'es', nameKey: 'regionES', countryCode: 'es' },
    { code: 'fr', flag: 'fr', nameKey: 'regionFR', countryCode: 'fr' },
    { code: 'de', flag: 'de', nameKey: 'regionDE', countryCode: 'de' },
    { code: 'pt', flag: 'br', nameKey: 'regionBR', countryCode: 'br' },
    { code: 'ru', flag: 'ru', nameKey: 'regionRU', countryCode: 'ru' }
];

/**
 * 可選圖標列表
 */
const MARKER_ICONS = [
    '📍', '🎉', '🎵', '🏆', '🎪', '🎭', '📌', '⭐', '🔥', '💡',
    '🎯', '🏁', '🎈', '🎊', '🎤', '🏟️', '🎨', '📸', '🎬', '🎮',
    '🚀', '✈️', '🚗', '🚢', '🏠', '🏢', '🏫', '🏥', '⛪', '🕌',
    '🗼', '🗽', '🌋', '🏔️', '🌊', '🌲', '🌸', '🌺', '🍀', '🎄',
    '⚽', '🏀', '🎾', '🏈', '⚾', '🎳', '🏊', '🚴', '🧗', '🎿',
    '🍕', '🍔', '🍣', '🍰', '🍿', '☕', '🍺', '🍷', '🥳', '💻'
];

/**
 * 地圖圖層配置
 */
const MAP_TILES = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
};

// ===== 國際化邏輯 =====

/**
 * 取得翻譯文字
 * @param {string} key - 翻譯鍵
 * @returns {string} 翻譯後的文字或 key
 */
function t(key) {
    // 確保 I18N 已加載
    if (typeof I18N === 'undefined') return key;

    // 使用當前語言，若無則回退到英文或繁體中文
    const langCode = (typeof currentUILang !== 'undefined') ? currentUILang : 'zh-tw';
    const translations = I18N[langCode] || I18N['en'] || I18N['zh-tw'] || {};

    return translations[key] || key;
}

/**
 * 更新 UI 語言
 * @param {string} langCode - 語言代碼 (如 'zh-tw', 'en')
 */
function updateUILanguage(langCode) {
    if (typeof I18N === 'undefined') return;

    // 確定使用的 UI 語言
    let uiLang = langCode;

    // 如果未指定，使用上次記錄的語言或瀏覽器語言
    if (!langCode) {
        uiLang = (typeof lastUILang !== 'undefined' ? lastUILang : null) || detectBrowserUILang();
    } else {
        // 記錄選擇的語言
        if (typeof lastUILang !== 'undefined') lastUILang = langCode;
        if (typeof localStorage !== 'undefined') localStorage.setItem('uiLang', langCode);
    }

    // 查找對應的翻譯（fallback 邏輯）
    if (!I18N[uiLang]) {
        // 嘗試匹配語言前綴
        const prefix = uiLang.split('-')[0];
        const match = Object.keys(I18N).find(k => k.startsWith(prefix));
        uiLang = match || 'zh-tw';
    }

    // 更新全局狀態
    currentUILang = uiLang;
    if (typeof elements !== 'undefined' && elements.currentLangCode) {
        // UI 更新稍後在 initLanguageSelector 或其他 UI 函數中處理
    }

    // 更新頁面標題
    document.title = t('title');

    // 自動翻譯所有 data-i18n 元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (key && t(key) !== key) {
            el.textContent = t(key);
        }
    });

    // 自動翻譯所有 data-i18n-placeholder 元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (key && t(key) !== key) {
            el.placeholder = t(key);
        }
    });

    // 自動翻譯所有 data-i18n-title 元素
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (key && t(key) !== key) {
            el.title = t(key);
        }
    });

    // 更新特定 UI 元素
    updateSpecificUI();
}

/**
 * 更新特定 UI 元素 (連接按鈕, 剩餘次數等)
 */
function updateSpecificUI() {
    if (typeof elements === 'undefined') return;

    // 更新連接按鈕文字
    if (elements.connectWallet && !walletAddress) {
        elements.connectWallet.innerHTML = `<span class="wallet-icon">👻</span><span data-i18n="connectWallet">${t('connectWallet')}</span>`;
    }

    // 更新剩餘可用次數顯示
    if (walletAddress && elements.eventLimit && typeof userQuota !== 'undefined') {
        const remaining = userQuota - (typeof userEventCount !== 'undefined' ? userEventCount : 0);
        elements.eventLimit.textContent = `${t('remaining')} ${remaining} ${t('times')}`;
    }

    // 更新事件提示
    const eventHint = document.querySelector('.add-event-hint');
    if (eventHint) {
        eventHint.textContent = walletAddress ? t('addEventHint') : t('addEventHintDisconnected');
    }

    // 更新緊湊型 UI 語言切換器的國旗（同步 currentUILang）
    if (elements.currentFlagCompact && typeof currentUILang !== 'undefined' && typeof LANGUAGES !== 'undefined') {
        const currentLang = LANGUAGES.find(l => l.code === currentUILang);
        if (currentLang) {
            elements.currentFlagCompact.src = getFlagUrl(currentLang.countryCode);
            elements.currentFlagCompact.alt = currentLang.name;
        }
    }

    // 更新創建事件表單的地區選項文字
    updateEventRegionOptions();

    // 更新側邊欄地區過濾器的選項文字
    updateRegionFilterOptions();
}

/**
 * 更新創建事件表單的地區選項文字（多語言化）
 */
function updateEventRegionOptions() {
    if (!elements.eventLanguage || typeof REGIONS === 'undefined') return;

    const currentValue = elements.eventLanguage.value;
    const options = elements.eventLanguage.querySelectorAll('option');

    options.forEach(option => {
        if (option.value === '') {
            // 更新佔位符文字
            option.textContent = t('selectRegion') || '-- 請選擇地區 --';
        } else {
            // 更新地區名稱
            const region = REGIONS.find(r => r.code === option.value);
            if (region) {
                option.textContent = t(region.nameKey) || region.nameKey;
            }
        }
    });

    // 保持原選中值
    elements.eventLanguage.value = currentValue;
}

/**
 * 更新側邊欄地區過濾器的選項文字（多語言化）
 */
function updateRegionFilterOptions() {
    if (!elements.regionDropdown || typeof REGIONS === 'undefined') return;

    const regionOptions = elements.regionDropdown.querySelectorAll('.region-option');
    regionOptions.forEach(option => {
        const regionCode = option.dataset.region;
        const region = REGIONS.find(r => r.code === regionCode);
        if (region) {
            const nameSpan = option.querySelector('.region-name');
            if (nameSpan) {
                nameSpan.textContent = t(region.nameKey) || region.nameKey;
            }
        }
    });

    // 更新當前選中的地區顯示
    if (elements.currentRegionName && typeof selectedRegion !== 'undefined') {
        const currentRegion = REGIONS.find(r => r.code === selectedRegion);
        if (currentRegion) {
            elements.currentRegionName.textContent = t(currentRegion.nameKey) || currentRegion.nameKey;
        } else {
            // 全部地區
            elements.currentRegionName.textContent = t('allRegions') || '全部地區';
        }
    }
}

/**
 * 偵測瀏覽器語言
 * @returns {string} 匹配的語言代碼
 */
function detectBrowserUILang() {
    if (typeof navigator === 'undefined') return 'zh-tw';

    const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
    if (I18N[browserLang]) return browserLang;

    const prefix = browserLang.split('-')[0];
    const match = Object.keys(I18N).find(k => k.startsWith(prefix));
    return match || 'zh-tw';
}

/**
 * 初始化語言選擇器
 */
function initLanguageSelector() {
    // 先填充表單地區選項（改用 REGIONS）
    if (typeof elements !== 'undefined' && elements.eventLanguage && typeof REGIONS !== 'undefined') {
        elements.eventLanguage.innerHTML = '';

        // 添加空白提示選項
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = t('selectRegion') || '-- 請選擇地區 --';
        placeholderOption.disabled = true;
        elements.eventLanguage.appendChild(placeholderOption);

        // 排除「全部地區」選項 (code 為空字串的)
        REGIONS.filter(r => r.code).forEach(region => {
            const option = document.createElement('option');
            option.value = region.code;
            option.textContent = t(region.nameKey) || region.nameKey; // 使用翻譯後的地區名稱
            elements.eventLanguage.appendChild(option);
        });

        // 根據瀏覽器語言設定預設地區（僅當該地區在列表中時）
        const browserLang = detectBrowserUILang();
        if (elements.eventLanguage.querySelector(`option[value="${browserLang}"]`)) {
            elements.eventLanguage.value = browserLang;
        } else {
            // 瀏覽器地區不在支持列表中，保持空白提示
            elements.eventLanguage.value = '';
        }
    }

    // 再處理側邊欄語言切換器
    if (typeof elements === 'undefined' || !elements.languageDropdown) return;

    elements.languageDropdown.innerHTML = '';

    if (typeof LANGUAGES === 'undefined') return;

    LANGUAGES.forEach(lang => {
        const option = document.createElement('div');
        option.className = 'language-option' + (lang.code === currentUILang ? ' active' : '');
        option.dataset.lang = lang.code;
        option.innerHTML = `
            <img class="flag-icon" src="${getFlagUrl(lang.countryCode)}" alt="${lang.name}" />
            <span class="lang-name">${lang.name}</span>
            <span class="lang-code">${lang.code ? lang.code.toUpperCase() : 'ALL'}</span>
        `;
        option.addEventListener('click', () => selectLanguage(lang));
        elements.languageDropdown.appendChild(option);
    });

    // 初始國旗
    if (elements.currentFlagImg) {
        elements.currentFlagImg.src = getFlagUrl('un');
    }

    // 下拉選單開關
    if (elements.languageBtn) {
        elements.languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.languageDropdown.classList.toggle('hidden');
            elements.languageBtn.classList.toggle('open');
        });
    }

    document.addEventListener('click', () => {
        elements.languageDropdown.classList.add('hidden');
        elements.languageBtn.classList.remove('open');
    });
}

/**
 * 取得國旗圖片 URL
 */
function getFlagUrl(countryCode) {
    const cdnBase = (typeof CONFIG !== 'undefined') ? CONFIG.FLAG_CDN : 'https://flagcdn.com/w40';

    if (countryCode === 'un') {
        return 'https://flagcdn.com/w40/un.png';
    }
    return `${cdnBase}/${countryCode}.png`;
}

/**
 * 選擇語言
 */
function selectLanguage(lang) {
    if (typeof elements === 'undefined') return;

    selectedLanguage = lang.code;

    if (elements.currentFlagImg) elements.currentFlagImg.src = getFlagUrl(lang.countryCode);
    if (elements.currentLangCode) elements.currentLangCode.textContent = lang.code ? lang.code.toUpperCase() : 'ALL';

    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang.code);
    });

    if (elements.languageDropdown) elements.languageDropdown.classList.add('hidden');
    if (elements.languageBtn) elements.languageBtn.classList.remove('open');

    // 更新網頁 UI 語言
    updateUILanguage(lang.code);

    // 重新載入事件（如果 loadEvents 存在）
    if (typeof loadEvents === 'function') {
        loadEvents();
    }

    if (typeof showToast === 'function') {
        showToast(`${t('langSwitched')} ${lang.name}`, 'success');
    }
}

