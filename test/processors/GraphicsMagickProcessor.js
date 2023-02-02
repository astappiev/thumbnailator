import assert from "assert";
import {createArguments, createImageGeometry} from "../../src/processors/GraphicsMagickProcessor.js";

describe('Test GraphicsMagickProcessor', function () {
    this.timeout(10000);

    describe('Test Geometry creation', function() {
        [
            [{}, 'x'], // looks like we need an additional check for this, but we have it in the caller
            [{scale: 200}, '200%'],
            [{width: 300}, '300x'],
            [{height: 400}, 'x400'],
            [{height: 400, scale: 150}, '150%'], // height is ignored
            [{height: 460, width: 320}, '320x460'],
            [{height: 400, ignoreAspect: true}, 'x400'],
            [{height: 400, width: 1200, oversize: true}, '1200x400^'],
            [{height: 400, width: 1200, oversize: false}, '1200x400'],
            [{height: 400, width: 400, ignoreAspect: true}, '400x400!'],
            [{width: 400, shrink: true}, '400x>'],
            [{width: 400, enlarge: true}, '400x<'],
            [{width: 400, shrink: true, enlarge: true}, '400x>'], // only one is supported
        ].forEach(([options, expected]) => {
            it(`should return '${expected}' for options '${JSON.stringify(options)}'`, function() {
                assert.equal(createImageGeometry(options), expected);
            });
        });
    });

    describe('Test Arguments creation', function() {
        [
            [{}, 'convert in.pdf[0] out.jpg'],
            [{crop: true}, 'convert in.pdf[0] out.jpg'], // crop is ignored because no size given
            [{scale: 200}, 'convert in.pdf[0] -resize 200% out.jpg'],
            [{width: 300, thumbnail: true}, 'convert in.pdf[0] -thumbnail 300x out.jpg'],
            [{height: 400, width: 400, crop: true}, 'convert in.pdf[0] -resize 400x400^ -gravity north -extent 400x400 out.jpg'],
            [{height: 400, ignoreAspect: true}, 'convert in.pdf[0] -resize x400 out.jpg'],
            [{height: 400, width: 1200, quality: 100}, 'convert in.pdf[0] -quality 100 -resize 1200x400 out.jpg'],
            [{height: 400, width: 1200, oversize: false, background: '#000000'}, 'convert in.pdf[0] -background #000000 -flatten -resize 1200x400 out.jpg'],
            [{height: 400, width: 400, ignoreAspect: true}, 'convert in.pdf[0] -resize 400x400! out.jpg'],
            [{width: 1200, density: 300}, 'convert -density 300 in.pdf[0] -resize 1200x out.jpg'],
        ].forEach(([options, expected]) => {
            it(`should return '${expected}' for options '${JSON.stringify(options)}'`, function() {
                assert.equal(createArguments('in.pdf', 'out.jpg', options).join(' '), expected);
            });
        });
    });
});
