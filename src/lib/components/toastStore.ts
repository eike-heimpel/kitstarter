import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
    message: string;
    type: ToastType;
    id: number;
};

// Create a writable store for managing toasts
export const toasts = writable<Toast[]>([]);

// Helper function to add a toast
export function addToast(message: string, type: ToastType = 'info') {
    const id = Date.now();
    toasts.update((all) => [...all, { message, type, id }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
        removeToast(id);
    }, 3000);
}

// Helper function to remove a toast
export function removeToast(id: number) {
    toasts.update((all) => all.filter((t) => t.id !== id));
}
