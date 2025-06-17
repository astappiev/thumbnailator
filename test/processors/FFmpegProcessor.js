import assert from "assert";
import {createArguments} from "../../src/processors/FFmpegProcessor.js";

describe('Test FFmpegProcessor', function () {
    this.timeout(10000);

    describe('Test Arguments creation', function() {
        [
            [{}, '-y -i in.mp4 -vf thumbnail -frames:v 1 out.jpg'],
            [{width: 200}, '-y -i in.mp4 -vf thumbnail,scale=200:-1 -frames:v 1 out.jpg'],
            [{height: 200}, '-y -i in.mp4 -vf thumbnail,scale=-1:200 -frames:v 1 out.jpg'],
            [{height: 800, width: 640}, '-y -i in.mp4 -vf thumbnail,scale=w=640:h=800:force_original_aspect_ratio=decrease -frames:v 1 out.jpg'],
            [{height: 400, width: 400, crop: true}, '-y -i in.mp4 -vf thumbnail,scale=w=400:h=400:force_original_aspect_ratio=increase,crop=400:400 -frames:v 1 out.jpg'],
            [{height: 400, ignoreAspect: true}, '-y -i in.mp4 -vf thumbnail,scale=-1:400 -frames:v 1 out.jpg'],
            [{height: 400, width: 1200, oversize: true}, '-y -i in.mp4 -vf thumbnail,scale=w=1200:h=400:force_original_aspect_ratio=increase -frames:v 1 out.jpg'],
            [{height: 400, width: 400, ignoreAspect: true}, '-y -i in.mp4 -vf thumbnail,scale=w=400:h=400 -frames:v 1 out.jpg'],
            [{width: 1200, density: 300}, '-y -i in.mp4 -vf thumbnail,scale=1200:-1 -frames:v 1 out.jpg'],
        ].forEach(([options, expected]) => {
            it(`should return '${expected}' for options '${JSON.stringify(options)}'`, function() {
                assert.equal(createArguments('in.mp4', 'out.jpg', options).join(' '), expected);
            });
        });
    });
});
