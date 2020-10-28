import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {};

    request = request.clone({
      headers: request.headers.set('PRIVATE-TOKEN', config.privateToken)
    });

    if (!request.headers.keys().length || !request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    return next.handle(request).pipe(
      catchError(err => {
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
