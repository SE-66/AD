class App {
    static initialize() {
        // Clear any existing data first
        localStorage.clear();
        
        // Initialize data store
        DataStore.loadAllData();
        
        // Initialize authentication
        Auth.init();
        
        // Check login status
        if (Auth.isLoggedIn()) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            Auth.updateUserGreeting(currentUser);
            this.showAdminPanel();
        } else {
            this.showLoginPanel();
        }
    }

    static showLoginPanel() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
    }

    static showAdminPanel() {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        AdminUI.init();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.initialize();
}); 