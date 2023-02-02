import thumbnailator from "../../src/thumbnailator.js";
import {assertChecksum, getOut, getSample, getThumbnail} from "./../helpers.js";

describe('Test LibreOfficeProcessor', function () {
    this.timeout(10000);

    it(`create high-quality .odt preview`, async () => {
        const outPath = getOut('preview_ODT_100kB_hq.png');

        await thumbnailator(getSample('sample_ODT_100kB.odt'), outPath, { density: 300 });
        await assertChecksum(outPath, getThumbnail('preview_ODT_100kB_hq.png'));
    });

    it(`create high-quality .pdf preview`, async () => {
        const outPath = getOut('preview_PDF_114kB_hq.png');

        await thumbnailator(getSample('sample_PDF_114kB.pdf'), outPath, { density: 600 });
        await assertChecksum(outPath, getThumbnail('preview_PDF_114kB_hq.png'));
    });
});
