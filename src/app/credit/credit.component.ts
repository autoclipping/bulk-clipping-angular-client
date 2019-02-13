import { Component } from '@angular/core';
import { MojoService, PaymentModalService } from '../core/services';

@Component({
    selector: 'ac-credit',
    template: `
        <div class="ac-patches-credits">
            <p class="ac-patches-credits-title">Processing credits: <span>{{ mojoService.mojo }}</span></p>
            <a (click)="openModal()" class="ac-patches-credits-btn"><span>Buy more credits</span></a>
        </div>
    `
})
export class CreditComponent {

    constructor(
        public mojoService: MojoService,
        private paymentModalService: PaymentModalService
    ) {}

    openModal(): void {
         this.paymentModalService.open();
    }
}
