import { Routes } from '@angular/router';
import { MainAuthPageComponent } from './features/auth/main-auth-page/main-auth-page.component';
import { LoginFormComponent } from './shared/components/auth/login-form/login-form.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: MainAuthPageComponent,
        children: [
            {
                path: 'login',
                component: LoginFormComponent
            }
        ]
    }
];
