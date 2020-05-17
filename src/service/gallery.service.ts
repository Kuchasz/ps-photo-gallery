import { Injectable, Optional } from "@angular/core";

import { GalleryState, GalleryImage, GalleryDirectory, ScreenOrientation } from "./gallery.state";
import { GalleryConfig } from "../config/gallery.config";
import { defaultState, defaultConfig } from "../config/gallery.default";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { switchMap, take, takeWhile, map, filter, find, tap, finalize, publishLast } from "rxjs/operators";
import { from, pipe, interval as fromInterval } from "rxjs";
import { ParamMap, Route, Router, ActivatedRoute } from "@angular/router";

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
            .pipe(switchMap((interval: number) => (interval ? this.playerEngine(interval) : from(null))))
            .subscribe();
    }

    load(directories: { [id: string]: GalleryDirectory }) {
        const state = this.state.getValue();

        this.state.next({
            ...state,
            directories,
            currIndex: undefined,
            prevIndex: undefined
        });
    }

    setOrientation(orientation: ScreenOrientation) {
        const state = this.state.getValue();
        this.state.next({ ...state, orientation });
    }

    toggleOrientation() {
        const state = this.state.getValue();

        const orientation = state.orientation === "landscape" ? "portrait" : "landscape";

        this.state.next({ ...state, orientation });
    }

    selectDirectory(directoryId: string) {
        const state = this.state.getValue();

        const directories = {
            ...state.directories,
            [directoryId]: { ...state.directories[directoryId], visited: true }
        };

        this.state.next({
            ...state,
            directories
        });

        this.selectImage(0, directoryId);
        // this.clearCurrentImage();
    }

    getDirectory(directoryId: string) {
        return this.state.pipe(map((x) => x.directories[directoryId]));
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
                nextIndex: undefined
            }
        });
    }

    selectImage(index: number, directoryId: string) {
        const state = this.state.getValue();
        const directory = state.directories[directoryId];

        this.state.next({
            ...state,
            ...this._getStateIndexes(index, directory)
        });
    }

    private _getStateIndexes(index: number, directory: GalleryDirectory) {
        return {
            currIndex: index,
            prevIndex: index === 0 ? directory.images.length - 1 : index - 1,
            nextIndex: index === directory.images.length - 1 ? 0 : index + 1
        };
    }

    snapImage(index: number, directoryId: string) {
        console.log("SNAPED: | " + index);
        const state = this.state.getValue();

        const snappedCountChange = (snapped) => (snapped ? +1 : -1);

        const directory = state.directories[directoryId];
        const images = directory.images;
        const imageToSnap = images[index];
        const snappedImage = { ...imageToSnap, snapped: !imageToSnap.snapped };

        const newImages = images.map((i, idx) => (idx != index ? i : snappedImage));
        const changedDirectory: GalleryDirectory = { ...directory, images: newImages };
        const newState = {
            ...state,
            snappedCount: state.snappedCount + snappedCountChange(snappedImage.snapped),
            directories: { ...state.directories, [changedDirectory.id]: changedDirectory }
        };

        this.state.next(newState);
    }

    displaySnappedImages() {
        const state = this.state.getValue();

        this.state.next({ ...state, displaySnappedImages: true });
    }

    goBackToGallery() {
        const state = this.state.getValue();

        this.state.next({ ...state, displaySnappedImages: false });
    }

    next(directoryId: string) {
        const state = this.state.getValue();

        this.selectImage(state.nextIndex, directoryId);
    }

    prev(directoryId: string) {
        const state = this.state.getValue();

        this.selectImage(state.prevIndex, directoryId);
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
        return fromInterval(interval).pipe(
            takeWhile(() => this.state.getValue().play),
            tap(() => this.next(undefined)),
            finalize(() => this.state.next({ ...this.state.getValue(), play: false }))
        );
    }
}
