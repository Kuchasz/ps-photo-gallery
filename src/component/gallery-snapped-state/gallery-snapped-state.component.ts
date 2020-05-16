import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { GalleryState } from "../../service/gallery.state";
import { GalleryConfig } from "../../index";
import * as screenfull from "screenfull";

@Component({
    selector: "gallery-snapped-state",
    templateUrl: "./gallery-snapped-state.component.html",
    styleUrls: ["./gallery-snapped-state.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GallerySnappedStateComponent {
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;

    constructor(public gallery: GalleryService) {}

    toggleFullscreen() {
        if (screenfull) {
            if (screenfull.isFullscreen) screenfull.exit();
            else if (screenfull.enabled) screenfull.request();
        }
    }

    goBack(){
        this.gallery.goBackToGallery();
    }

    get fullscreenEnabled() {
        if (screenfull) {
            return screenfull.enabled;
        }
    }

    get snappedCount() {
        return this.state.snappedCount;
    }
}
