import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GalleryService} from '../../index';
import {parseString} from "xml2js";
import {GalleryDirectory} from "../../service/gallery.state";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    constructor(public gallery: GalleryService) {
    }

    ngOnInit() {

        const root = window.location.pathname;

        fetch(`${root}folders.xml`)
            .then(response => response.text())
            .then(foldersXmlString => parseString(foldersXmlString, (_, _directories) => {

                const directoriesToFetch = _directories.item.item.length - 1;
                let fetchedDirectories = 0;
                const directories: GalleryDirectory[] = [];

                _directories.item.item.forEach(item => {
                    fetch(`${root}${item.$.variables}`)
                        .then(response => response.text())
                        .then(photosXmlString => {

                            parseString(photosXmlString, (_, photos) => {

                                if (photos && photos.gallery){

                                    const images = photos.gallery.image;

                                    directories.push({
                                        visited: false,
                                        name: item.$.name.replace("_", " "),
                                        rootDir: item.$.path,
                                        images: images.map(img => ({
                                            src: `${root}${item.$.path}${img.$.img}`,
                                            thumbnail: `${root}${item.$.path}${img.$.thmb}`,
                                            text: img.$.img.split('/')[1]
                                        }))
                                    });

                                    fetchedDirectories++;
                                    if (fetchedDirectories === directoriesToFetch)
                                        this.gallery.load(directories);
                                }

                            });
                        });
                });
            }));
    }

}
