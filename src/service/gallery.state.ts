export type ScreenOrientation = 'portrait' | 'landscape';

export interface GalleryState {
  play?: boolean;
  directories: {[id: string]: GalleryDirectory};
  images: GalleryImage[];
  directoryImages: {[directoryId: string]: string[]};
  currId?: string;
  prevId?: string;
  nextId?: string;
  fullscreenEnabled: boolean;
  orientation: ScreenOrientation;
  displaySnappedImages: boolean;
}

export interface GalleryImage {
  src: string;
  id: string;
  thumbnail?: string;
  text?: string;
  snapped: boolean;
  width: number;
  height: number;
}

export interface GalleryDirectory {
  id: string;
  visited: boolean;
  name: string;
  rootDir: string;
}