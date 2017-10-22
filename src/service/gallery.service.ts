import { Injectable, Optional } from "@angular/core";

import {
  GalleryState,
  GalleryImage,
  GalleryDirectory,
  ScreenOrientation
} from "./gallery.state";
import { GalleryConfig } from "../config/gallery.config";
import { defaultState, defaultConfig } from "../config/gallery.default";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import "rxjs/add/observable/of";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/take";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/do";

@Injectable()
export class GalleryService {
  state: BehaviorSubject<GalleryState>;

  config: GalleryConfig = defaultConfig;

  player: Subject<number>;

  constructor(@Optional() config: GalleryConfig) {
    this.state = new BehaviorSubject<GalleryState>(defaultState);

    this.config = { ...defaultConfig, ...config };

    this.player = new Subject();
    this.player
      .switchMap(
        interval =>
          interval ? this.playerEngine(interval) : Observable.of(null)
      )
      .subscribe();
  }

  load(directories: GalleryDirectory[]) {
    const state = this.state.getValue();

    this.state.next({
      ...state,
      directories,
      currDirectory: undefined,
      currIndex: undefined,
      hasNext: undefined,
      hasPrev: undefined
    });
  }

  setOrientation(orientation: ScreenOrientation) {
    const state = this.state.getValue();
    this.state.next({ ...state, orientation });
  }

  toggleOrientation() {
    const state = this.state.getValue();

    const orientation =
      state.orientation === "landscape" ? "portrait" : "landscape";

    this.state.next({ ...state, orientation });
  }

  selectDirectory(directoryIndex: number) {
    const state = this.state.getValue();

    const visitedDirectory = state.directories[directoryIndex];
    const directories = Object.assign([], state.directories, {
      [directoryIndex]: {
        ...visitedDirectory,
        visited: true
      }
    });

    this.state.next({
      ...state,
      directories,
      currDirectory: directoryIndex
    });

    if (directoryIndex !== undefined) this.selectImage(0);
    else this.clearCurrentImage();
  }

  toggleFullscreen() {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      fullscreenEnabled: !state.fullscreenEnabled
    });
  }

  clearCurrentImage() {
    const state = this.state.getValue();

    this.state.next({
      ...state,
      ...{
        prevIndex: undefined,
        currIndex: undefined,
        hasNext: undefined,
        hasPrev: undefined
      }
    });
  }

  selectImage(index: number) {
    const state = this.state.getValue();

    this.state.next({
      ...state,
      ...{
        prevIndex: state.currIndex,
        currIndex: index,
        hasNext:
          index < state.directories[state.currDirectory].images.length - 1,
        hasPrev: index > 0
      }
    });
  }

  next() {
    const state = this.state.getValue();

    if (state.hasNext) {
      const index = state.currIndex + 1;
      this.selectImage(index);
    } else {
      this.selectImage(0);
    }
  }

  prev() {
    const state = this.state.getValue();

    if (state.hasPrev) {
      const index = state.currIndex - 1;
      this.selectImage(index);
    } else {
      this.selectImage(
        state.directories[state.currDirectory].images.length - 1
      );
    }
  }

  reset() {
    this.state.next(defaultState);
    this.stop();
  }

  play(interval?: number) {
    const speed = interval || this.config.player.speed || 2000;

    const state = this.state.getValue();
    this.state.next({ ...state, play: true });
    this.player.next(speed);
  }

  stop() {
    this.player.next(0);
  }

  playerEngine(interval?: number) {
    return Observable.interval(interval)
      .takeWhile(() => this.state.getValue().play)
      .do(() => {
        this.next();
      })
      .finally(() => {
        this.state.next({ ...this.state.getValue(), play: false });
      });
  }
}
