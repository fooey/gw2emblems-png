'use strict';

// import _ from 'lodash';
import async from 'async';


import {
    renderEmblemFromDisk,
} from './lib/emblem';

import {
    writePng,
} from './lib/png';




const white = {r: 189, g: 186, b: 185};
const red = {r: 135, g: 0, b: 10};
const blueberry = {r: 36, g: 65, b: 122};
const ancientSilver = {r: 157, g: 142, b: 108};
const abyss = {r: 26, g: 24, b: 27};
const green = {r: 28, g: 90, b: 45};
const gray = {r: 72, g: 69, b: 70};
const fuchsia = {r: 117, g: 25, b: 67};
const oxblood = {r: 55, g: 4, b: 0};
const orange = {r: 152, g: 63, b: 23};
const salmon = {r: 133, g: 36, b: 26};
const harvestGold = {r: 137, g: 85, b: 0};
const lime = {r: 35, g: 80, b: 0};
const blackCherry = {r: 128, g: 0, b: 0};
const blue = {r: 0, g: 0, b: 128};


let testRange = [];

for (let i = 162; i < 170; i++) {
    testRange.push(i + 1);
}



async.eachLimit(
    testRange,
    4,
    (id, cb) => {

        const fg = {
            id,
            color1: lime,
            color2: white,
        };

        const bg = {
            id: 2,
            color: abyss,
        };

        renderEmblemFromDisk(fg, bg, './raw', (err, emblem) => {
            const filePath = `./render_test/${id}.png`;

            writePng(emblem, filePath, () => {
                console.log('wrote', filePath);
                cb();
            });
        });
    },
    (err) => console.log('done', err)
);










