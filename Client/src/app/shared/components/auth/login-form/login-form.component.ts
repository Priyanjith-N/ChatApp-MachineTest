import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      identifier: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  isFormInvalid() {
    const identifier: string | undefined = this.loginForm.value.identifier;

    if(!identifier) return true;

    if(Number(identifier) && identifier.length !== 10) return true;

    if(identifier.includes('@') && (/^[A-Za-z0-9]+@gmail\.com$/.test(identifier) === false)) return true;

    return false;
  }

  onSubmit() {
    if(this.isFormInvalid()) {
      this.loginForm.get('identifier')?.setErrors({ message: "Invalid identifier." });
    }

    if(this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    console.log(this.loginForm.value);
    
  }
}
