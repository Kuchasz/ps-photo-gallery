import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { Location } from "@angular/common";
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
    currentDirectory$: Observable<GalleryDirectory>;

    constructor(public gallery: GalleryService, private route: ActivatedRoute, private router: Router, private location: Location) {}

    ngOnInit() {
        this.currentDirectoryId$ = this.route.paramMap.pipe(map((x) => x.get("id")));
        this.currentDirectory$ = this.currentDirectoryId$.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(
            map((x) => x.images.find(i => i.id === x.currId))
        );
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
        return this.state.images.filter(x => x.snapped).length;
    }

    public displaySnappedImages() {
        this.router.navigate(["/snapped"]);
    }

    goBack(){
        this.location.back();
    }

    orderPhotos(){
        
    }

    public snapImage() {
        this.gallery.snapImage(this.currentImageId);
    }

    get currentImageId() {
        return this.state.currId;
    }
}
