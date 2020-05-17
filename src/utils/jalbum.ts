import { GalleryDirectory } from "../service/gallery.state";
import { parseString } from "xml2js";

const getId = () => {
    const usedIds = [];
    return (name: string) => {
        let newId = "";
        let tries = 0;
        do {
            newId = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() + "-" + tries;
            tries++;
        } while (usedIds.includes(newId));

        usedIds.push(newId);
        

        return newId;
    };
};

export const fetchGallery = (path: string) =>
    new Promise<{ [id: string]: GalleryDirectory }>((res) => {
        fetch(`${path}folders.xml`)
            .then((response) => response.text())
            .then((foldersXmlString) =>
                parseString(foldersXmlString, (_, _directories) => {
                    const directoriesToFetch = _directories.item.item
                        .filter((item) => item.$.action === "loadalbum")
                        .map((item) => item.$);

                    const getIdFromName = getId();

                    let fetchedDirectories = 0;
                    const directories: { gallery: GalleryDirectory; index: number }[] = [];
                    directoriesToFetch.forEach((item, index) => {
                        fetch(`${path}${item.variables}`)
                            .then((response) => response.text())
                            .then((photosXmlString) => {
                                parseString(photosXmlString, (_, photos) => {
                                    if (photos.gallery) {
                                        const images = photos.gallery.image.map((img) => img.$);

                                        directories.push({
                                            index,
                                            gallery: {
                                                id: getIdFromName(item.name.replace("_", "-")),
                                                visited: false,
                                                name: item.name.replace("_", " "),
                                                rootDir: item.path,
                                                images: images.map((img) => ({
                                                    src: `${path}${item.path}${img.img}`,
                                                    thumbnail: `${path}${item.path}${img.thmb}`,
                                                    text: img.img.split("/")[1]
                                                }))
                                            }
                                        });

                                        if (fetchedDirectories === directoriesToFetch.length - 1) {
                                            directories.sort((l, r) => l.index - r.index);

                                            const result = directories.reduce(
                                                (acc, cur) => ({ ...acc, [cur.gallery.id]: cur.gallery }),
                                                {}
                                            );
                                            console.log(result);
                                            res(result);
                                        }

                                        fetchedDirectories++;
                                    }
                                });
                            });
                    });
                })
            );
    });
