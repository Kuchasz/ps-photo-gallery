import { ChangeDetectionStrategy, Component, OnInit, NgZone } from "@angular/core";
import { GalleryService } from "../../index";
import { Router, NavigationStart } from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    constructor(public gallery: GalleryService, private router: Router) {
        router.events.subscribe((e) => {
            if (e instanceof NavigationStart) {
                if (/\/directory\/\w+/.test(e.url)) {
                    this.gallery.selectDirectory(e.url.split("/")[2]);
                }
            }
        });
    }

    ngOnInit() {
        // const root = "/";
        // fetchGallery(root).then((gallery) => this.gallery.load(gallery));
    }
}
