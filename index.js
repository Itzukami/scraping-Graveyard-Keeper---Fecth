import getAlldata from './getalldata.js';
import getDetails from './getDetails.js';
import fs from 'fs';
(async () => {
    const planos = await getAlldata('https://graveyardkeeper.fandom.com/wiki/Blueprints', 'blueprint');

    for (const plano of planos) {
        if (plano.name == "Double pallet" || plano.name == "Embalming table II" || plano.name == "Fridge pallet" || plano.name == "Potters wheel") {
            console.log('hola');
        }
        let detalles = await getDetails(plano.url, plano.name, 'planos');
        plano.description = detalles[0];
        plano.descricion = detalles[1];
        plano.nombre = detalles[2];
        plano.img = detalles[3];
        plano.requieres = detalles[4];
        plano.icon = detalles[5];
    }
    const articulos = await getAlldata('https://graveyardkeeper.fandom.com/wiki/Items', 'items');
    for (const articulo of articulos) {
        let detalles = await getDetails(articulo.url, articulo.name, 'articulos');
        articulo.description = detalles[0];
        articulo.descricion = detalles[1];
        articulo.nombre = detalles[2];
        articulo.img = detalles[3];
    }
    let dictstring = JSON.stringify({
        articulos: articulos,
        planos: planos
    });
    fs.writeFile("grave.json", dictstring, function (err, result) {
        if (err) console.log('error', err);
    });
})();




