import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './component/app.component';
import {GalleryModule} from "../gallery.module";
import {checkIfMobile} from "../utils/browser";
import {DisplayModes} from "../config/gallery.config";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        GalleryModule.forRoot(
            {
                style: {
                    background: "#333",
                    width: "100vw",
                    height: "100vh"
                },
                description: {
                    position: 'bottom',
                    overlay: false,
                    text: true,
                    counter: true
                },
                thumbnails: {
                    width: 100,
                    height: 100,
                    position: 'bottom',
                    space: 20
                },
                bullets: undefined,
                navigation: {},
                gestures: true,
                displayMode: checkIfMobile() ? DisplayModes.Compact : DisplayModes.Full
            }
        )
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
