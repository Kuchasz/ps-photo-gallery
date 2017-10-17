import {
  Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2, OnInit
} from '@angular/core';
import { GalleryService } from '../../service/gallery.service';
import { GalleryState } from '../../service/gallery.state';
import { GalleryThumbConfig } from '../../config';
import * as Hammer from "hammerjs";

@Component({
  selector: 'gallery-thumb',
  templateUrl: './gallery-thumb.component.html',
  styleUrls: ['./gallery-thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryThumbComponent implements OnInit {

  @Input() state: GalleryState;
  @Input() config: GalleryThumbConfig;

  contStyle: any;
  thumbsDelta: number = 0;

  constructor(
    public gallery: GalleryService, 
    private el: ElementRef, 
    private renderer: Renderer2) {

  }

  ngOnInit() {

    this.contStyle = this.getContainerStyle();

    /** Enable gestures */
    if (this.gallery.config.gestures) {
        const el = this.el.nativeElement.querySelector('.g-thumb-container');
        const mc = new Hammer(el);

        mc.on('panstart', () => {
          // this.renderer.removeClass(el, 'g-pan-reset');
        });
        mc.on('panend', (e) => {
          this.thumbsDelta += e.deltaX;
          // this.renderer.addClass(el, 'g-pan-reset');
        });

        /** Pan left and right */
        mc.on('pan', (e) => {
          let targetDelta = this.thumbsDelta + e.deltaX;

          targetDelta = targetDelta > (-this.config.width / 2) 
          ? (-this.config.width / 2)
          : targetDelta < this.getMaxDelta() 
            ? this.getMaxDelta() 
            : targetDelta;

          this.renderer.setStyle(el, 'transform', `translate3d(${targetDelta}px, 0px, 0px)`);
        });
        /** Swipe next and prev */
        // mc.on('swipeleft', () => {
        //   this.gallery.next();
        // });
        // mc.on('swiperight', () => {
        //   this.gallery.prev();
        // });
      }
  }

  translateThumbs() {
    const x = this.state.currIndex * this.config.width + this.config.width / 2;
    this.thumbsDelta = -x;
    return `translate3d(${-x}px, 0, 0)`;
  }

  getMaxDelta(){
    return -(this.getImages().length * this.config.width - this.config.width/2);
  }

  getContainerStyle() {
    /** Set thumbnails position (top, bottom) */
    const order = this.config.position === 'top' ? 0 : 2;
    this.renderer.setStyle(this.el.nativeElement, 'order', order);

    return {
      // height: this.config.height + 'px'
    };
  }

  getImages(){
      return this.state.directories[this.state.currDirectory].images;
  }

  getThumbImage(i: number) {
    return `url(${this.getImages()[i].thumbnail || this.getImages()[i].src})`;
  }

}
