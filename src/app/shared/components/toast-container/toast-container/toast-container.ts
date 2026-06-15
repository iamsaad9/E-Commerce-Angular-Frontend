import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center justify-between p-4 rounded-xl shadow-lg border text-white transition-all duration-300 animate-slide-in"
          [class.bg-emerald-600]="toast.type === 'success'"
          [class.border-emerald-500]="toast.type === 'success'"
          [class.bg-rose-600]="toast.type === 'error'"
          [class.border-rose-500]="toast.type === 'error'"
          [class.bg-amber-500]="toast.type === 'warning'"
          [class.border-amber-400]="toast.type === 'warning'"
          [class.bg-blue-600]="toast.type === 'info'"
          [class.border-blue-500]="toast.type === 'info'"
        >
          <div class="flex items-center gap-2">
            @switch (toast.type) {
              @case ('success') {
                <span>✅</span>
              }
              @case ('error') {
                <span>🚨</span>
              }
              @case ('warning') {
                <span>⚠️</span>
              }
              @case ('info') {
                <span>ℹ️</span>
              }
            }
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>

          <button
            (click)="toastService.dismiss(toast.id)"
            class="ml-4 text-white hover:text-gray-200 focus:outline-none text-lg font-bold"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slideIn {
        from {
          transform: translateX(120%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slide-in {
        animation: slideIn 0.25s ease-out forwards;
      }
    `,
  ],
})
export class ToastContainerComponent {
  protected toastService = inject(ToastService);
}
