import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import {GalleryService} from "../../service/gallery.service";
import {GalleryState} from "../../service/gallery.state";
import { GalleryConfig } from "../../config/gallery.config";

@Component({
    selector: 'gallery-snapped-images',
    templateUrl: './gallery-snapped-images.component.html',
    styleUrls: ['./gallery-snapped-images.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GallerySnappedImagesComponent {

    @Input() state: GalleryState;
    @Input() config: GalleryConfig;

    constructor(public gallery: GalleryService) {

    }

    get snappedImages(){
        return this.state.directories.map(d => d.images).reduce((cur, agg) => agg.concat(cur), []).filter(img => img.snapped);
    }

    getThumbImage(i: number) {
        return `url(${this.snappedImages[i].thumbnail || this.snappedImages[i].src})`;
    }
}