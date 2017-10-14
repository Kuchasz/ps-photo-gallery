import {
    Directive,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    Renderer2
} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

// import 'rxjs/add/operator/delay';

@Directive({
    selector: '[lazyImage]'
})
export class LazyDirective {

    // Image source
    @Input('lazyImage')
    set lazyImage(imagePath: string) {
        this.getImage(imagePath);
    }

    /** A subject to emit only last selected image */
    lazyWorker = new Subject<string>();

    @Output() lazyLoad = new EventEmitter<boolean>(false);

    constructor(private el: ElementRef, private renderer: Renderer2) {

        // this.lazyTest.switchMap((done) => (done) ? Observable.of(done).delay(1000) : Observable.of(done)
        this.lazyWorker.switchMap((done) => Observable.of(done))
            .subscribe((img) => {
                if (img) {
                    this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${img})`);
                    this.lazyLoad.emit(true)
                } else {
                    this.lazyLoad.emit(false);
                }
            });
    }

    getImage(imagePath: string): void {
        this.lazyWorker.next(undefined);
        const img = this.renderer.createElement('img');
        img.src = imagePath;

        img.onload = () => {
            this.lazyWorker.next(imagePath);
        };

        img.onerror = (err: Error) => {
            console.error('[GalleryLazyDirective]:', err);
            this.lazyWorker.next(undefined);
        };
    }

}

