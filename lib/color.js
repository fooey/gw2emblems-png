'ust strict';


// http://stackoverflow.com/questions/10781953/determine-rgba-colour-received-by-combining-two-colours
// https://en.wikipedia.org/wiki/Alpha_compositing
export function blendPixel(pixel1, pixel2) {
    if (!pixel2.a) {
        return pixel1;
    }

    if (!pixel1.a) {
        return pixel2;
    }

    const i = pixel1.i;

    const a1 = pixel1.a / 255;
    const a2 = pixel2.a / 255;
    const a0 = blendAlpha(a1, a2);

    const r = blendColor(pixel1.r, pixel2.r, a1, a2, a0);
    const g = blendColor(pixel1.g, pixel2.g, a1, a2, a0);
    const b = blendColor(pixel1.b, pixel2.b, a1, a2, a0);

    return {i, r, g, b, a: a0 * 255};
}

function blendAlpha(a1, a2) {
    return a1 + (a2 * (1 - a1));
}

function blendColor(c1, c2, a1, a2, a0) {
    return (c1 * a1 + c2 * a2 * (1 - a1)) / a0;
}



export function linearBurnPixel(rgbaSource, rgb) {
    if (rgbaSource.a) {
        return {
            i: rgbaSource.i,
            r: Math.abs(rgbaSource.r + rgb.r - 255),
            g: Math.abs(rgbaSource.g + rgb.g - 255),
            b: Math.abs(rgbaSource.b + rgb.b - 255),
            a: rgbaSource.a,
        }
    }
    else {
        return rgbaSource;
    }
};


export function darkenPixel(rgbaSource, lightnessPct) {
    const i = rgbaSource.i;
    const r = lightnessPct * rgbaSource.r;
    const g = lightnessPct * rgbaSource.g;
    const b = lightnessPct * rgbaSource.b;
    const a = rgbaSource.a;

    return rgbaSource;
};