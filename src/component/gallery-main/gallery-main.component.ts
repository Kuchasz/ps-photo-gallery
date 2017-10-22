import {
    ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,
    ViewEncapsulation
} from '@angular/core';
import {GalleryState} from '../../service/gallery.state';
import {GalleryConfig} from '../../config';
import {DisplayModes} from "../../config/gallery.config";

@Component({
    selector: 'gallery-main',
    templateUrl: './gallery-main.component.html',
    styleUrls: ['./gallery-main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GalleryMainComponent implements OnInit {

    @Input() state: GalleryState;
    @Input() config: GalleryConfig;
    loading: any;
    thumbDirection: string;

    orientation: 'portrait' | 'landscape' = undefined;

    constructor(private app: ChangeDetectorRef) {
    }

    ngOnInit() {
        const thumbPos = this.config.thumbnails.position;
        this.thumbDirection = (thumbPos === 'left' || thumbPos === 'right') ? 'row' : 'column';

        const screenPortraitQuery = window.matchMedia("(orientation: portrait)");
        this.orientation = screenPortraitQuery.matches ? 'portrait' : 'landscape';

        screenPortraitQuery.addListener(e => {
            this.orientation = e.matches ? 'portrait' : 'landscape';
            this.app.detectChanges();
        });
    }

    get fullscreen(){
        return this.config.displayMode === DisplayModes.Compact && this.orientation === 'landscape';
    }

    getCurrentPhoto() {
        return this.state.directories[this.state.currDirectory].images[this.state.currIndex];
    }

}
