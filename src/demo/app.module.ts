import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {GalleryModule} from "../gallery.module";

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
          background: "#121519",
          width: "900px",
          height: "600px"
        },
        description: {
          position: 'bottom',
          overlay: false,
          text: true,
          counter: true
        },
        thumbnails: {
          width: 120,
          height: 90,
          position: 'top',
          space: 20
        },
        bullets: undefined,
        navigation: {},
        gestures: true
      }
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
