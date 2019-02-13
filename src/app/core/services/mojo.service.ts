import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MojoService {
    mojo: number;
    path = '/mojo-and-credits';

    private interval;
    private timeout;
    private updateInterval = environment.mojoUpdateInterval * 1000;
    private updateDuration = environment.updateDuration * 1000;

    constructor(
        private apiService: ApiService
    ) {}

    /**
     * Queries and updates user mojo value
     */
    reload(): void {
        this.apiService.get(this.path)
            .subscribe(mojo => this.mojo = mojo.processingMojo);
    }

    /**
     * Start continuous update of mojo
     */
    startContinuousReload(): void {
        // stop any previous updates and start a new one
        this.stopContinuousReload();
        this.interval = setInterval(() => {
            this.reload();
        }, this.updateInterval);
        this.timeout = setTimeout(() => this.stopContinuousReload(), this.updateDuration);
    }

    /**
     * Stop continuous update of mojo
     */
    stopContinuousReload(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
}
