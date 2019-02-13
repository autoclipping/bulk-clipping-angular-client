import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    /**
     * Strips away everything after last . (dot)
     * @param name string
     */
    static stripExtension(name: string): string {
        return name.substr(0, name.lastIndexOf('.'));
    }
}
