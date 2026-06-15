import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCommand } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  // styleUrl: './login.css',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
  });
  private toastService = inject(ToastService);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const command = this.loginForm.getRawValue() as LoginCommand;

    this.authService.login(command).subscribe({
      next: (response) => {
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/categories';
          this.toastService.show('Successfully Logined.', 'success', 4000);
          this.router.navigateByUrl(returnUrl);
        } else {
          this.errorMessage.set(response.message || 'Login failed.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        const originalReturnUrl = this.route.snapshot.queryParams['returnUrl'] || '/categories';
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: originalReturnUrl },
          queryParamsHandling: 'merge', // Tells Angular to maintain the original value cleanly without stacking!
        });
        this.errorMessage.set(err.error.message || 'An unexpected error occured.');
        this.isLoading.set(false);
      },
    });
  }
}
