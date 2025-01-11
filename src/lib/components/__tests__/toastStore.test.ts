import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { toasts, addToast, removeToast } from '../toastStore';

describe('Toast Store', () => {
    beforeEach(() => {
        // Clear all toasts before each test
        toasts.set([]);
        // Reset all timers
        vi.useRealTimers();
    });

    it('should add a toast with default type', () => {
        addToast('Test message');
        const currentToasts = get(toasts);

        expect(currentToasts).toHaveLength(1);
        expect(currentToasts[0]).toMatchObject({
            message: 'Test message',
            type: 'info'
        });
    });

    it('should add a toast with specified type', () => {
        addToast('Success message', 'success');
        const currentToasts = get(toasts);

        expect(currentToasts).toHaveLength(1);
        expect(currentToasts[0]).toMatchObject({
            message: 'Success message',
            type: 'success'
        });
    });

    it('should remove a toast by id', () => {
        addToast('Test message');
        const [toast] = get(toasts);

        removeToast(toast.id);
        const currentToasts = get(toasts);

        expect(currentToasts).toHaveLength(0);
    });

    it('should auto-remove toast after timeout', () => {
        vi.useFakeTimers();
        addToast('Test message');

        expect(get(toasts)).toHaveLength(1);

        // Advance timer by default timeout (3000ms)
        vi.advanceTimersByTime(3000);

        expect(get(toasts)).toHaveLength(0);
    });

    it('should handle multiple toasts', () => {
        addToast('First message');
        addToast('Second message', 'success');
        addToast('Third message', 'error');

        const currentToasts = get(toasts);
        expect(currentToasts).toHaveLength(3);
        expect(currentToasts[0].message).toBe('First message');
        expect(currentToasts[1].message).toBe('Second message');
        expect(currentToasts[2].message).toBe('Third message');
        expect(currentToasts[1].type).toBe('success');
        expect(currentToasts[2].type).toBe('error');
    });

    it('should maintain order when removing toasts', () => {
        vi.useFakeTimers();

        // Add toasts without auto-removal
        toasts.update(() => [
            { message: 'First', type: 'info', id: 1 },
            { message: 'Second', type: 'info', id: 2 },
            { message: 'Third', type: 'info', id: 3 }
        ]);

        removeToast(2); // Remove the second toast

        const remainingToasts = get(toasts);
        expect(remainingToasts).toHaveLength(2);
        expect(remainingToasts[0].message).toBe('First');
        expect(remainingToasts[1].message).toBe('Third');

        vi.useRealTimers();
    });
});
