import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {withInterceptors} from '@angular/common/http';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {authIntercept} from "./auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authIntercept]))
  ]
};
