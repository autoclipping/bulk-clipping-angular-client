import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ac-help-video',
  template: `
  <div class="ac-tutorial-video-modal-overlay" (click)="onClose($event)">
    <div class="ac-tutorial-video">
      <div class="ac-tutorial-video-title">
          <div class="ac-tutorial-video-title-text">HOW TO USE BULK CLIPPING?</div>
          <div (click)="onClose($event)" class="ac-video-main-close">
            
          </div>
      </div>
      <div class="ac-tutorial-video-container">
        <video #videoTut height="100%" width="100%" autoplay="" loop="" class="video" muted="">
          <source src="https://d1i9ug59x7qvxh.cloudfront.net/ac-tut-v2.mp4" type="video/mp4">
        </video>
        <div class="ac-tutorial-video-click-container" *ngIf="clickHereToPlayVideo">
          CLICK HERE PLAY VIDEO TUTORIAL
        </div>
      </div>

    </div>
  </div>
  `,
  styles: [`
    .ac-tutorial-video-click-container {
      color: #fff;
      display: block;
      position:absolute;
      top:1vw;
      z-index:1002;
      text-align: center;
      width: 100%;
      font-size: 3em;
    }
  `]
})
export class HelpVideoComponent implements OnInit {
  @Output() hide: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('videoTut') video: ElementRef
  
  clickHereToPlayVideo: boolean = false

  constructor() { }

  onClose(event: any) {
    this.clickHereToPlayVideo = false
    console.log((event.target));
    if(event.target.className == "ac-video-main-close" || event.target.className == "ac-tutorial-video" || event.target.className == "ac-tutorial-video-modal-overlay") {
      this.hide.emit(true);
    }
  }

  public play() {
    this.video.nativeElement.play()
    .then(() => {
      
    }).catch((e) => {
      if('name' in e && e.name == 'NotAllowedError') {
        this.clickHereToPlayVideo = true
      }
      setTimeout(() => {
        this.play()
      },1000)
    });
  }

  ngOnInit() {
  }

}
