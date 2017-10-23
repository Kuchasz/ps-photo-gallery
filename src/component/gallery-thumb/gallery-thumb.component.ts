import {
    Component,
    Input,
    ChangeDetectionStrategy,
    ElementRef,
    Renderer2,
    OnInit
} from "@angular/core";
import {GalleryService} from "../../service/gallery.service";
import {GalleryState} from "../../service/gallery.state";
import {GalleryThumbConfig} from "../../config";
import * as Hammer from "hammerjs";
import {TweenLite} from "gsap";

@Component({
    selector: "gallery-thumb",
    templateUrl: "./gallery-thumb.component.html",
    styleUrls: ["./gallery-thumb.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryThumbComponent implements OnInit {
    @Input() state: GalleryState;
    @Input() config: GalleryThumbConfig;

    elContainer: any;
    thumbsDelta: number = 0;

    constructor(public gallery: GalleryService,
                private el: ElementRef,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        window.addEventListener("keydown", e => {
            if (e.keyCode === 37) this.gallery.prev();
            if (e.keyCode === 39) this.gallery.next();
        });

        if (this.gallery.config.gestures) {
            this.elContainer = this.el.nativeElement.querySelector(
                ".g-thumb-container"
            );

            const hammer = new Hammer(this.elContainer);

            TweenLite.set(this.elContainer, {x: -this.config.width / 2});

            hammer.on("panend", e => {
                if (Math.abs(e.velocityX) < 0.5) {
                    this.thumbsDelta += e.deltaX;
                    return;
                }

                const targetDelta = e.deltaX * Math.abs(e.velocityX);

                this.thumbsDelta += targetDelta;

                this.thumbsDelta = this._valBetween(
                    this.thumbsDelta,
                    this.getMaxDelta(),// + this.config.width / 2,
                    -this.config.width / 2
                );

                TweenLite.to(this.elContainer, 1, {x: this.thumbsDelta});
            });

            hammer.on("pan", e => {
                let targetDelta = this.thumbsDelta + e.deltaX;

                targetDelta =
                    targetDelta > -this.config.width / 2
                        ? -this.config.width / 2
                        : targetDelta < this.getMaxDelta()
                        ? this.getMaxDelta()
                        : targetDelta;

                TweenLite.to(this.elContainer, 0.25, {x: targetDelta});
            });

            hammer.on('panstart', () => console.log('pan-start'));

        }

        this.gallery.state.subscribe(
            x => x.currIndex !== undefined && this._scrollImages(x.currIndex)
        );

    }

    private _valBetween(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    selectImage(index: number) {
        this.gallery.selectImage(index);
    }

    _scrollImages(index) {
        const x =
            index /
            this.getImages().length *
            (this.getMaxDelta() - this.config.width / 2) -
            this.config.width / 2;
        this.thumbsDelta = x;
        TweenLite.to(this.elContainer, 1, {x: this.thumbsDelta});
    }

    getMaxDelta() {
        return -(
            this.getImages().length * this.config.width -
            this.config.width / 2
        );
    }

    getImages() {
        return this.state.directories[this.state.currDirectory].images;
    }

    getThumbImage(i: number) {
        return `url(${this.getImages()[i].thumbnail || this.getImages()[i].src})`;
    }
}
