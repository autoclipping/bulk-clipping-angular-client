import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ac-ok-notification-modal',
    template: `
        <div class="ac-{{ type }}-modal">
            <div class="ac-{{ type }}-modal-inner">
                <div class="ac-{{ type }}-modal-main">
                    <a class="ac-{{ type }}-modal-main-close" (click)="confirm.emit()" ><span>Close</span></a>
                    <p class="ac-{{ type }}-modal-main-title">Notification</p>
                    <div class="ac-{{ type }}-modal-main-message">{{ message }}</div>
                    <button (click)="confirm.emit()" >OK</button>
                </div>
            </div>
        </div>

    `
})
export class OkNotificationModalComponent {
    @Input() message: string;
    @Input() type: string;
    @Output() readonly confirm = new EventEmitter();
}
