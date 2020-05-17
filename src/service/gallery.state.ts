export type ScreenOrientation = 'portrait' | 'landscape';

export interface GalleryState {
  play?: boolean;
  directories: {[id: string]: GalleryDirectory};
  currIndex?: number;
  prevIndex?: number;
  nextIndex?: number;
  fullscreenEnabled: boolean;
  orientation: ScreenOrientation;
  snappedCount: number;
  displaySnappedImages: boolean;
}

export interface GalleryImage {
  src: string;
  thumbnail?: string;
  text?: string;
  snapped: boolean;
}

export interface GalleryDirectory {
  id: string;
  visited: boolean;
  name: string;
  rootDir: string;
  images?: GalleryImage[];
}