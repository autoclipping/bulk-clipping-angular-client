import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DotService {
    /**
     * Max amount of dots to display
     */
    private max = 3;

    /**
     * Interval in ms to animate the dots
     */
    private interval = 1000;

    /**
     * String representation of dots, use this variable to show dots
     */
    private _dots = '';

    constructor() {
        this.initAnimation();
    }

    get dots(): string {
        return this._dots;
    }

    /**
     * Starts the dot animation
     */
    private initAnimation(): void {
        let count = 0;
        setInterval(() => {
            count = (count + 1) % (this.max + 1);
            this._dots = '.'.repeat(count);
        }, this.interval);
    }
}
