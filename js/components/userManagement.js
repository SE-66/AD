class UserManagement extends Management {
    static type = 'users';

    static getFormFields() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" name="name" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input type="text" name="department" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
        `;
    }

    static async create(data) {
        const id = await super.create(data);
        this.updateList();
        const headerButton = document.getElementById('userHeaderButton');
        if (headerButton) {
            headerButton.style.display = 'block';
        }
        return id;
    }

    static updateList() {
        const userList = document.getElementById('userList');
        if (!userList) return;

        const users = Object.entries(APP_DATA.users || {})
            .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt));

        userList.innerHTML = users.length ? users.map(([id, user]) => `
            <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start">
                    <div class="flex-1 min-w-0 mr-6">
                        <div class="flex items-center justify-between mb-1">
                            <h3 class="text-lg font-semibold text-gray-900 truncate">${user.name}</h3>
                            <span class="px-3 py-1 rounded-full text-sm ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }">${user.status}</span>
                        </div>
                        <p class="text-gray-600 mb-2">${user.email}</p>
                        <div class="flex items-center text-sm text-gray-500 space-x-4">
                            <span class="flex items-center">
                                <span class="material-icons text-sm mr-1">badge</span>
                                ${user.role}
                            </span>
                            <span class="flex items-center">
                                <span class="material-icons text-sm mr-1">business</span>
                                ${user.department}
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="UserManagement.editItem('${id}')"
                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <span class="material-icons">edit</span>
                        </button>
                        <button onclick="UserManagement.deleteItem('${id}')"
                                class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('') : this.getEmptyState();
    }
} 