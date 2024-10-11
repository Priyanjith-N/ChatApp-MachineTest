import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorHandelingInterceptor } from './core/interceptors/error-handeling.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withViewTransitions(), withInMemoryScrolling({ scrollPositionRestoration: "top" })),
    provideAnimations(),
    provideHttpClient(withInterceptors([errorHandelingInterceptor]))
  ]
};