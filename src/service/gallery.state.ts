export interface GalleryState {
  play?: boolean;
  directories: GalleryDirectory[];
  currDirectory: number;
  prevIndex?: number;
  currIndex?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  fullscreenEnabled: boolean;
}

export interface GalleryImage {
  src: string;
  thumbnail?: string;
  text?: string;
}

export interface GalleryDirectory {
  visited: boolean;
  name: string;
  rootDir: string;
  images?: GalleryImage[];
}