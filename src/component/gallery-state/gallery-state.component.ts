import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { GalleryState, GalleryImage, GalleryDirectory } from "../../service/gallery.state";
import { GalleryConfig } from "../../index";
import * as screenfull from "screenfull";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap, flatMap, find, first } from "rxjs/operators";

@Component({
    selector: "gallery-state",
    templateUrl: "./gallery-state.component.html",
    styleUrls: ["./gallery-state.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryStateComponent {
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;

    currentDirectoryId$: Observable<string>;
    currentImage$: Observable<GalleryImage>;
    currentDirectory: Observable<GalleryDirectory>;
    images: Observable<GalleryImage[]>;

    constructor(public gallery: GalleryService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.currentDirectoryId$ = this.route.paramMap.pipe(map((x) => x.get("id")));
        this.currentDirectory = this.currentDirectoryId$.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(
            map((x) => x.currIndex),
            flatMap((currIndex) =>
                this.currentDirectory.pipe(
                    flatMap((x) => x.images),
                    first((_, idx) => idx === currIndex)
                )
            )
        );

        this.images = this.currentDirectory.pipe(map((d) => d.images));
    }

    toggleFullscreen() {
        if (screenfull.isEnabled) {
            if (screenfull.isFullscreen) screenfull.exit();
            else if (screenfull.isEnabled) screenfull.request();
        }
    }

    get fullscreenEnabled() {
        if (screenfull) {
            return screenfull.isEnabled;
        }
    }

    get snappedCount() {
        return this.state.snappedCount;
    }

    public displaySnappedImages() {
        this.router.navigate(["/snapped"]);
    }

    public snapImage(directoryId: string) {
        console.log("SNAP: | " + this.currentImageIndex);
        this.gallery.snapImage(this.currentImageIndex, directoryId);
    }

    get currentImageIndex() {
        return this.state.currIndex;
    }
}
