import { GalleryState } from '../service/gallery.state';
import { GalleryConfig } from './gallery.config';

export const defaultState: GalleryState = {
  directories: [],
  currDirectory: undefined,
  prevIndex: undefined,
  currIndex: undefined,
  hasNext: undefined,
  hasPrev: undefined
};

export const defaultConfig: GalleryConfig = {
  style: {
    background: '#121519',
    width: '900px',
    height: '500px'
  },
  animation: 'fade',
  loader: {
    width: '50px',
    height: '50px',
    position: 'center',
    icon: 'oval'
  },
  description: {
    position: 'bottom',
    overlay: false,
    text: true,
    counter: true,
    style: {
      color: 'red'
    }
  },
  player: {
    autoplay: false,
    speed: 3000
  },
  thumbnails: {
    width: 120,
    height: 90,
    position: 'left',
    space: 30
  }
};



