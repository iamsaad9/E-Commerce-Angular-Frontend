import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterCommand } from '../../models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  // styleUrl: './register.css',
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
  });

  onSubmit(): void {
    if ((this, this.registerForm.invalid)) {
      this.registerForm.markAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const command = this.registerForm.getRawValue() as RegisterCommand;

    this.authService.register(command).subscribe({
      next: (response) => {
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/login';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.errorMessage.set(response.message || 'Register failed');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.errorMessage.set(err.error.message || 'An unexpected error occured');
        this.isLoading.set(false);
      },
    });
  }
}
