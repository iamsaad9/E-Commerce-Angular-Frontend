import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../core/models/api-response.model';
import { GetAllCategoriesResponse, GetCategoryResponse } from '../model/categories.model';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private readonly apiUrl = 'http://localhost:5288/api/categories';

  #categories = signal<GetAllCategoriesResponse | null>(null);
  categories = this.#categories.asReadonly();

  #category = signal<GetCategoryResponse | null>(null);
  category = this.#category.asReadonly();

  constructor() {}

  getAllCategories(): Observable<ApiResponse<GetAllCategoriesResponse | null>> {
    return this.http
      .get<ApiResponse<GetAllCategoriesResponse | null>>(`${this.apiUrl}/all`, {})
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.#categories.set(response.data);
          } else {
            this.#categories.set(null);
          }
        }),
        catchError(() => {
          this.#categories.set(null);
          return of({
            success: false,
            message: 'Failed to load categories.',
            data: null,
            errors: null,
          });
        }),
        finalize(() => {
          console.log('All Categories: ', this.categories());
        }),
      );
  }

  getCategory(slug: string): Observable<ApiResponse<GetCategoryResponse | null>> {
    return this.http.get<ApiResponse<GetCategoryResponse | null>>(`${this.apiUrl}/${slug}`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.toast.show('Category fetched', 'success', 4000);
          this.#category.set(response.data);
        } else {
          this.toast.show('Failed to fetched all categories ', 'error', 4000);
          this.#category.set(null);
        }
      }),
      catchError(() => {
        this.toast.show('Error Catched. Failed to fetched all categories ', 'error', 4000);
        this.#category.set(null);
        return of({
          success: false,
          message: 'Failed to get category.',
          data: null,
          errors: null,
        });
      }),
    );
  }
}
