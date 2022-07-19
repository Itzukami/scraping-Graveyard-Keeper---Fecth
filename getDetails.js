import getData from "./data.js";
import getTraduction from "./gettraduction.js";
import fs from 'fs/promises';

export default async function getDetails(url, name, tipo) {
    const data = await getData(url);
    const description = data.matchAll(
        /<meta property="og:description" content="(.+?)"\/>/gim
    );
    const imagen = data.matchAll(
        /<td colspan="2" class="infobox-centered"><a href="(https:\/\/static.wikia.nocookie.net\/graveyardkeeper_gamepedia_en\/images(.+?))"/gim
    );

    const imagen_parsed = [...imagen].map((item) => {
        return item[1];
    });
    const description_parsed = [...description].map((item) => {
        return item[1];
    });
    let receta_parsed = [];
    const icon = data.matchAll(
        /<a href="(.+?)" class="image"><img alt="(.+?).png" src="(.+?)" decoding="async" width="56" height="56" data-image-name="(.+?)" data-image-key="(.+?).png" \/>/gim
    );
    let icon_parsed = "";
    // <span style="display:inline-block;"> <a href="(.+?)" title="(.+?)">(.+?)<\/a>
    if (tipo == "planos") {

        const recetas = data.matchAll(
            /><span style="display:inline-block;"> <a href="(.+?)" title="(.+?)">([\w\W]+?)<\/a>/gim
        );


        // WriteFile('data ' + name + '.txt', data);

        let i = 0;

        for (const receta of recetas) {
            i++;
            let parsed = receta[0].matchAll(
                / <a href="(.+?)" title="(.+?)">(.+?);<\/a>/gim
            );

            // await WriteFile("receta" + i + " " + name + ".txt", receta[0]);


            [...parsed].map((a) => {
                receta_parsed.push({
                    name: a[2],
                    cant: a[3].split("&#")[0],
                });
            });
            break;
        }

        [...icon].map((b) => {
            icon_parsed = b[1];
        });
    }

    const nombre = await getTraduction(name);
    const descripcion = await getTraduction(description_parsed[0]);
    console.log(nombre);
    if (tipo == "planos") {
        return [
            description_parsed[0],
            descripcion,
            nombre,
            imagen_parsed[0],
            receta_parsed.flat(1),
            icon_parsed,
        ];
    } else {
        return [description_parsed[0], descripcion, nombre, imagen_parsed[0]];
    }
}


async function WriteFile(name, data) {
    try {

        await fs.writeFile("recetas/" + name, data);
    } catch (err) {
        console.log(err);
    }
}