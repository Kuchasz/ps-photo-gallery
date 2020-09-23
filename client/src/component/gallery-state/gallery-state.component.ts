import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { Location } from "@angular/common";
import { GalleryState, GalleryImage, GalleryDirectory } from "../../service/gallery.state";
import { GalleryConfig } from "../../index";
import * as screenfull from "screenfull";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap, flatMap, find, first } from "rxjs/operators";
import { ApiService } from '../../service/api.service';

@Component({
    selector: "gallery-state",
    templateUrl: "./gallery-state.component.html",
    styleUrls: ["./gallery-state.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryStateComponent {
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>(false);

    currentDirectoryId$: Observable<string>;
    currentImage$: Observable<GalleryImage>;
    currentDirectory$: Observable<GalleryDirectory>;

    currentDirectoryId: string;

    constructor(
        public gallery: GalleryService,
        public api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit() {
        this.currentDirectoryId$ = this.route.parent.paramMap.pipe(map((x) => x.get("id")));
        this.currentDirectory$ = this.currentDirectoryId$.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(map((x) => x.images.find((i) => i.id === x.currId)));

        this.currentDirectoryId$.subscribe((currentDirectoryId) => (this.currentDirectoryId = currentDirectoryId));
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
        return this.state.images.filter((x) => x.snapped).length;
    }

    public displaySnappedImages() {
        this.router.navigate(["/snapped"]);
    }

    goBack() {
        // this.onBack.emit();
        this.location.back();
    }

    orderPhotos() {}

    // public snapImage() {
    //     this.gallery.snapImage(this.currentImageId);
    // }

    public likeImage(imageId: string, $event: MouseEvent) {
        const img = this.state.images.find((x) => x.id === imageId);

        if (img.liked === true) return;

        img.likes++;
        img.liked = true;

        this.api.sdk.likeImage({imageId, galleryId: this.api.galleryId, clientId: this.api.clientId});
        $event.stopPropagation();
    }

    get currentImageId() {
        return this.state.currId;
    }
}
