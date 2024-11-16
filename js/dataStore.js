class DataStore {
    static KEYS = {
        USERS: 'adagio_users',
        PROJECTS: 'adagio_projects',
        TIMESHEETS: 'adagio_timesheets',
        SETTINGS: 'adagio_settings'
    };

    static initializeData() {
        try {
            // Load data from localStorage or use defaults
            if (!localStorage.getItem(this.KEYS.USERS)) {
                this.saveData(this.KEYS.USERS, APP_DATA.users);
            } else {
                APP_DATA.users = JSON.parse(localStorage.getItem(this.KEYS.USERS));
            }

            APP_DATA.projects = JSON.parse(localStorage.getItem(this.KEYS.PROJECTS)) || {};
            APP_DATA.timesheets = JSON.parse(localStorage.getItem(this.KEYS.TIMESHEETS)) || {};
            APP_DATA.settings = JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || {
                currency: 'USD',
                dateFormat: 'YYYY-MM-DD',
                theme: 'light'
            };
            
            console.log('Data loaded successfully');
        } catch (error) {
            console.error('Error initializing data:', error);
            showNotification('Error loading data', 'error');
        }
    }

    static saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            showNotification(`Error saving data`, 'error');
        }
    }

    static saveAllData() {
        Object.entries(this.KEYS).forEach(([key, value]) => {
            this.saveData(value, APP_DATA[key.toLowerCase()]);
        });
    }

    static clearAllData() {
        try {
            Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
            console.log('All data cleared successfully');
            showNotification('All data cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing data:', error);
            showNotification('Error clearing data', 'error');
        }
    }
} 