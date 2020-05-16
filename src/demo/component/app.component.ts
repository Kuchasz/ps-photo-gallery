import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  NgZone
} from "@angular/core";
import { GalleryService } from "../../index";
import { parseString } from "xml2js";
import { GalleryDirectory } from "../../service/gallery.state";
import {fetchGallery} from "../../utils/jalbum";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(public gallery: GalleryService) {}

  ngOnInit() {
    const root = window.location.pathname;
    fetchGallery(root).then(gallery =>  this.gallery.load(gallery));
  }
}
