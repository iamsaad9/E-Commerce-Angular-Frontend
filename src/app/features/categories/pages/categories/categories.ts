import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CategoriesService } from '../../services/categories.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { GetAllCategoriesResponse } from '../../model/categories.model';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, CommonModule],
  templateUrl: './categories.html',
  // styleUrl: './categories.css',
})
export class Categories {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected categoriesService = inject(CategoriesService);

  onLogout(): void {
    const currentUrl = this.router.url;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: currentUrl },
        });
      },
      error: (err) => {
        console.log('Logout Failed', err);
        this.router.navigate(['/auth/login']);
      },
    });
  }

  onGettingAllCategory(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: () => {
        this.toast.show('All categories fetched', 'success', 4000);
      },
      error: (err) => {
        this.toast.show('Failed to fetched all categories ', 'error', 4000);
      },
    });
  }

  onGettingCategory(slug: string): void {
    this.categoriesService.getCategory(slug).subscribe({
      next: () => {
        // this.toast.show('Category fetched', 'success', 4000);
      },
      error: (err) => {
        // this.toast.show('Failed to fetched category ', 'error', 4000);
      },
    });
  }
}
