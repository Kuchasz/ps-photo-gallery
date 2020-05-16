import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { GalleryState } from "../../service/gallery.state";
import { GalleryConfig } from "../../config";
import { DisplayModes } from "../../config/gallery.config";

@Component({
  selector: "gallery-main",
  templateUrl: "./gallery-main.component.html",
  styleUrls: ["./gallery-main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GalleryMainComponent implements OnInit {
  @Input() state: GalleryState;
  @Input() config: GalleryConfig;
  loading: any;
  thumbDirection: string;

  ngOnInit() {
    const thumbPos = this.config.thumbnails.position;
    this.thumbDirection =
      thumbPos === "left" || thumbPos === "right" ? "row" : "column";
  }

  get fullscreen() {
    return (
      this.config.displayMode !== DisplayModes.Compact ||
      this.state.orientation === "portrait"
    );
  }

  getCurrentPhoto() {
    return this.state.directories[this.state.currDirectory].images[
      this.state.currIndex
    ];
  }
}
