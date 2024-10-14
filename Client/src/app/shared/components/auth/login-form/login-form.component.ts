import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

// services
import { AuthService } from '../../../../core/services/auth.service';

// interfaces
import { IUserLoginCredentials } from '../../../models/IAuthCredentials';
import { ILoginForm } from '../../../models/IFormGroups';
import { ILoginSucessfullAPIResponse } from '../../../models/IAuthAPIResponses';
import { IValidationError } from '../../../models/IAPIErrorResponses';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  loginForm: FormGroup<ILoginForm>;
  isFormSubmited: boolean = false;

  constructor() {
    this.loginForm = new FormGroup<ILoginForm>({
      identifier: new FormControl<string | null>('', [Validators.required]),
      password: new FormControl<string | null>('', [Validators.required])
    });
  }

  private trimAllWhiteSpaces(): void {
    const controls: (keyof ILoginForm)[] = Object.keys(this.loginForm.controls) as (keyof ILoginForm)[];
    
    controls.forEach((control) => {
      const controlValue = this.loginForm.get(control)?.value;

      // Only trim if the value is a string
      if (typeof controlValue === 'string') {
        const trimmedValue: string = controlValue.trim();
        this.loginForm.controls[control].setValue(trimmedValue);
      }
    });
  }

  isFormInvalid() {
    const identifier: string | undefined | null = this.loginForm.value.identifier;

    if(!identifier) return true;

    if(Number(identifier) && identifier.length !== 10) return true;

    if(identifier.includes('@') && (/^[A-Za-z0-9]+@gmail\.com$/.test(identifier) === false)) return true;

    return false;
  }

  onSubmit() {
    this.trimAllWhiteSpaces();
    
    if(this.isFormInvalid()) {
      this.loginForm.get('identifier')?.setErrors({ message: "Invalid identifier." });
    }

    if(this.isFormSubmited || this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    this.isFormSubmited = true;

    const loginCredentials: IUserLoginCredentials = {
      identifier: this.loginForm.value.identifier!,
      password: this.loginForm.value.password!
    }

    const loginAPIResponse$: Observable<ILoginSucessfullAPIResponse> = this.authService.handelLogin(loginCredentials);

    loginAPIResponse$.subscribe({
      next: (res) => {
        this.isFormSubmited = false;

        this.router.navigate(["/"]);
      },
      error: (err) => {
        this.isFormSubmited = false;

        if(err.errorField) {
          const errObj: IValidationError = err as IValidationError;

          this.loginForm.get(errObj.errorField)?.setErrors({ message: errObj.message });
        }
      }
  });
  }
}
