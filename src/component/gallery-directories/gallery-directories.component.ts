import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {GalleryState} from "../../service/gallery.state";
import {GalleryConfig} from "../../config/gallery.config";
import {GalleryService} from "../../service/gallery.service";

@Component({
    selector: 'gallery-directories',
    templateUrl: './gallery-directores.component.html',
    styleUrls: ['./gallery-directories.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryDirectoriesComponent{

    @Input() state: GalleryState;
    @Input() config: GalleryConfig;

    constructor(public gallery: GalleryService){

    }

    getRandomPhoto(directoryIndex: number){

        console.log(directoryIndex);

        const possibleImages = this.state.directories[directoryIndex].images;
        return possibleImages[Math.floor(Math.random()*possibleImages.length)];
    }

}