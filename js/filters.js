/**
 * Copyright (c) 2012 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Ilmari Heikkinen <ilmari@google.com>
 * 
 * Contributions: Fernando Bevilacqua <dovyski@gmail.com>
 */

Filters = {};

Filters.getPixels = function (img) {
    var c, ctx;
    if (img.getContext) {
        c = img;
        try { ctx = c.getContext('2d'); } catch (e) { }
    }
    if (!ctx) {
        c = this.getCanvas(img.width, img.height);
        ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }
    return ctx.getImageData(0, 0, c.width, c.height);
};

Filters.getCanvas = function (w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
};

Filters.filterImage = function (filter, image, var_args) {
    var args = [this.getPixels(image)];
    for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    return filter.apply(null, args);
};

Filters.convolute = function (pixels, weights, opaque) {
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);

    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    var w = sw;
    var h = sh;
    var output = Filters.createImageData(w, h);
    var dst = output.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                    var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                    var srcOff = (scy * sw + scx) * 4;
                    var wt = weights[cy * side + cx];
                    r += src[srcOff] * wt;
                    g += src[srcOff + 1] * wt;
                    b += src[srcOff + 2] * wt;
                    a += src[srcOff + 3] * wt;
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
        }
    }
    return output;
};

if (!window.Float32Array)
    Float32Array = Array;

Filters.convoluteFloat32 = function (pixels, weights, opaque) {
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);

    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    var w = sw;
    var h = sh;
    var output = {
        width: w, height: h, data: new Float32Array(w * h * 4)
    };
    var dst = output.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                    var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                    var srcOff = (scy * sw + scx) * 4;
                    var wt = weights[cy * side + cx];
                    r += src[srcOff] * wt;
                    g += src[srcOff + 1] * wt;
                    b += src[srcOff + 2] * wt;
                    a += src[srcOff + 3] * wt;
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
        }
    }
    return output;
};

// Aplica um filtro de escala de cinza na imagem
Filters.grayscale = function (pixels, args) {
    console.log(pixels);
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        // CIE luminance for the RGB
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
};

// Aumenta o brilho da imagem
Filters.brightness = function (pixels, adjustment) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        d[i] += adjustment;
        d[i + 1] += adjustment;
        d[i + 2] += adjustment;
    }
    return pixels;
};

// Aumenta a "potência" de uma determinada cor
Filters.saturation = function (pixels, values) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];

        d[i] *= values[0];
        d[i + 1] *= values[1];
        d[i + 2] *= values[2];
    }
    return pixels;
};

// Aplica um limiar na imagem
Filters.threshold = function (pixels, threshold) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        var n = 0;
        
        if (v >= threshold) {
            n = 255;
        }

        d[i] = d[i + 1] = d[i + 2] = n;
    }
    return pixels;
};

// Substitui o vermelho da imagem
Filters.findRed = function (pixels, margin, negate) {
    var d = pixels.data;

    if (margin == undefined) {
        margin = 1.3;
    }

    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];

        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        var isTarget = r > g * margin && r > b * margin;

        if (negate) {
            isTarget = !isTarget;
        }

        if (isTarget) {
            d[i] = d[i + 1] = d[i + 2] = v
        }
    }
    return pixels;
};

// Substitui o verde da imagem
Filters.replaceGreen = function (pixels, negate) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];

        var isTarget = g > r*1.1 && g > b*1.05;

        if (negate) {
            isTarget = !isTarget;
        }

        if (isTarget) {
            d[i] = g;
            d[i + 1] = r;
        }
    }
    return pixels;
};     

// Substitui o verde da imagem
Filters.removeBlue = function (pixels, negate) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];

        var isTarget = b > r*1.1 && b > g*1.1;

        if (negate) {
            isTarget = !isTarget;
        }

        if (isTarget) {
            d[i] = 0;
            d[i + 1] = 0;
            d[i + 2] = 0;
        }
    }
    return pixels;
}; 

Filters.tmpCanvas = document.createElement('canvas');
Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

Filters.createImageData = function (w, h) {
    return this.tmpCtx.createImageData(w, h);
};

Filters.applyOn = function (srcId, destId, filter, arg1, arg2, arg3) {
    var img = document.getElementById(srcId);
    var c = document.getElementById(destId);
    var idata = Filters.filterImage(filter, img, arg1, arg2, arg3);
    c.width = idata.width;
    c.height = idata.height;
    var ctx = c.getContext('2d');
    ctx.putImageData(idata, 0, 0);
};