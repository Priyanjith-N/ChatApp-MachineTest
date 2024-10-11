import { Routes } from '@angular/router';
import { MainAuthPageComponent } from './features/auth/main-auth-page/main-auth-page.component';
import { LoginFormComponent } from './shared/components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './shared/components/auth/register-form/register-form.component';
import { HomePageComponent } from './features/home-page/home-page.component';

export const routes: Routes = [
    {
        path: "auth",
        pathMatch: "full",
        redirectTo: "/auth/login"
    },
    {
        path: "auth",
        component: MainAuthPageComponent,
        children: [
            {
                path: "login",
                component: LoginFormComponent
            },
            {
                path: "register",
                component: RegisterFormComponent
            }
        ]
    },
    {
        path: '',
        component: HomePageComponent,
        children: [
            
        ]
    }
];
