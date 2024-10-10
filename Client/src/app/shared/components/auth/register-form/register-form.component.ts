import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  registerForm: FormGroup;

  constructor() {
    this.registerForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      displayName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    })
  }

  private trimAllWhiteSpaces(): void {
    Object.keys(this.registerForm.value).forEach((control) => {
      if(control !== "phoneNumber") {
        const trimedValue: string = this.registerForm.get(control)?.value?.trim();
        this.registerForm.controls[control]?.setValue(trimedValue);
      }
    });
  }

  private bothConfirmPasswordAndPasswordCheck() {
    const { password, confirmPassword } = this.registerForm.value;

    if(password && (password as string).length < 8) {
      this.registerForm.get('password')?.setErrors({ message: `Should contain least 8 characters.` });

    }else if(password && confirmPassword && (password !== confirmPassword)) {
      this.registerForm.get('confirmPassword')?.setErrors({ message: `Both Password doesn't match.` });
    }
  }

  onSubmit() {
    this.trimAllWhiteSpaces(); 
    this.bothConfirmPasswordAndPasswordCheck();

    if(this.registerForm.invalid) return this.registerForm.markAllAsTouched();

    console.log(this.registerForm.value);
  }
}
