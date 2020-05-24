import {
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation
} from "@angular/core";
import { GalleryState, GalleryDirectory, GalleryImage } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { GalleryConfig } from "../../config";
import { DisplayModes } from "../../config/gallery.config";
import { Observable } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap, find, flatMap, map, tap, first, filter } from "rxjs/operators";

@Component({
    selector: "gallery-main",
    templateUrl: "./gallery-main.component.html",
    styleUrls: ["./gallery-main.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GalleryMainComponent implements OnInit {
    loading: any;
    thumbDirection: string;

    currentDirectoryId$: Observable<string>;
    currentDirectory: Observable<GalleryDirectory>;

    images$: Observable<GalleryImage[]>;

    constructor(public gallery: GalleryService, private route: ActivatedRoute) {}

    ngOnInit() {
        const thumbPos = this.gallery.config.thumbnails.position;
        this.thumbDirection = thumbPos === "left" || thumbPos === "right" ? "row" : "column";

        this.currentDirectoryId$ = this.route.paramMap.pipe(
            map((x) => x.get("id"))
        );

        this.images$ = this.currentDirectoryId$.pipe(
            flatMap((directoryId) => this.gallery.state.pipe(
                map(s => {
                    const ids = s.directoryImages[directoryId];
                    return s.images.filter((i) => ids.includes(i.id));
                })
            ))
        );

        this.currentDirectory = this.currentDirectoryId$.pipe(
            switchMap((directoryIndex) => this.gallery.getDirectory(directoryIndex))
        );
    }

    get fullscreen() {
        return (
            this.gallery.config.displayMode !== DisplayModes.Compact ||
            this.gallery.state.getValue().orientation === "portrait"
        );
    }
}
