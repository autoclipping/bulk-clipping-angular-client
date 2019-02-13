import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService, MojoService, TokenService } from './core/services';
import { environment } from '../environments/environment';
import { BatchManager } from './core/manager/batch-manager';
import { BatchesManager } from './core/manager/batches-manager';

@Component({
    selector: 'ac-root',
    // TODO figure out how to apply global css without using component
    // tslint:disable-next-line:use-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../assets/css/style.css'],
    template: `
        <ac-upload></ac-upload>
        <section class="ac-patches-main">
            <ac-batch-list *ngIf="batchesManager.batches"></ac-batch-list>
            <div class="ac-right-cont">
                <ac-credit></ac-credit>
                <ac-help></ac-help>
            </div>
        </section>
        <ac-batch-navigation *ngIf="batchManager.batch"></ac-batch-navigation>
        <ac-upload></ac-upload>
        <div id="canvas-wrapper" class="hidden"></div>
    `
})

export class AppComponent implements OnInit {
    @Input() token: string;
    @Input() apiUrl: string;

    constructor(
        public batchManager: BatchManager,
        public batchesManager: BatchesManager,
        public mojoService: MojoService
    ) {}

    ngOnInit(): void {
        TokenService.token = this.token ? this.token : environment.token;
        ApiService.apiUrl = this.apiUrl ? this.apiUrl : environment.apiUrl;

        // query mojo and setup continuous reload
        this.mojoService.reload();
        this.mojoService.startContinuousReload();

        // initial load of batches and active batch
        this.batchesManager.load()
            .subscribe(batches => {
                if (batches.results.length) {
                    this.batchManager.reload(batches.results[0].batchId);
                }
            });
    }
}
