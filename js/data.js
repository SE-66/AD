const APP_DATA = {
    users: {},
    projects: {},
    clients: {},
    departments: ['IT', 'HR', 'Finance', 'Operations', 'Marketing']
};

class DataStore {
    static saveAllData() {
        localStorage.setItem('APP_DATA', JSON.stringify(window.APP_DATA));
    }

    static loadAllData() {
        const savedData = localStorage.getItem('APP_DATA');
        if (savedData) {
            window.APP_DATA = JSON.parse(savedData);
        } else {
            // Initialize with default admin user
            window.APP_DATA = {
                users: {
                    'admin': {
                        id: 'admin',
                        username: 'admin',
                        password: 'admin',
                        email: 'admin@adagio.com',
                        name: 'Administrator',
                        role: 'admin',
                        department: 'IT',
                        status: 'Active',
                        createdAt: new Date().toISOString()
                    }
                },
                projects: {},
                clients: {}
            };
            this.saveAllData();
        }
    }
} 