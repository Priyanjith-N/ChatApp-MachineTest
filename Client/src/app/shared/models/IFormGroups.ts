import { FormControl } from "@angular/forms";

export interface ILoginForm {
    identifier: FormControl<string | null>;
    password: FormControl<string | null>;
}
  