import {Injectable, Optional} from '@angular/core';

import {GalleryState, GalleryImage, GalleryDirectory} from './gallery.state';
import {GalleryConfig} from '../config/gallery.config';
import {defaultState, defaultConfig} from '../config/gallery.default';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';

@Injectable()
export class GalleryService {

    /** Gallery state */
    state: BehaviorSubject<GalleryState>;
    /** Gallery config */
    config: GalleryConfig = defaultConfig;
    /** Gallery slide show player */
    player: Subject<number>;

    constructor(@Optional() config: GalleryConfig) {

        /** Initialize the state */
        this.state = new BehaviorSubject<GalleryState>(defaultState);
        /** Initialize the config */
        this.config = {...defaultConfig, ...config};

        /** Initialize the player for play/pause commands */
        this.player = new Subject();
        this.player.switchMap((interval) => (interval) ? this.playerEngine(interval) : Observable.of(null)).subscribe();
    }

    /** Load images and reset the state */
    load(directories: GalleryDirectory[]) {

        this.state.next({
            directories,
            currDirectory: undefined,
            currIndex: undefined,
            hasNext: undefined,
            hasPrev: undefined
        });

        // this.state.next({
        //   images: state.directories[state.currDirectory].images,
        //   currIndex: 0,
        //   hasNext: images.length > 1,
        //   hasPrev: false,
        // });
    }

    /** Set current image and update the state */
    set(index: number) {
        const state = this.state.getValue();

        this.state.next({
            ...state, ...{
                prevIndex: state.currIndex,
                currIndex: index,
                hasNext: index < state.directories[state.currDirectory].images.length - 1,
                hasPrev: index > 0
            }
        });
    }

    /** Go to next image and update the state */
    next() {
        const state = this.state.getValue();

        if (state.hasNext) {
            const index = state.currIndex + 1;
            this.set(index);
        } else {
            this.set(0);
        }
    }

    /** Go to previous image and update the state */
    prev() {
        const state = this.state.getValue();

        if (state.hasPrev) {
            const index = state.currIndex - 1;
            this.set(index);
        } else {
            this.set(state.directories[state.currDirectory].images.length - 1);
        }
    }

    /** Reset gallery with initial state */
    reset() {
        this.state.next(defaultState);
        this.stop();
    }

    /** Play slide show */
    play(interval?: number) {
        const speed = interval || this.config.player.speed || 2000;

        const state = this.state.getValue();
        /** Open and play the gallery*/
        this.state.next({...state, play: true});
        this.player.next(speed);
    }

    /** End slide show */
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
                this.state.next({...this.state.getValue(), play: false});
            });

    }

}
