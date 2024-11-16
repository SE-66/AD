class Auth {
    static init() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    static handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Login attempt:', { username, password }); // Debug log
        console.log('Available users:', window.APP_DATA.users); // Debug log

        const users = window.APP_DATA.users;
        const user = Object.values(users).find(u => 
            u.username === username && u.password === password
        );

        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUserGreeting(user);
            App.showAdminPanel();
            this.showNotification('Login successful', 'success');
        } else {
            this.showNotification('Invalid username or password', 'error');
        }
    }

    static showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    static updateUserGreeting(user) {
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${user.name}`;
        }
    }

    static logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        App.showLoginPanel();
        this.showNotification('Logged out successfully', 'info');
    }

    static isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
} 