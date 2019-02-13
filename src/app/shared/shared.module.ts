import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe.pipe';
import { ProgressComponent } from './components/progress.component';

@NgModule({
    declarations: [
        SafePipe,
        ProgressComponent
    ],
    exports: [
        SafePipe,
        ProgressComponent
    ],
    imports: [
        CommonModule
    ]
})

export class SharedModule {
}
