import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./component/app.component";
import { GalleryModule } from "../gallery.module";
import { checkIfMobile } from "../utils/browser";
import { DisplayModes } from "../config/gallery.config";
import { GalleryService } from "../service/gallery.service";
import { fetchGallery } from "../utils/jalbum";
import { ApiService } from '../service/api.service';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        GalleryModule.forRoot({
            style: {
                background: "rgba(0, 0, 0, 0.9)",
                width: "100vw",
                height: "100vh"
            },
            description: {
                position: "bottom",
                overlay: false,
                text: true,
                counter: true
            },
            thumbnails: {
                width: 95,
                height: 95,
                position: "bottom",
                space: 20
            },
            navigation: {},
            gestures: true,
            displayMode: checkIfMobile() ? DisplayModes.Compact : DisplayModes.Full
        })
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (galleries: GalleryService, api: ApiService) => {
                return () =>
                    new Promise(async (res, rej) => {
                        const root = "/";
                        const gallery = await fetchGallery(root);

                        const clientId = await api.connect("John", 1);

                        const likesResult = await api.sdk.getLikes({ galleryId: 1, clientId });

                        galleries.load(gallery, likesResult.likes);
                        res();
                    });
            },
            deps: [GalleryService, ApiService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
