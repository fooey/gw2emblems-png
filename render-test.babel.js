'use strict';

// import _ from 'lodash';
import async from 'async';


import {
    renderEmblemFromDisk,
} from './lib/emblem';

import {
    writePng,
} from './lib/png';




const celestial = {r: 211, g: 208, b: 207};
const abyss = {r: 26, g: 24, b: 27};
const blackCherry = {r: 128, g: 0, b: 0};
const green = {r: 0, g: 128, b: 0};
const blue = {r: 0, g: 0, b: 128};


let testRange = [];

for (let i = 220; i < 233; i++) {
    testRange.push(i + 1);
}



async.eachLimit(
    testRange,
    4,
    (id, cb) => {

        const fg = {
            id,
            color1: blackCherry,
            color2: abyss,
        };

        const bg = {
            id: 27,
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










