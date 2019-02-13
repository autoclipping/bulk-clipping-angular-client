import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        const token = TokenService.token;
        if (token) {
            headersConfig['Authorization'] = token;
        }
        const request = req.clone({ setHeaders: headersConfig });

        return next.handle(request);
    }
}
