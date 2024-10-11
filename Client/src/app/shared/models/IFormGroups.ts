import { FormControl } from "@angular/forms";

export interface ILoginForm {
    identifier: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface IRegisterForm {
    userName: FormControl<string | null>;
    displayName: FormControl<string | null>;
    email: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}
  