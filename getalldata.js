import getData from './data.js';

export default async function getAlldata(url, tipo) {
    const data = await getData(url);
    const matches = data.matchAll(/<h2><span class="mw-headline" id=".+?">(.+?)<([\w\W]+?)<\/span>(<br \/>)*\n<\/p>\n<\/div>\n^(?!<h3>)/igm);
    let subitem = [];
    let articulos_parsed = [];
    const parsed = [...matches].map(item => {
        let articulos_all = [];
        let categoria = item[1];
        let subcategoria = '';
        if (item[0].includes('<h3>')) {
            subitem = [...item[0].matchAll(/<h3><span class="mw-headline" id=".+?">(.+?)<([\w\W]+?)<\/span>(<br \/>)*\n<\/p>\n<\/div>\n(?=(<h3>)|($))/igm)];
            subitem.forEach(subitems => {
                subcategoria = subitems[1];
                let element_url = [];
                articulos_parsed = [...subitems[0].matchAll(/<\/a><a href="(.+?)"( class="(.+?)")* title=".+?">(.+?)<\/a><\/span>/igm)];
                articulos_parsed.forEach(a => {
                    if (!(element_url.indexOf(a[1]) > -1)) {
                        element_url.push(a[1])
                        articulos_all = [...articulos_all, {
                            tipo: tipo,
                            name: a[4],
                            url: 'https://graveyardkeeper.fandom.com' + a[1],
                            categorie: categoria,
                            subcategory: subcategoria
                        }];
                    }
                })
            });
        } else {
            articulos_parsed = [...item[0].matchAll(/<\/a><a href="(.+?)" title=".+?">(.+?)<\/a><\/span>/igm)];
            let element_url = [];
            articulos_parsed.forEach(a => {
                if (element_url.indexOf(a[1]) == -1) {
                    element_url.push(a[1])
                    let url = a[1].includes('" ') ? a[1].split('" ')[0] : a[1];
                    articulos_all = [...articulos_all, {
                        tipo: tipo,
                        name: a[2],
                        url: 'https://graveyardkeeper.fandom.com' + url,
                        categorie: categoria,
                        subcategory: "N/A"
                    }];
                }
            })
        }
        return articulos_all;
    })
    return parsed.flat(1);
}
