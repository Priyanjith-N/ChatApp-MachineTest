import { Routes } from '@angular/router';
import { MainAuthPageComponent } from './features/auth/main-auth-page/main-auth-page.component';
import { LoginFormComponent } from './shared/components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './shared/components/auth/register-form/register-form.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { ChatComponent } from './shared/components/home/chat/chat.component';
import { ProfileComponent } from './shared/components/home/profile/profile.component';
import { SettingsComponent } from './shared/components/home/settings/settings.component';

// guards
import { authGuard } from './core/guards/auth.guard';
import { authPageAcessGuard } from './core/guards/auth-page-acess.guard';
import { ViewChatMessagesComponent } from './shared/components/home/view-chat-messages/view-chat-messages.component';
import { DefaultViewChatMessageComponent } from './shared/components/home/default-view-chat-message/default-view-chat-message.component';

export const routes: Routes = [
    {
        path: "auth",
        pathMatch: "full",
        redirectTo: "/auth/login"
    },
    {
        path: "auth",
        canActivate: [authPageAcessGuard],
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
        pathMatch: 'full',
        redirectTo: '/chat'
    },
    {
        path: '',
        canActivate: [authGuard],
        component: HomePageComponent,
        children: [
            {
                path: 'chat',
                component: ChatComponent,
                children: [
                    {
                        path: '',
                        component: DefaultViewChatMessageComponent
                    },
                    {
                        path: ':roomId',
                        component: ViewChatMessagesComponent
                    },
                ]
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            }
        ]
    }
];
