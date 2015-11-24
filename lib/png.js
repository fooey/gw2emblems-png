'use strict';

import fs from 'fs-extra';

import async from 'async';
import {PNG} from 'pngjs';

// const PNG = pngjs.PNG;


export function newPng(size) {
    return new PNG({width: size, height: size});
}


export function loadPngFromDisk(fileSrc, onPngParsed) {
    // console.log('loadPngFromDisk', fileSrc);

    fs.createReadStream(fileSrc)
        .pipe(new PNG({filterType: 4}))
        .on('parsed', function() {
            prepPng.call(this, fileSrc, onPngParsed)
        });
};



export function prepPng(fileSrc, cb) {
    // console.log('prepPng', fileSrc);

    this.src = fileSrc;
    this.pixels = [];
    // this.visible = 0;
    // this.fullBright = 0;
    // this.dimmed = 0;

    for(let i = 0; i < this.data.length; i += 4) {
        this.pixels.push({
            i: i / 4,
            r: this.data[i + 0],
            g: this.data[i + 1],
            b: this.data[i + 2],
            a: this.data[i + 3],
        });

        // if (this.data[i + 3]) {
        //     this.visible++;
        // }
        // if (this.data[i + 0] === 255) {
        //     this.fullBright++;
        // }
        // else if (this.data[i + 0] > 0) {
        //     this.dimmed++;
        // }
    }

    // console.log('prepPng', fileSrc, this.visible, this.fullBright, this.dimmed);

    cb(null, this);
};



export function updatePngBuffer(img, onPack) {
    // console.log('updatePngBuffer');

    async.each(
        img.pixels,
        (p, cb) => {
            img.data[p.i * 4    ] = p.r;
            img.data[p.i * 4 + 1] = p.g;
            img.data[p.i * 4 + 2] = p.b;
            img.data[p.i * 4 + 3] = p.a;
            cb();
        },
        (err) => {
            delete img.pixels;
            onPack(null, img);
        }
    );
}


export function writePng(img, dest, onWriteComplete) {
    // console.log('writePng', dest);

    const writeStream = fs
        .createOutputStream(dest)
        .on('finish', onWriteComplete);

    img.pack().pipe(writeStream);
}