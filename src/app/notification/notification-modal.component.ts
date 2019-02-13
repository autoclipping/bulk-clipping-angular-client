import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ac-notification-modal',
    template: `
        <div class="ac-error-modal">
            <div class="ac-error-modal-inner">
                <div class="ac-error-modal-main">
                    <a class="ac-error-modal-main-close" (click)="cancel.emit()" ><span>Close</span></a>
                    <p class="ac-error-modal-main-title">Notification</p>
                    <div class="ac-error-modal-main-message">{{ message }}</div>
                    <button (click)="cancel.emit()" >Cancel</button><button (click)="confirm.emit()" >Confirm</button>
                </div>
            </div>
        </div>

    `
})
export class NotificationModalComponent {
    @Input() message: string;
    @Output() readonly confirm = new EventEmitter();
    @Output() readonly cancel = new EventEmitter();
}
