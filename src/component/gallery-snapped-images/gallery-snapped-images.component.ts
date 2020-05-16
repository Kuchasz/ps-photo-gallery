import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import {GalleryService} from "../../service/gallery.service";
import {GalleryState, GalleryImage} from "../../service/gallery.state";
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

    snappedImages: GalleryImage[];

    constructor(public gallery: GalleryService) {
        this.snappedImages = this.gallery.state.getValue().directories.map(d => d.images).reduce((cur, agg) => agg.concat(cur), []).filter(img => img.snapped);
    }

    remove(i: number){
        this.snappedImages[i].snapped = false;
    }

    restore(i: number){
        this.snappedImages[i].snapped = true;
    }

    getThumbImage(i: number) {
        return `url(${this.snappedImages[i].src})`;
    }
}