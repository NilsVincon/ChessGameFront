import {HttpInterceptor, HttpRequest, HttpEvent, HttpHandlerFn} from '@angular/common/http';
import {Observable} from 'rxjs';


export function authIntercept(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const jwt = localStorage.getItem('jwtToken');
  if (jwt) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
  }
  return next(req);
}

