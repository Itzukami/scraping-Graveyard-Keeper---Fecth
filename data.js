import fetch from 'node-fetch';

export default async function getData(url) {
    const primaryData = await (await fetch(url)).text()
    return primaryData;
}

