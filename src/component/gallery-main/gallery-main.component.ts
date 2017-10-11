import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {GalleryState} from '../../service/gallery.state';
import {GalleryConfig} from '../../config';

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

    constructor(){
    }

  ngOnInit() {
    const thumbPos = this.config.thumbnails.position;
    this.thumbDirection = (thumbPos === 'left' || thumbPos === 'right') ? 'row' : 'column';
  }

  getCurrentPhoto(){
    return this.state.directories[this.state.currDirectory].images[this.state.currIndex];
  }

}
