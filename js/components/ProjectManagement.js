class ProjectManagement extends Management {
    static type = 'projects';

    static getFormFields(item = null) {
        return `
            <input type="text" name="name" placeholder="Project Name" value="${item?.name || ''}" required>
            <input type="text" name="description" placeholder="Description" value="${item?.description || ''}" required>
            <input type="text" name="client" placeholder="Client" value="${item?.client || ''}" required>
            <input type="date" name="deadline" value="${item?.deadline || ''}" required>
            <input type="number" name="budget" placeholder="Budget" value="${item?.budget || ''}" required>
            <select name="status" required>
                <option value="planning" ${item?.status === 'planning' ? 'selected' : ''}>Planning</option>
                <option value="in-progress" ${item?.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${item?.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
            <input type="text" name="manager" placeholder="Project Manager" value="${item?.manager || ''}" required>
            <input type="text" name="team_members" placeholder="Team Members" value="${item?.team_members || ''}">
            <input type="number" name="estimated_hours" placeholder="Estimated Hours" value="${item?.estimated_hours || ''}">
            <input type="text" name="technologies" placeholder="Technologies" value="${item?.technologies || ''}">
        `;
    }

    static updateList() {
        const projectList = document.getElementById('projectList');
        if (!projectList) return;

        const projects = Object.entries(APP_DATA.projects || {})
            .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt));

        projectList.innerHTML = projects.length ? projects.map(([id, project]) => `
            <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start">
                    <div class="flex-1 min-w-0 mr-6">
                        <div class="flex items-center justify-between mb-1">
                            <h3 class="text-lg font-semibold text-gray-900 truncate">${project.name}</h3>
                            <span class="px-3 py-1 rounded-full text-sm ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }">${project.status}</span>
                        </div>
                        <p class="text-gray-600 mb-2">${project.description}</p>
                        <div class="flex items-center text-sm text-gray-500 space-x-4">
                            <span class="flex items-center">
                                <span class="material-icons text-sm mr-1">event</span>
                                ${new Date(project.deadline).toLocaleDateString()}
                            </span>
                            <span class="flex items-center">
                                <span class="material-icons text-sm mr-1">schedule</span>
                                Created ${timeSince(new Date(project.createdAt))} ago
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="ProjectManagement.editItem('${id}')"
                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <span class="material-icons">edit</span>
                        </button>
                        <button onclick="ProjectManagement.deleteItem('${id}')"
                                class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('') : this.getEmptyState();
    }
}

// Helper function for time formatting
function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'}`;
        }
    }
    return 'just now';
} 