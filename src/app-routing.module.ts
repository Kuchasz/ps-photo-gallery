import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"; // CLI imports router
import { APP_BASE_HREF } from "@angular/common";
import { GalleryDirectoriesComponent } from "./component/gallery-directories/gallery-directories.component";
import { GallerySnappedImagesComponent } from "./component/gallery-snapped-images/gallery-snapped-images.component";
// import { GalleryMainComponent } from "./component/gallery-main/gallery-main.component";
import { GalleryImagesGridComponent } from "./component/gallery-images-grid/gallery-images-grid.component";

const routes: Routes = [
    { path: "", component: GalleryDirectoriesComponent },
    { path: "snapped", component: GallerySnappedImagesComponent },
    { path: "directory/:id", component: GalleryImagesGridComponent }
]; // sets up routes constant where you define your routes

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
})
export class AppRoutingModule {}
