import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { GalleryState } from "../../service/gallery.state";
import { GalleryConfig } from "../../index";

@Component({
    selector: 'gallery-state',
    templateUrl: './gallery-state.component.html',
    styleUrls: ['./gallery-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryStateComponent{
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;

    constructor(public gallery: GalleryService){
        
    }

    get images(){
        return this.currentDirectory.images;
    }

    get currentImage(){
        return this.images[this.state.currIndex];
    }

    get currentDirectory(){
        return this.state.directories[this.state.currDirectory];
    }
}