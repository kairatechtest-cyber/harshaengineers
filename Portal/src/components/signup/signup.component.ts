
import { Component, ChangeDetectionStrategy, output, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit, OnDestroy {
  switchToLogin = output<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private emailSub: Subscription | undefined;

  isLoading = this.loadingService.isLoading;
  signupStatus = signal<{ message: string; isError: boolean } | null>(null);
  passwordVisible = signal(false);
  confirmPasswordVisible = signal(false);
  
  securityQuestions = [
    'What was your first pet\'s name?',
    'What is your mother\'s maiden name?',
    'What was the name of your elementary school?',
    'In what city were you born?'
  ];

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, this.corporateEmailValidator.bind(this)]],
    username: [{ value: '', disabled: true }, Validators.required],
    country: ['', Validators.required],
    location: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
    companyName: ['', Validators.required],
    jobTitle: ['', Validators.required],
    securityQuestion: ['', Validators.required],
    securityAnswer: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    this.emailSub = this.signupForm.get('email')?.valueChanges.subscribe(email => {
      if (email) {
        const username = email.split('@')[0];
        this.signupForm.get('username')?.setValue(username);
      }
    });
  }

  ngOnDestroy() {
    this.emailSub?.unsubscribe();
  }

  togglePasswordVisibility() {
    this.passwordVisible.update(v => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible.update(v => !v);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  corporateEmailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const isValid = this.authService.isCorporateEmail(control.value);
    return isValid ? null : { unauthorizedDomain: true };
  }

  async onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.signupStatus.set(null);
    try {
      await this.authService.signup(this.signupForm.getRawValue());
      this.signupStatus.set({ message: 'Account created successfully! You can now log in.', isError: false });
      
      // Redirect to login after 1.5s
      setTimeout(()=>{
        this.switchToLogin.emit();
      }, 1500);

    } catch (error: any) {
      this.signupStatus.set({ message: error.message, isError: true });
    }
  }

  onLoginClick() {
    this.switchToLogin.emit();
  }
}
