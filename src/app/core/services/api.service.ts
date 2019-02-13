import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    static apiUrl: string;
    /**
     * returns path of api calls and encodes ids
     * @param path for api call
     * @param params object of params to replace where keys are strings to replace and values are values to replace them with
     */
    static getApiPath(path: string, params: {}): string {
        for (const param in params) {
            path = path.replace(param, encodeURIComponent(params[param]));
        }

        return path;
    }

    constructor(
        private http: HttpClient
    ) {}

    get(url: string, options?): Observable<any> {
        return this.http.get(`${ApiService.apiUrl}/${url}`, options);
    }

    post(url: string, body: any | null, options?): Observable<any> {
        return this.http.post(`${ApiService.apiUrl}/${url}`, body, options);
    }

    patch(url: string, body: any | null, options?): Observable<any> {
        return this.http.patch(`${ApiService.apiUrl}/${url}`, body, options);
    }

    delete(url: string, options?): Observable<any> {
        return this.http.delete(`${ApiService.apiUrl}/${url}`, options);
    }
}
