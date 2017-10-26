import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Input,
    ElementRef,
    Renderer2
} from '@angular/core';
import {GalleryState} from '../../service/gallery.state';
import {GalleryConfig} from '../../config';
import {GalleryService} from '../../service/gallery.service';
import {animation} from './gallery-image.animation';
import * as Hammer from 'hammerjs';

@Component({
    selector: 'gallery-image',
    templateUrl: './gallery-image.component.html',
    styleUrls: ['./gallery-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: animation
})
export class GalleryImageComponent implements OnInit {

    @Input() state: GalleryState;
    @Input() config: GalleryConfig;
    loading: boolean = true;
    animate: string;

    constructor(public gallery: GalleryService, private el: ElementRef) {
    }

    ngOnInit() {
        if (this.config.gestures) {
            const el = this.el.nativeElement;
            const mc = new Hammer(el);

            mc.on('swipeleft', () => {
                this.gallery.next();
            });

            mc.on('swiperight', () => {
                this.gallery.prev();
            });
        }
    }

    get currentImage() {
        return this.state.directories[this.state.currDirectory].images[this.state.currIndex];
    }

    imageLoad(done: boolean) {
        this.loading = !done;

        // if (!done) {
        //     this.animate = 'none';
        // } else {
        //     switch (this.config.animation) {
        //         case 'fade':
        //             this.animate = 'fade';
        //             break;
        //         default:
        //             this.animate = 'none';
        //     }
        // }

    }
}
