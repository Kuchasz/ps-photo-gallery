import {
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { Location } from "@angular/common";
import { GalleryState, GalleryDirectory, GalleryImage } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { app } from "../../../../../photographers-panel/server/src/config";

@Component({
    selector: "rating-request-window",
    templateUrl: "./rating-request-window.component.html",
    styleUrls: ["./rating-request-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RatingRequestWindowComponent implements OnInit {
    
    reviewUrl: string = app.reviewUrl;
    
    constructor(public gallery: GalleryService, private route: ActivatedRoute, private location: Location) { }

    ngOnInit() {
    }

    close(){
        this.gallery.setDisplayRatingRequestDetails(false);
    }


}