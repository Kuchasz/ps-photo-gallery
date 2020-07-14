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
import { sum } from "../../utils/array";

@Component({
    selector: "gallery-image-grid",
    templateUrl: "./gallery-image-grid.component.html",
    styleUrls: ["./gallery-image-grid.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GalleryImageGridComponent implements OnInit {
    currentDirectoryId$: Observable<string>;
    currentDirectory: Observable<GalleryDirectory>;

    images$: Observable<GalleryImage[]>;
    leftColImages: GalleryImage[];
    rightColImages: GalleryImage[];

    constructor(public gallery: GalleryService, private route: ActivatedRoute) {}

    ngOnInit() {
        const thumbPos = this.gallery.config.thumbnails.position;

        this.currentDirectoryId$ = this.route.paramMap.pipe(map((x) => x.get("id")));

        this.images$ = this.currentDirectoryId$.pipe(
            flatMap((directoryId) =>
                this.gallery.state.pipe(
                    map((s) => {
                        const ids = s.directoryImages[directoryId];
                        return s.images.filter((i) => ids.includes(i.id));
                    })
                )
            )
        );

        const sumHeights = sum((x: GalleryImage) => x.height + 20);

        this.images$.subscribe((images) => {
            const finalImages = images.reduce(
                (agg, image) =>
                    sumHeights(agg.left) < sumHeights(agg.right)
                        ? { ...agg, left: [...agg.left, image] }
                        : { ...agg, right: [...agg.right, image] },
                { left: [], right: [] }
            );

            console.log(sumHeights(finalImages.left), sumHeights(finalImages.right));

            this.leftColImages = finalImages.left;
            this.rightColImages = finalImages.right;
        });

        this.currentDirectory = this.currentDirectoryId$.pipe(
            switchMap((directoryIndex) => this.gallery.getDirectory(directoryIndex))
        );
    }
}
