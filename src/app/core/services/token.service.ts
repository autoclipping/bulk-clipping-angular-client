import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    static get token(): string {
        return window.localStorage['token'];
    }

    static set token(token: string) {
        window.localStorage['token'] = token;
    }

    static clear(): void {
        window.localStorage.removeItem('token');
    }
}
