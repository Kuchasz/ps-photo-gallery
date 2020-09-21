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
import { getSdk } from "../../../sdk";
import { GraphQLClient } from "graphql-request";

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
            useFactory: (galleries: GalleryService) => {
                return () =>
                    new Promise(async (res, rej) => {
                        const root = "/";
                        const gallery = await fetchGallery(root);

                        const galleryId = "03948572-9968-0648-3059-059683920592";

                        const sdk = getSdk(new GraphQLClient("http://localhost:4000/graphql"));

                        let clientId = Number.parseInt(localStorage.getItem("client.id") ?? "0");

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

                        // const app = firebase.initializeApp(
                        //     {
                        //         apiKey: firebaseConfig.apiKey,
                        //         authDomain: firebaseConfig.authDomain,
                        //         projectId: firebaseConfig.projectId
                        //     },
                        //     "wanak"
                        // );

                        // const galleryid = "03948572-9968-0648-3059-059683920592";

                        // app.firestore()
                        //     .collection(`galleries/${galleryid}/likes`)
                        //     .get()
                        //     .then((data) => {
                        //         const likes = data.docs.map((doc) => {
                        //             // const [directoryId, id] = doc.id.split("#");
                        //             return { id: doc.id, count: doc.data().count };
                        //         })

                        //         res();
                        //     });

                        galleries.load(gallery, likesResult.likes);
                        res();
                    });
            },
            deps: [GalleryService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
