/**
 * 表單處理邏輯
 * 包含新增事件、圖片上傳、圖標選擇等
 */

const Forms = {
    elements: {},
    pendingImageFile: null, // 延遲上傳：存儲待上傳的圖片檔案

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initStorageModeToggle();
        this.initNetworkSelector();
        this.initIconPicker();
        this.initImageUpload();
    },

    cacheElements() {
        this.elements = {
            addEventModal: document.getElementById('addEventModal'),
            showAddEvent: document.getElementById('showAddEvent'),
            closeModal: document.getElementById('closeModal'),
            cancelAdd: document.getElementById('cancelAdd'),
            addEventForm: document.getElementById('addEventForm'),

            // 表單欄位
            eventName: document.getElementById('eventName'),
            eventDescription: document.getElementById('eventDescription'),
            eventStartDate: document.getElementById('eventStartDate'),
            eventEndDate: document.getElementById('eventEndDate'),
            eventLat: document.getElementById('eventLat'),
            eventLng: document.getElementById('eventLng'),
            eventTags: document.getElementById('eventTags'),
            eventLanguage: document.getElementById('eventLanguage'),
            eventIcon: document.getElementById('eventIcon'),
            eventImage: document.getElementById('eventImage'),
            eventImagePath: document.getElementById('eventImagePath'),
            eventIpfsHash: document.getElementById('eventIpfsHash'),

            // Location info
            locationText: document.getElementById('locationText'),
            locationInfo: document.getElementById('locationInfo'),

            // Image upload
            imageUploadArea: document.getElementById('imageUploadArea'),
            uploadPlaceholder: document.getElementById('uploadPlaceholder'),
            imagePreview: document.getElementById('imagePreview'),
            previewImg: document.getElementById('previewImg'),
            removeImage: document.getElementById('removeImage'),

            // Icon picker
            iconPicker: document.getElementById('iconPicker'),

            // Network selector
            networkSelectorGroup: document.getElementById('networkSelectorGroup'),
            networkSelector: document.getElementById('networkSelector'),

            // Limits
            eventLimit: document.getElementById('eventLimit'),
            imageQuotaInfo: document.getElementById('imageQuotaInfo')
        };
    },

    bindEvents() {
        const els = this.elements;
        if (els.showAddEvent) els.showAddEvent.addEventListener('click', () => this.openAddModal(null));
        if (els.closeModal) els.closeModal.addEventListener('click', () => this.closeAddModal());
        if (els.cancelAdd) els.cancelAdd.addEventListener('click', () => this.closeAddModal());
        if (els.addEventForm) els.addEventForm.addEventListener('submit', (e) => this.handleAddEvent(e));

        // 日期選擇按鈕
        const startDateBtn = document.getElementById('openStartDatePicker');
        const endDateBtn = document.getElementById('openEndDatePicker');
        if (startDateBtn && els.eventStartDate) {
            startDateBtn.addEventListener('click', () => els.eventStartDate.showPicker());
        }
        if (endDateBtn && els.eventEndDate) {
            endDateBtn.addEventListener('click', () => els.eventEndDate.showPicker());
        }
    },

    initStorageModeToggle() {
        const storageModeInputs = document.querySelectorAll('input[name="storageMode"]');
        const form = this.elements.addEventForm;
        const nameInput = this.elements.eventName;
        const descInput = this.elements.eventDescription;
        const networkGroup = this.elements.networkSelectorGroup;

        const updateCharLimits = (mode) => {
            if (mode === 'onchain') {
                if (nameInput) nameInput.maxLength = 50;
                if (descInput) descInput.maxLength = 100;
                if (form) form.classList.add('storage-onchain');
                if (networkGroup) networkGroup.classList.remove('hidden');
            } else {
                if (nameInput) nameInput.removeAttribute('maxLength');
                if (descInput) descInput.removeAttribute('maxLength');
                if (form) form.classList.remove('storage-onchain');
                if (networkGroup) networkGroup.classList.add('hidden');
            }
        };

        storageModeInputs.forEach(input => {
            input.addEventListener('change', (e) => updateCharLimits(e.target.value));
        });

        // 初始設置
        const checkedMode = document.querySelector('input[name="storageMode"]:checked');
        if (checkedMode) {
            updateCharLimits(checkedMode.value);
        }
    },

    initNetworkSelector() {
        const networkSelector = this.elements.networkSelector;
        if (!networkSelector) return;

        // 監聽網路選擇變化
        networkSelector.addEventListener('change', (e) => {
            if (typeof setSolanaNetwork === 'function') {
                setSolanaNetwork(e.target.value);
            }
        });
    },

    async openAddModal(latlng) {
        if (!walletAddress) {
            showToast(t('pleaseConnectWallet'), 'error');
            return;
        }

        const els = this.elements;
        els.addEventModal.classList.remove('hidden');

        // 設置預設開始日期為現在
        const now = new Date();
        if (typeof formatDateTimeForInput === 'function') {
            els.eventStartDate.value = formatDateTimeForInput(now);
            // 同步結束時間（默認為開始時間+1小時，可選）
            // els.eventEndDate.value = formatDateTimeForInput(new Date(now.getTime() + 60*60*1000));
        }

        // 顯示剩餘配額
        if (els.imageQuotaInfo && typeof userQuota !== 'undefined') {
            const remaining = userQuota - (typeof userEventCount !== 'undefined' ? userEventCount : 0);
            els.imageQuotaInfo.textContent = `(${t('remaining')} ${remaining} ${t('times')})`;
            els.imageQuotaInfo.className = 'quota-info' + (remaining <= 3 ? ' low' : '') + (remaining <= 0 ? ' empty' : '');
        }

        if (latlng) {
            els.eventLat.value = latlng.lat.toFixed(6);
            els.eventLng.value = latlng.lng.toFixed(6);
            els.locationText.textContent = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
            els.locationInfo.style.borderColor = 'rgba(16, 185, 129, 0.5)';

            // 自動偵測地區 (BigDataCloud Free API)
            try {
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latlng.lat}&longitude=${latlng.lng}&localityLanguage=en`);
                const data = await response.json();
                if (data && data.countryCode) {
                    const countryCode = data.countryCode.toLowerCase();
                    // 映射到我們支援的地區代碼
                    const supportedRegions = ['tw', 'cn', 'gb', 'us', 'jp', 'kr', 'es', 'fr', 'de', 'br', 'ru'];
                    if (supportedRegions.includes(countryCode)) {
                        els.eventLanguage.value = countryCode;
                        console.log(`[Auto-Detect] Region set to: ${countryCode}`);
                    } else {
                        els.eventLanguage.value = 'en'; // 默認英語區
                        console.log(`[Auto-Detect] Region not supported (${countryCode}), defaulting to 'en'`);
                    }
                }
            } catch (err) {
                console.warn('[Auto-Detect] Failed to fetch region:', err);
                els.eventLanguage.value = 'en';
            }

        } else {
            els.eventLat.value = '';
            els.eventLng.value = '';
            els.locationText.textContent = t('locationNotSelected');
            els.locationInfo.style.borderColor = 'rgba(245, 158, 11, 0.5)';
            els.eventLanguage.value = 'en'; // 默認
        }
    },

    closeAddModal() {
        this.elements.addEventModal.classList.add('hidden');
        this.resetFormFields();
    },

    resetFormFields() {
        this.elements.addEventForm.reset();
        this.elements.eventIcon.value = '📍';
        this.clearImageUpload();
        document.querySelectorAll('.icon-option').forEach((opt, i) => {
            opt.classList.toggle('selected', i === 0);
        });
    },

    async handleAddEvent(e) {
        e.preventDefault();
        const els = this.elements;

        if (!walletAddress) {
            showToast(t('pleaseConnectWallet'), 'error');
            return;
        }

        if (!els.eventLat.value || !els.eventLng.value) {
            showToast(t('locationNotSelected'), 'error');
            return;
        }

        // 驗證地區已自動偵測或默認
        if (!els.eventLanguage.value) {
            els.eventLanguage.value = 'en';
        }

        const storageModeInput = document.querySelector('input[name="storageMode"]:checked');
        const storageMode = storageModeInput ? storageModeInput.value : 'local';

        const eventData = {
            title: els.eventName.value,
            name: els.eventName.value,
            description: els.eventDescription.value,
            lat: parseFloat(els.eventLat.value),
            lng: parseFloat(els.eventLng.value),
            date: els.eventStartDate.value,
            start_date: els.eventStartDate.value,
            end_date: els.eventEndDate.value || '',
            user: walletAddress,
            tags: els.eventTags.value ? els.eventTags.value.split(',').map(t => t.trim()) : [],
            event_type: els.eventTags.value,
            language: els.eventLanguage.value,  // 注意：欄位名為 language，但存的是地區代碼
            image_path: els.eventImagePath.value,
            icon: els.eventIcon.value || '📍'
        };

        if (els.eventIpfsHash && els.eventIpfsHash.value) {
            eventData.ipfs_hash = els.eventIpfsHash.value;
        }

        try {
            let serverData = { ...eventData };

            if (storageMode === 'onchain') {
                // On-chain 模式：先執行 Solana 交易，成功後才上傳圖片

                // 先設置正確的網路（重要：必須在交易前設置）
                const selectedNetwork = this.elements.networkSelector ? this.elements.networkSelector.value : 'devnet';
                if (typeof setSolanaNetwork === 'function') {
                    setSolanaNetwork(selectedNetwork);
                }

                showToast(t('sendingToSolana'), 'info');

                // 添加頁面離開警告
                const beforeUnloadHandler = (e) => {
                    e.preventDefault();
                    e.returnValue = '交易正在進行中，離開可能導致失敗！';
                    return e.returnValue;
                };
                window.addEventListener('beforeunload', beforeUnloadHandler);

                if (typeof publishEventToSolana !== 'function') {
                    window.removeEventListener('beforeunload', beforeUnloadHandler);
                    showToast(t('solanaModuleError'), 'error');
                    return;
                }

                const solanaResult = await publishEventToSolana(eventData);

                // 移除頁面離開警告
                window.removeEventListener('beforeunload', beforeUnloadHandler);

                if (!solanaResult.success) {
                    showToast(t('txFailed') + solanaResult.error, 'error');
                    return; // On-chain 失敗，不上傳圖片
                }

                showToast(t('txnConfirmed'), 'success');

                // Solana 成功後，上傳圖片（如果有）
                if (this.pendingImageFile) {
                    showToast(t('uploadingImage'), 'info');
                    const imagePath = await this.uploadPendingImage();
                    if (imagePath) {
                        serverData.image_path = imagePath;
                    }
                }

                serverData.tx_signature = solanaResult.signature;
                serverData.tx_network = selectedNetwork;
                serverData.storage_mode = 'onchain';
            } else {
                // Local 模式：提交時上傳圖片
                if (this.pendingImageFile) {
                    showToast(t('uploadingImage'), 'info');
                    const imagePath = await this.uploadPendingImage();
                    if (imagePath) {
                        serverData.image_path = imagePath;
                    }
                }
                serverData.storage_mode = 'local';
            }

            // 使用 api.js 的 authenticatedFetch
            const response = await authenticatedFetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serverData)
            });

            const result = await response.json();

            if (response.ok) {
                // Update global quota
                if (typeof userEventCount !== 'undefined') userEventCount = result.event_count || (userEventCount + 1);
                const remaining = (typeof userQuota !== 'undefined' ? userQuota : 100) - userEventCount;

                if (storageMode === 'onchain') {
                    showToast(t('eventCreated') + ' ⛓️ TX: ' + serverData.tx_signature.substring(0, 8) + '...', 'success');
                } else {
                    showToast(t('eventCreated') + ' 💾 ' + t('savedToLocal'), 'success');
                }

                if (els.eventLimit) {
                    els.eventLimit.textContent = `${t('remaining')} ${remaining} ${t('times')}`;
                }

                if (remaining <= 0 && els.showAddEvent) {
                    els.showAddEvent.disabled = true;
                }

                this.closeAddModal();
                if (typeof loadEvents === 'function') loadEvents();
            } else {
                showToast(result.error || t('createFailed'), 'error');
            }
        } catch (err) {
            showToast(t('networkError'), 'error');
            console.error(err);
        }
    },

    initIconPicker() {
        const els = this.elements;
        if (!els.iconPicker || typeof MARKER_ICONS === 'undefined') return;

        els.iconPicker.innerHTML = '';
        MARKER_ICONS.forEach((icon, index) => {
            const option = document.createElement('div');
            option.className = 'icon-option' + (index === 0 ? ' selected' : '');
            option.textContent = icon;
            option.dataset.icon = icon;
            option.addEventListener('click', () => this.selectIcon(icon));
            els.iconPicker.appendChild(option);
        });
    },

    selectIcon(icon) {
        this.elements.eventIcon.value = icon;
        document.querySelectorAll('.icon-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.icon === icon);
        });
    },

    initImageUpload() {
        const els = this.elements;
        if (!els.imageUploadArea) return;

        els.imageUploadArea.addEventListener('click', () => els.eventImage.click());

        els.eventImage.addEventListener('change', (e) => {
            if (e.target.files.length > 0) this.handleImageFile(e.target.files[0]);
        });

        els.imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            els.imageUploadArea.classList.add('dragover');
        });

        els.imageUploadArea.addEventListener('dragleave', () => els.imageUploadArea.classList.remove('dragover'));

        els.imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            els.imageUploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) this.handleImageFile(e.dataTransfer.files[0]);
        });

        els.removeImage.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearImageUpload();
        });
    },

    // 延遲上傳：僅預覽，不立即上傳
    handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast(t('selectImageFile'), 'error');
            return;
        }

        // 儲存檔案以便稍後上傳
        this.pendingImageFile = file;

        // 僅本地預覽，不發送到 server
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.previewImg.src = e.target.result;
            this.elements.uploadPlaceholder.classList.add('hidden');
            this.elements.imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);

        showToast(t('imageSelected'), 'info');
    },

    // 實際上傳圖片
    async uploadPendingImage() {
        if (!this.pendingImageFile) return null;

        const formData = new FormData();
        formData.append('image', this.pendingImageFile);

        try {
            const response = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                this.pendingImageFile = null;
                return result.image_path;
            } else {
                showToast(result.error || t('uploadFailed'), 'error');
                return null;
            }
        } catch (err) {
            showToast(t('uploadFailed'), 'error');
            return null;
        }
    },

    clearImageUpload() {
        const els = this.elements;
        els.eventImage.value = '';
        els.eventImagePath.value = '';
        els.previewImg.src = '';
        els.uploadPlaceholder.classList.remove('hidden');
        els.imagePreview.classList.add('hidden');
        this.pendingImageFile = null; // 清除待上傳檔案
    }
};

// Expose openAddModal globally if needed by other modules (e.g. Map Context Menu)
window.openAddModal = (latlng) => Forms.openAddModal(latlng);
