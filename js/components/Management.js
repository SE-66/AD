class Management {
    static type = '';

    static initialize() {
        this.updateList();
    }

    static showAddModal(fromQuickAction = false) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
        modal.id = `${this.type}Modal`;
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">New ${this.type.slice(0, -1)}</h3>
                    <button type="button" onclick="document.getElementById('${this.type}Modal').remove()" 
                            class="text-gray-500 hover:text-gray-700">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <form id="${this.type}Form" class="space-y-4">
                    ${this.getFormFields()}
                    <div class="flex space-x-3 mt-6">
                        <button type="submit" 
                                class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Create
                        </button>
                        <button type="button" 
                                onclick="document.getElementById('${this.type}Modal').remove()"
                                class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const form = document.getElementById(`${this.type}Form`);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            await this.create(data);
            modal.remove();
            this.updateList();
            this.showNotification(`${this.type.slice(0, -1)} created successfully`, 'success');
        });
    }

    static editItem(id) {
        const item = APP_DATA[this.type][id];
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Edit ${this.type.slice(0, -1)}</h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-500 hover:text-gray-700">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <form id="${this.type}Form" class="space-y-4" data-edit-id="${id}">
                    ${this.getFormFields(item)}
                    <div class="flex space-x-3 mt-6">
                        <button type="submit" 
                                class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Update
                        </button>
                        <button type="button" 
                                onclick="this.closest('.fixed').remove()"
                                class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Add form submit handler
        const form = document.getElementById(`${this.type}Form`);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = e.target.getAttribute('data-edit-id');
            this.handleSave(editId);
        });
    }

    static handleSave(editId = null, fromQuickAction = false) {
        const form = document.getElementById(`${this.type}Form`);
        const formData = {};
        form.querySelectorAll('input, select, textarea').forEach(input => {
            formData[input.name] = input.value.trim();
        });

        if (editId) {
            APP_DATA[this.type][editId] = {
                ...APP_DATA[this.type][editId],
                ...formData,
                updatedAt: new Date().toISOString()
            };
        } else {
            const id = Utils.generateId();
            APP_DATA[this.type][id] = {
                id,
                ...formData,
                createdAt: new Date().toISOString()
            };
        }

        // Save data
        DataStore.saveAllData();
        
        // Update based on where the action was initiated
        if (fromQuickAction) {
            Dashboard.initialize();
        } else {
            AdminUI.showSection(this.type);
            this.updateList();
        }
        
        // Close the modal
        const modalElement = document.querySelector('.fixed.inset-0');
        if (modalElement) {
            modalElement.remove();
        }
        
        // Show notification
        this.showNotification(
            `${this.type.slice(0, -1)} ${editId ? 'updated' : 'added'} successfully`,
            'success'
        );
    }

    static deleteItem(id) {
        const item = APP_DATA[this.type][id];
        const modalHTML = `
            <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-6 max-w-md w-full transform transition-all">
                    <div class="text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <span class="material-icons text-red-600">warning</span>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Delete ${this.type.slice(0, -1)}</h3>
                        <p class="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete ${item?.name || `this ${this.type.slice(0, -1)}`}? 
                            This action cannot be undone.
                        </p>
                        <div class="flex justify-center space-x-3">
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button onclick="Management.confirmDelete('${id}', '${this.type}')" 
                                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    static confirmDelete(id, type) {
        delete APP_DATA[type][id];
        DataStore.saveAllData();
        Dashboard.updateStats();
        
        if (document.getElementById('mainContent').innerHTML.includes('Dashboard')) {
            Dashboard.initialize();
        } else {
            AdminUI.showSection(type);
        }
        
        // Close the modal
        this.closeModal();
        this.showNotification(`${type.slice(0, -1)} deleted successfully`, 'warning');
    }

    static closeModal() {
        const modalElement = document.querySelector('.fixed.inset-0');
        if (modalElement) {
            modalElement.remove();
        }
    }

    static updateList() {
        const listContainer = document.getElementById(`${this.type}List`);
        const headerButton = document.getElementById(`${this.type}HeaderButton`);
        if (!listContainer) return;

        const items = Object.entries(APP_DATA[this.type] || {})
            .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt));

        if (items.length) {
            if (headerButton) headerButton.style.display = 'block';
            listContainer.innerHTML = items
                .map(([id, item]) => this.getItemHTML(id, item))
                .join('');
        } else {
            if (headerButton) headerButton.style.display = 'none';
            listContainer.innerHTML = this.getEmptyState();
        }
    }

    static getEmptyState() {
        return `
            <div class="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
                <div class="rounded-full bg-gray-100 p-6 mb-6">
                    <span class="material-icons text-gray-400 text-5xl">
                        ${this.type === 'users' ? 'people' : 
                          this.type === 'clients' ? 'business' : 
                          'assignment'}
                    </span>
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">
                    No ${this.type} found
                </h3>
                <p class="text-gray-500 mb-8 text-center max-w-sm">
                    Get started by creating your first ${this.type.slice(0, -1)}
                </p>
                <button type="button" 
                        onclick="${this.type === 'users' ? 'UserManagement' : 
                                 this.type === 'clients' ? 'ClientManagement' : 
                                 'ProjectManagement'}.showAddModal()" 
                        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                    <span class="material-icons mr-2">add</span>
                    Add ${this.type.slice(0, -1)}
                </button>
            </div>
        `;
    }

    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="material-icons mr-2">${type === 'success' ? 'check_circle' : 'warning'}</span>
                ${message}
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    static async create(data) {
        const id = crypto.randomUUID();
        APP_DATA[this.type] = APP_DATA[this.type] || {};
        APP_DATA[this.type][id] = {
            id,
            ...data,
            createdAt: new Date().toISOString(),
            status: data.status || 'Active'
        };
        DataStore.saveAllData();
        Dashboard.updateStats();
        
        // Real-time updates
        this.updateList();
        if (this.type === 'projects') {
            Dashboard.updateRecentProjects();
        }
        const headerButton = document.getElementById(`${this.type}HeaderButton`);
        if (headerButton) {
            headerButton.style.display = 'block';
        }
        
        return id;
    }

    static async update(id, data) {
        return new Promise((resolve) => {
            APP_DATA[this.type][id] = {
                ...APP_DATA[this.type][id],
                ...data,
                updatedAt: new Date().toISOString()
            };
            if (this.type === 'projects') {
                Dashboard.updateRecentProjects();
            }
            resolve(true);
        });
    }

    static async delete(id) {
        return new Promise((resolve) => {
            delete APP_DATA[this.type][id];
            DataStore.saveAllData();
            Dashboard.updateStats();
            if (this.type === 'projects') {
                Dashboard.updateRecentProjects();
            }
            resolve(true);
        });
    }

    static showForm(type, item = null) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${item ? 'Edit' : 'Create'} ${type.slice(0, -1)}</h2>
                <form id="${type}Form" class="form-stack">
                    ${this.getFormFields(type, item)}
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
} 