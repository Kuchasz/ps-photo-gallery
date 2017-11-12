import {GalleryDirectory} from "../service/gallery.state";
import {parseString} from "xml2js";

export const fetchGallery = (path: string) => new Promise<GalleryDirectory[]>((res) => {

    fetch(`${path}folders.xml`)
        .then(response => response.text())
        .then(foldersXmlString =>
            parseString(foldersXmlString, (_, _directories) => {
                const directoriesToFetch = _directories.item.item.filter(item => item.$.action === "loadalbum").map(item => item.$);

                let fetchedDirectories = 0;
                const directories: { gallery: GalleryDirectory, index: number }[] = [];
                let index = 0;

                directoriesToFetch.forEach((item) => {
                    fetch(`${path}${item.variables}`)
                        .then(response => response.text())
                        .then(photosXmlString => {
                            parseString(photosXmlString, (_, photos) => {
                                if (photos.gallery) {
                                    const images = photos.gallery.image.map(img => img.$);

                                    directories.push({
                                        index,
                                        gallery: {
                                            visited: false,
                                            name: item.name.replace("_", " "),
                                            rootDir: item.path,
                                            images: images.map(img => ({
                                                src: `${path}${item.path}${img.img}`,
                                                thumbnail: `${path}${item.path}${img.thmb}`,
                                                text: img.img.split("/")[1]
                                            }))
                                        }
                                    });

                                    if (fetchedDirectories === directoriesToFetch.length - 1) {
                                        console.log(directories);
                                        directories.sort((l, r) => l.index - r.index);
                                        console.log(directories);
                                        res(directories.map(x => x.gallery));
                                    }

                                    fetchedDirectories++;
                                }
                            });

                            index++;
                        });
                });
            })
        );

});