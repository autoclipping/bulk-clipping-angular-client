import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { CoreModule } from './core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BatchListComponent } from './batch/batch-list.component';
import { BatchComponent } from './batch/batch.component';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from './shared/shared.module';
import { BatchNavigationComponent } from './batch/batch-navigation.component';
import { BatchDownloadComponent } from './batch/batch-download.component';
import { ImagePreviewComponent } from './Image/image-preview.compononet';
import { NotificationModalComponent } from './notification/notification-modal.component';
import { OkNotificationModalComponent } from './notification/ok-notification-modal.component';
import { CreditComponent } from './credit/credit.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HelpComponent } from './batch/help.component';
import { HelpVideoComponent } from './batch/help-video.component';

@NgModule({
    imports: [
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgxPaginationModule,
        SharedModule
    ],
    declarations: [
        AppComponent,
        BatchListComponent,
        BatchComponent,
        BatchNavigationComponent,
        UploadComponent,
        BatchDownloadComponent,
        ImagePreviewComponent,
        NotificationModalComponent,
        OkNotificationModalComponent,
        CreditComponent,
        SpinnerComponent,
        HelpComponent,
        HelpVideoComponent
    ],
    entryComponents: [AppComponent],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class AppModule {
    constructor(private injector: Injector) {
        const app = createCustomElement(AppComponent, {injector});
        customElements.define('ac-root', app);
    }

    ngDoBootstrap(): void {
        // overwritten because we use angular elements to bootstrap
    }
}
