import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, Renderer2 } from "@angular/core";
import { GalleryState, GalleryImage, GalleryDirectory } from "../../service/gallery.state";
import { GalleryConfig } from "../../config";
import { GalleryService } from "../../service/gallery.service";
import { animation } from "./gallery-image.animation";
import * as Hammer from "hammerjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable, fromEvent, from } from "rxjs";
import {
    switchMap,
    flatMap,
    find,
    tap,
    map,
    mergeMap,
    mergeAll,
    zipAll,
    switchAll,
    merge,
    concatMap,
    last,
    publishLast,
    takeLast,
    filter,
    single,
    take,
    first
} from "rxjs/operators";

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
        this.currentDirectoryId = this.route.paramMap.pipe(
            map((x) => x.get("id"))
        );

        this.currentDirectory = this.currentDirectoryId.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state
            .pipe(
                map((x) => x.currIndex),
                flatMap((currIndex) =>
                    this.currentDirectory.pipe(
                        flatMap((x) => x.images),
                        first((_, idx) => idx === currIndex)
                    )
                )
            );

        if (this.config.gestures) {
            const el = this.el.nativeElement;
            const mc = new Hammer(el);

            fromEvent(mc, "swipeLeft").pipe(
                flatMap(() => this.currentDirectoryId),
                tap((g) => this.gallery.next(g))
            );

            fromEvent(mc, "swiperight").pipe(
                flatMap(() => this.currentDirectoryId),
                tap((g) => this.gallery.next(g))
            );
        }
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
