import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import {Location} from "@angular/common";
import { GalleryService } from "../../service/gallery.service";
import { GalleryState } from "../../service/gallery.state";
import { GalleryConfig } from "../../index";
import * as screenfull from "screenfull";
import { Router } from "@angular/router";

@Component({
    selector: "gallery-snapped-state",
    templateUrl: "./gallery-snapped-state.component.html",
    styleUrls: ["./gallery-snapped-state.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GallerySnappedStateComponent {
    @Input() config: GalleryConfig;

    constructor(public gallery: GalleryService, private router: Router, private location: Location) {}

    toggleFullscreen() {
        if (screenfull.isEnabled) {
            if (screenfull.isFullscreen) screenfull.exit();
            else if (screenfull.isEnabled) screenfull.request();
        }
    }

    goBack(){
        this.location.back();
    }

    get fullscreenEnabled() {
        if (screenfull) {
            return screenfull.isEnabled;
        }
    }

    get snappedCount() {
        return this.gallery.state.getValue().snappedCount;
    }
}
