import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HelpVideoComponent } from './help-video.component';

@Component({
  selector: 'ac-help',
  template: `
  <div class="ac-help">
    <a (click)="showVideo=true" class="ac-help-btn"><span>How to use this?</span></a>
  </div>
  <ac-help-video *ngIf="showVideo" (hide)="showVideo=false"></ac-help-video>  
  `,
  styles: []
})
export class HelpComponent implements OnInit, AfterViewInit {
  showVideo: boolean = false
  @ViewChild(HelpVideoComponent) helpVideo: HelpVideoComponent;
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if(!window.localStorage.getItem("ac-bulk-tut-first-shown")) {
      this.showVideo = true
      setTimeout(() => {
        window.localStorage.setItem("ac-bulk-tut-first-shown", "true")
        this.helpVideo.play()
      }, 500);
    }
  }

}
