import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  #toasts = signal<Toast[]>([]);
  toasts = this.#toasts.asReadonly();

  private nextId = 0;

  show(message: string, type: ToastType = 'info', duaration: 4000): void {
    const id = this.nextId++;
    const newToast: Toast = { id, message, type };

    this.#toasts.update((current) => [...current, newToast]);

    setTimeout(() => {
      this.dismiss(id);
    }, duaration);
  }

  dismiss(id: number): void {
    this.#toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
