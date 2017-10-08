import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { GalleryService } from '../../service/gallery.service';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnDestroy {

  constructor(public gallery: GalleryService) {
  }

  ngOnDestroy() {
    this.gallery.reset();
  }

}
