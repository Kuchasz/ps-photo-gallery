import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { GalleryState } from "../../service/gallery.state";
import { GalleryConfig } from "../../config/gallery.config";
import { GalleryService } from "../../service/gallery.service";
import { Router } from "@angular/router";

@Component({
    selector: "gallery-directories",
    templateUrl: "./gallery-directores.component.html",
    styleUrls: ["./gallery-directories.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryDirectoriesComponent {
    @Input() config: GalleryConfig;
    objectKeys = Object.keys;

    constructor(public gallery: GalleryService, private router: Router) {}

    getImage(directoryId: string) {
        const possibleImages = this.gallery.state.getValue().directories[directoryId].images;
        return possibleImages[0];
    }

    selectDirectory(directoryId: string) {
        console.log(directoryId);
        this.gallery.selectDirectory(directoryId);
        this.router.navigate([`/directory/${directoryId}`]);
    }
}
