class Dashboard {
    static updateStats() {
        const statsElements = {
            projects: document.querySelector('[data-stat="projects"]'),
            users: document.querySelector('[data-stat="users"]'),
            clients: document.querySelector('[data-stat="clients"]')
        };

        if (statsElements.projects) {
            statsElements.projects.textContent = Object.keys(APP_DATA.projects || {}).length;
        }
        if (statsElements.users) {
            statsElements.users.textContent = Object.keys(APP_DATA.users || {}).length;
        }
        if (statsElements.clients) {
            statsElements.clients.textContent = Object.keys(APP_DATA.clients || {}).length;
        }
    }

    static getContent() {
        return `
            <div class="space-y-6">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h1 class="text-2xl font-bold">Welcome back, admin!</h1>
                    <p class="text-gray-600">Here's what's happening today</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Projects</h3>
                            <span class="material-icons text-blue-500">assignment</span>
                        </div>
                        <p class="text-3xl font-bold mt-2" data-stat="projects">${Object.keys(APP_DATA.projects || {}).length}</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Team</h3>
                            <span class="material-icons text-green-500">people</span>
                        </div>
                        <p class="text-3xl font-bold mt-2" data-stat="users">${Object.keys(APP_DATA.users || {}).length}</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold">Clients</h3>
                            <span class="material-icons text-purple-500">business</span>
                        </div>
                        <p class="text-3xl font-bold mt-2" data-stat="clients">${Object.keys(APP_DATA.clients || {}).length}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div class="space-y-2">
                            <button onclick="ProjectManagement.showAddModal()" 
                                    class="quick-action-btn">
                                <span class="material-icons mr-2 text-blue-500">add</span>
                                New Project
                            </button>
                            <button onclick="UserManagement.showAddModal()" 
                                    class="quick-action-btn">
                                <span class="material-icons mr-2 text-green-500">person_add</span>
                                New User
                            </button>
                            <button onclick="ClientManagement.showAddModal()" 
                                    class="quick-action-btn">
                                <span class="material-icons mr-2 text-purple-500">business</span>
                                New Client
                            </button>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold mb-4">Recent Projects</h3>
                        <div id="recentProjects" class="space-y-2">
                            <!-- Recent projects will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static initialize() {
        this.updateRecentProjects();
    }

    static updateRecentProjects() {
        const container = document.getElementById('recentProjects');
        if (!container) return;

        const projects = Object.entries(APP_DATA.projects || {})
            .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
            .slice(0, 5);

        container.innerHTML = projects.length ? projects.map(([id, project]) => `
            <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div>
                    <h4 class="font-medium">${project.name}</h4>
                    <p class="text-sm text-gray-500">${project.client}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs ${
                    project.status === 'complete' ? 'bg-green-100 text-green-800' :
                    project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }">${project.status}</span>
            </div>
        `).join('') : '<p class="text-gray-500">No recent projects</p>';
    }
}