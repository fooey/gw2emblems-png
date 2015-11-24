'ust strict';


import _ from 'lodash';
import path from 'path';
import async from 'async';


import {
    newPng,
    loadPngFromDisk,
    // prepPng,
    updatePngBuffer,
    // writePng,
} from './png';

import {
    blendPixel,
    // linearBurnPixel,
    darkenPixel,
} from './color';


const PNG_SIZE = 128;


export function renderEmblemFromDisk(fg, bg, pngRoot, onRenderComplete) {
    console.log('renderEmblem()', fg.id);

    const bgRoot = pngRoot + '/bg';
    const fgRoot = pngRoot + '/fg';

    const lightnessMapSrc = path.resolve(fgRoot, `${fg.id}-0.png`);
    const opacityMap1Src = path.resolve(fgRoot, `${fg.id}-1.png`);
    const opacityMap2Src = path.resolve(fgRoot, `${fg.id}-2.png`);
    const opacityMapBgSrc = path.resolve(bgRoot, `${bg.id}.png`);

    async.auto({
        lightnessMap: loadPngFromDisk.bind(null, lightnessMapSrc),
        opacityMap1: loadPngFromDisk.bind(null, opacityMap1Src),
        opacityMap2: loadPngFromDisk.bind(null, opacityMap2Src),
        opacityMapBg: loadPngFromDisk.bind(null, opacityMapBgSrc),
    },
    (err, results) => {
        fg.lightnessMap = results.lightnessMap;
        fg.opacityMap1 = results.opacityMap1;
        fg.opacityMap2 = results.opacityMap2;

        bg.opacityMap = results.opacityMapBg;

        renderEmblem(fg, bg, onRenderComplete);
    });
}



export function renderEmblem(fg, bg, onRenderComplete) {
    async.auto({
        render1: [
            (cb) =>
            renderLayerFG(fg.lightnessMap, fg.opacityMap1, fg.color1, cb)
        ],
        render2: [
            (cb) =>
            renderLayerFG(fg.lightnessMap, fg.opacityMap2, fg.color2, cb)
        ],
        renderBg: [
            (cb) =>
            renderLayerBG(bg.opacityMap, bg.color, cb)
        ],

        merge: [
            'render1', 'render2', 'renderBg',
            (cb, results) =>
            mergeLayers([results.render1, results.render2, results.renderBg], cb)
        ],

        final: [
            'merge',
            (cb, results) =>
            updatePngBuffer(results.merge, cb)
        ],
    },
    (err, results) => {
        onRenderComplete(err, results.final);
    });
}





export function renderLayerFG(lightnessMap, opacityMap, rgb, onComplete) {
    // console.log('renderLayerFG()');

    let layer = newPng(PNG_SIZE);

    async.map(
        opacityMap.pixels,
        (pixel, cb) => {
            // all white, don't need to math it up
            // const colorizedPixel = linearBurnPixel(opacityMap.pixels[pixel.i], rgb);

            const colorizedPixel = _.merge(opacityMap.pixels[pixel.i], rgb);

            const lightnessPct = lightnessMap.pixels[pixel.i].r / 255;
            const darkenedPixel = darkenPixel(colorizedPixel, lightnessPct);

            cb(null, darkenedPixel);
        },
        (err, results) => {
            layer.pixels = results;
            onComplete(null, layer);
        }
    );
}



export function renderLayerBG(opacityMap, rgb, onComplete) {
    // console.log('renderLayerFG()');

    let layer = newPng(PNG_SIZE);

    async.map(
        opacityMap.pixels,
        (pixel, cb) => {

            pixel = _.merge(pixel, rgb);

            cb(null, pixel);
        },
        (err, results) => {
            layer.pixels = results;
            onComplete(null, layer);
        }
    );
}


export function mergeLayers(layers, onComplete) {
    // console.log('mergeLayers()', layers.length);
    let merged = newPng(PNG_SIZE);

    merged.pixels = _.map(layers[0].pixels, (pixel, ix) => {
        _.each(layers, (layer) => {
            pixel = blendPixel(pixel, layer.pixels[ix]);
        });
        return pixel;
    });

    onComplete(null, merged);
}