import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    
    provideHttpClient(withInterceptorsFromDi()), 

    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('token'),
          allowedDomains: ['localhost:8080'], 
        },
      })
    ),
    
    JwtHelperService 
  ]
};