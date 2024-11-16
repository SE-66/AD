class ClientManagement extends Management {
    static type = 'clients';

    static getFormFields(item = null) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" name="name" placeholder="Acme Inc." 
                           class="w-full p-2 border rounded-lg" value="${item?.name || ''}" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input type="text" name="contact_person" placeholder="John Smith" 
                           class="w-full p-2 border rounded-lg" value="${item?.contact_person || ''}" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" placeholder="contact@acme.com" 
                           class="w-full p-2 border rounded-lg" value="${item?.email || ''}" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" placeholder="+1 (555) 000-0000" 
                           class="w-full p-2 border rounded-lg" value="${item?.phone || ''}" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <input type="text" name="industry" placeholder="Technology" 
                           class="w-full p-2 border rounded-lg" value="${item?.industry || ''}" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" class="w-full p-2 border rounded-lg" required>
                        <option value="Active" ${item?.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Inactive" ${item?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>
        `;
    }

    static updateList() {
        const clientList = document.getElementById('clientList');
        if (!clientList) return;

        const clients = Object.entries(APP_DATA.clients || {})
            .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt));

        clientList.innerHTML = clients.length ? clients.map(([id, client]) => `
            <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start">
                    <div class="flex-1 min-w-0 mr-6">
                        <div class="flex items-center justify-between mb-1">
                            <h3 class="text-lg font-semibold text-gray-900 truncate">${client.name}</h3>
                            <span class="px-3 py-1 rounded-full text-sm ${
                                client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }">${client.status}</span>
                        </div>
                        <p class="text-gray-600 mb-2">${client.industry}</p>
                        <div class="flex items-center text-sm text-gray-500 space-x-4">
                            <span class="flex items-center">
                                <span class="material-icons text-sm mr-1">person</span>
                                ${client.contact_person}
                            </span>
                            <span class="flex items-center">
                                <span class="material-icons text-sm mr-1">email</span>
                                ${client.email}
                            </span>
                            <span class="flex items-center">
                                <span class="material-icons text-sm mr-1">phone</span>
                                ${client.phone}
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="ClientManagement.editItem('${id}')"
                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <span class="material-icons">edit</span>
                        </button>
                        <button onclick="ClientManagement.deleteItem('${id}')"
                                class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('') : this.getEmptyState();
    }
} 