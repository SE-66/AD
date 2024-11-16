const Utils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString();
    },
    
    generateId: () => {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};