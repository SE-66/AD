window.APP_DATA = {
    users: {
        'admin': {
            username: 'admin',
            password: 'admin',
            email: 'admin@adagio.com',
            name: 'Administrator',
            role: 'admin',
            department: 'IT',
            position: 'System Administrator',
            hire_date: '2024-01-01',
            manager: null,
            skills: ['System Administration', 'Security'],
            certifications: ['CISSP'],
            office_location: 'HQ',
            emergency_contact: 'Emergency:911',
            working_hours: '9:00-17:00 EST',
            salary_band: 'A1',
            performance_rating: 'Outstanding',
            projects_assigned: [],
            languages: ['English'],
            security_clearance: 'Level 3',
            remote_status: 'Office-based',
            createdAt: '2024-01-01T00:00:00.000Z',
            status: 'Active'
        }
    },
    projects: {
        'proj1': {
            id: 'proj1',
            name: 'Website Redesign',
            client: 'client1',
            deadline: '2024-06-30',
            description: 'Complete website overhaul',
            progress: 75,
            // Add any other necessary project details here
        }
    },
    clients: {
        'client1': {
            name: 'Client 1',
            email: 'client1@example.com',
            phone: '555-1234',
            address: '123 Main St, City, State, ZIP'
        }
    },
    departments: {
        'IT': {
            name: 'Information Technology',
            manager: 'admin',
            employees: ['admin']
        }
    }
};

class AdminUI {
    static init() {
        this.bindNavigation();
        this.showSection('dashboard');
    }

    static bindNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
                
                // Update active nav state
                document.querySelectorAll('.nav-link').forEach(el => {
                    el.classList.remove('border-indigo-500', 'text-gray-900');
                    el.classList.add('border-transparent', 'text-gray-500');
                });
                e.currentTarget.classList.add('border-indigo-500', 'text-gray-900');
                e.currentTarget.classList.remove('border-transparent', 'text-gray-500');
            });
        });
    }

    static showSection(section) {
        const mainContent = document.getElementById('mainContent');
        const pageTitle = document.getElementById('pageTitle');
        
        switch(section) {
            case 'dashboard':
                pageTitle.textContent = 'Dashboard';
                mainContent.innerHTML = Dashboard.getContent();
                Dashboard.initialize();
                break;
            case 'projects':
                pageTitle.textContent = 'Projects';
                mainContent.innerHTML = this.getProjectsContent();
                ProjectManagement.updateList();
                break;
            case 'users':
                pageTitle.textContent = 'Users';
                mainContent.innerHTML = this.getUsersContent();
                UserManagement.updateList();
                break;
            case 'clients':
                pageTitle.textContent = 'Clients';
                mainContent.innerHTML = this.getClientsContent();
                ClientManagement.updateList();
                break;
        }

        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            const isActive = link.getAttribute('data-section') === section;
            link.classList.toggle('bg-gray-100', isActive);
            link.classList.toggle('text-gray-900', isActive);
        });
    }

    static getProjectsContent() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">Projects</h2>
                        <p class="text-gray-600">Manage your projects</p>
                    </div>
                    <div id="projectsHeaderButton" style="display: ${Object.keys(APP_DATA.projects || {}).length ? 'block' : 'none'}">
                        <button onclick="ProjectManagement.showAddModal()" 
                                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <span class="material-icons mr-2">add</span>
                            New Project
                        </button>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm overflow-hidden min-h-[calc(100vh-16rem)]">
                    <div id="projectList" class="divide-y divide-gray-200">
                        <!-- Projects will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    static getUsersContent() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">Users</h2>
                        <p class="text-gray-600">Manage system users</p>
                    </div>
                    <div id="userHeaderButton" style="display: ${Object.keys(APP_DATA.users || {}).length ? 'block' : 'none'}">
                        <button onclick="UserManagement.showAddModal()" 
                                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <span class="material-icons mr-2">add</span>
                            New User
                        </button>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm overflow-hidden min-h-[calc(100vh-16rem)]">
                    <div id="userList" class="divide-y divide-gray-200">
                        <!-- Users will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    static getClientsContent() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">Clients</h2>
                        <p class="text-gray-600">Manage your clients</p>
                    </div>
                    <div id="clientsHeaderButton" style="display: ${Object.keys(APP_DATA.clients || {}).length ? 'block' : 'none'}">
                        <button onclick="ClientManagement.showAddModal()" 
                                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <span class="material-icons mr-2">add</span>
                            New Client
                        </button>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm overflow-hidden min-h-[calc(100vh-16rem)]">
                    <div id="clientList" class="divide-y divide-gray-200">
                        <!-- Clients will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }
}

function initUsers() {
    const usersContent = document.getElementById('usersContent');
    usersContent.innerHTML = `
        <div class="space-y-2">
            <div class="text-gray-600">Total Users: 0</div>
            <!-- Add more user-related content here -->
        </div>
    `;
}
