import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, Renderer2 } from "@angular/core";
import { GalleryState, GalleryImage, GalleryDirectory } from "../../service/gallery.state";
import { GalleryConfig } from "../../config";
import { GalleryService } from "../../service/gallery.service";
import { animation } from "./gallery-image.animation";
import * as Hammer from "hammerjs";
import { ActivatedRoute } from "@angular/router";
import { Observable, fromEvent } from "rxjs";
import { switchMap, flatMap, tap, map, first } from "rxjs/operators";

@Component({
    selector: "gallery-image",
    templateUrl: "./gallery-image.component.html",
    styleUrls: ["./gallery-image.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: animation
})
export class GalleryImageComponent implements OnInit {
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;
    loading: boolean = true;
    animate: string;

    currentDirectoryId: Observable<string>;
    currentImage$: Observable<GalleryImage>;
    currentDirectory: Observable<GalleryDirectory>;

    constructor(public gallery: GalleryService, private el: ElementRef, private route: ActivatedRoute) {}

    ngOnInit() {
        this.currentDirectoryId = this.route.paramMap.pipe(map((x) => x.get("id")));

        this.currentDirectory = this.currentDirectoryId.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(
            map((x) => x.currId),
            flatMap((currId) =>
                this.gallery.state.pipe(
                    flatMap((x) => x.images),
                    first((img) => img.id === currId)
                )
            )
        );

        // if (this.config.gestures) {
            const el = this.el.nativeElement;
            const elToMove = this.el.nativeElement.querySelector(".g-image-container");

            // console.log(el);

            const mc = new Hammer(el);

            // el.
            // console.log(el);

            fromEvent(mc, "panmove").subscribe((e: any) => {
                console.log(e.deltaX);
                elToMove.style.transform = `translate(${e.deltaX}px, 0px)`;
            });

            // fromEvent(mc, "swiperight")
            //     .pipe(flatMap((e: any) => this.currentDirectoryId.pipe(map((id) => ({ id, e })))))
            //     .subscribe((g) => {
            //         elToMove.style.transform = `translate(100%, 0px)`;
            //         // this.gallery.prev(g.id);
            //     });

            // fromEvent(mc, "swipeleft")
            //     .pipe(flatMap((e: any) => this.currentDirectoryId.pipe(map((id) => ({ id, e })))))
            //     .subscribe((g) => {
            //         elToMove.style.transform = `translate(-100%, 0px)`;
            //         // this.gallery.next(g.id);
            //     });
        // }
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
