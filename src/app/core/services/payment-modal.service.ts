import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PaymentModalService {
    private isModalOpen: boolean;

    constructor() {
        // define noop function to avoid errors
        if (typeof (window as any).show_bulk_payment_modal !== 'function') {
            // tslint:disable-next-line:no-empty
            window['show_bulk_payment_modal'] = (param?) => {};
        }
    }

    /**
     * Opens payment modal to add mojo
     * @param remaining is optional number of images there isn't enough mojo to process
     */
    open(remaining?: number): void {
        // TODO: Make Modal closing dependant on the closing event of the modal
        this.isModalOpen = false;
        if (!this.isModalOpen) {
            const win = window as any;
            // set modalOpen true to prevent multiple modals
            this.isModalOpen = true;
            if (remaining) {
                win.show_bulk_payment_modal({remaining});
            } else {
                win.show_bulk_payment_modal();
            }
        }
    }
}
