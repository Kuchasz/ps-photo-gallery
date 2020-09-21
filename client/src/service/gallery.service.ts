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
import { GraphQLClient } from "graphql-request";

// import * as firebase from "firebase";
// import "firebase/firestore";
// import { uuidv4 } from "../utils/uuid";

const galleryId = "03948572-9968-0648-3059-059683920592";

import { getSdk } from "../../../sdk";
const sdk = getSdk(new GraphQLClient("http://localhost:4000/graphql"));

let clientId = Number.parseInt(localStorage.getItem("client.id") ?? "0");

(async () => {
    if (!clientId) {
        const result = await sdk.connectClient({ name: "Jacek" });
        clientId = result.connect.id;
        localStorage.setItem("client.id", String(clientId));
        console.log(`NEWLY_CONNECTED: ${clientId}`);
    } else {
        console.log(`ALREADY_CONNECTED: ${clientId}`);
    }

    const likesResult = await sdk.getLikes({ galleryId, clientId });
    console.log(likesResult.likes);

})();


@Injectable()
export class GalleryService {
    state: BehaviorSubject<GalleryState>;

    config: GalleryConfig = defaultConfig;

    player: Subject<number>;
    // db: firebase.firestore.Firestore;

    constructor(@Optional() config: GalleryConfig) {
        this.state = new BehaviorSubject<GalleryState>(defaultState);
        this.config = { ...defaultConfig, ...config };

        this.player = new Subject();

        this.player
            .pipe(switchMap((interval: number) => (interval ? this.playerEngine(interval) : from(null))))
            .subscribe();

        // const app = firebase.initializeApp({
        //     apiKey: config.firebase.apiKey,
        //     authDomain: config.firebase.authDomain,
        //     projectId: config.firebase.projectId
        // });

        // this.db = app.firestore(); //.collection(`galleries/${galleryid}/likes`);

        // const weddingId = `wedding-${uuidv4()}`;
        // const photoIds = [`photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`, `photo-${uuidv4()}`];

        // console.log('SERVICE_RUN!!');
        // Get a new write batch
        // var batch = db.batch();

        // Set the value of 'NYC'
        // var weddingLikes = db.collection("likes").doc(weddingId).collection("photos");

        // photoIds.forEach(id => batch.set(weddingLikes.doc(id), {count: Math.floor(Math.random()*100)}));

        // batch.set(nycRef, {name: "New York City"});

        // Update the population of 'SF'
        // var sfRef = db.collection("cities").doc("SF");
        // batch.update(sfRef, {"population": 1000000});

        // Delete the city 'LA'
        // var laRef = db.collection("cities").doc("LA");
        // batch.delete(laRef);

        // Commit the batch
        // batch.commit().then(function (x) {
        // console.log('saved photos!!');
        // ...
        // });

        // db.collection("likes").doc(`wedding-id-${uuidv4()}`).collection("photos")

        // db.runTransaction((transaction) => transaction.)

        // db.collection("likes").add({
        //     id: `wedding-id-${uuidv4()}`,
        //     photos: [
        //         {id: `photo-id-${uuidv4()}`, likes: Math.floor(Math.random()*100)},
        //         {id: `photo-id-${uuidv4()}`, likes: Math.floor(Math.random()*100)},
        //         {id: `photo-id-${uuidv4()}`, likes: Math.floor(Math.random()*100)},
        //         {id: `photo-id-${uuidv4()}`, likes: Math.floor(Math.random()*100)},
        //         {id: `photo-id-${uuidv4()}`, likes: Math.floor(Math.random()*100)},
        //         {id: `photo-id-${uuidv4()}`, likes: Math.floor(Math.random()*100)}
        //     ]
        // });
    }

    load(
        result: {
            images: GalleryImage[];
            directoryImages: { [id: string]: string[] };
            directories: { [id: string]: GalleryDirectory };
        },
        likes: { imageId: string; likes: number, liked: boolean }[]
    ) {
        const state = this.state.getValue();

        const images = result.images.map((i) => ({
            ...i,
            likes: likes.filter((l) => i.id === l.imageId).map((l) => l.likes)[0] ?? 0,
            liked: likes.filter((l) => i.id === l.imageId).map((l) => l.liked)[0] ?? false
        }));

        this.state.next({
            ...state,
            directories: result.directories,
            images: images,
            directoryImages: result.directoryImages,
            currId: undefined,
            prevId: undefined,
            nextId: undefined
        });
    }

    likeImage(id: string, directoryId: string) {
        sdk.likeImage({ imageId: id, galleryId, clientId });
        // const doc = this.db.doc(`galleries/${galleryid}/likes/${id}`);
        // doc.get().then((x) => {
        //     if (x.exists) {
        //         x.ref.update({ count: firebase.firestore.FieldValue.increment(1) });
        //     } else {
        //         x.ref.set({ count: 1 });
        //     }
        // });
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
        console.log("SELECT_DIRECTORY");
        const state = this.state.getValue();

        const directories = {
            ...state.directories,
            [directoryId]: { ...state.directories[directoryId], visited: true }
        };

        this.state.next({
            ...state,
            directories
        });

        this.selectImage(state.directoryImages[directoryId][0], directoryId);
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
                prevId: undefined,
                currId: undefined,
                nextId: undefined
            }
        });
    }

    selectImage(id: string, directoryId: string) {
        console.log("SELECT_IMAGE");

        const state = this.state.getValue();
        const images = state.directoryImages[directoryId];

        this.state.next({
            ...state,
            ...this._getStateIds(id, images)
        });
    }

    private _getStateIds(id: string, images: string[]) {
        const currIndex = images.indexOf(id);
        const prevIndex = currIndex === 0 ? images.length - 1 : currIndex - 1;
        const nextIndex = currIndex === images.length - 1 ? 0 : currIndex + 1;

        return {
            currId: id,
            prevId: images[prevIndex],
            nextId: images[nextIndex]
        };
    }

    snapImage(id: string) {
        const state = this.state.getValue();

        const newState = {
            ...state,
            images: state.images.map((x) => (x.id !== id ? x : { ...x, snapped: !x.snapped }))
        };

        this.state.next(newState);
    }

    snapImages(images: GalleryImage[]) {}

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

        this.selectImage(state.nextId, directoryId);
    }

    prev(directoryId: string) {
        const state = this.state.getValue();

        this.selectImage(state.prevId, directoryId);
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
