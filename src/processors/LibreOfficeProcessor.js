import {exec, randGuid, tempPath} from "../utils/utils.js";
import AbstractProcessor from "./AbstractProcessor.js";
import fsPromises from "fs/promises";
import path from "path";

export default class LibreOfficeProcessor extends AbstractProcessor {

    async process(generate, input, output, options) {
        const cacheId = randGuid();
        const cacheDir = tempPath(cacheId);
        await fsPromises.mkdir(cacheDir);

        const inputBasename = path.basename(input);
        const inputWithoutExt = inputBasename.substring(0, inputBasename.lastIndexOf('.'));
        const tempPDF = path.join(cacheDir, inputWithoutExt + '.pdf');
        await exec('libreoffice', [
            '--headless',
            '--convert-to', 'pdf:writer_pdf_Export', input,
            '--outdir', cacheDir,
            // '-env:UserInstallation=file:///tmp/LibreOffice_Conversion_' + cacheId
        ]);
        await generate(tempPDF, output, options);
        await fsPromises.rm(cacheDir, {recursive: true, force: true});
    }

    getSupportedMimeTypes() {
        return [
            "application/vnd.oasis.opendocument.chart",
            "application/vnd.oasis.opendocument.chart-template",
            "application/vnd.oasis.opendocument.formula",
            "application/vnd.oasis.opendocument.formula-template",
            "application/vnd.oasis.opendocument.graphics",
            "application/vnd.oasis.opendocument.graphics-template",
            "application/vnd.oasis.opendocument.graphics-flat-xml",
            "application/vnd.oasis.opendocument.presentation",
            "application/vnd.oasis.opendocument.presentation-template",
            "application/vnd.oasis.opendocument.presentation-flat-xml",
            "application/vnd.oasis.opendocument.spreadsheet",
            "application/vnd.oasis.opendocument.spreadsheet-template",
            "application/vnd.oasis.opendocument.spreadsheet-flat-xml",
            "application/vnd.oasis.opendocument.text",
            "application/vnd.oasis.opendocument.text-flat-xml",
            "application/vnd.oasis.opendocument.text-master",
            "application/vnd.oasis.opendocument.text-template",
            "application/vnd.oasis.opendocument.text-master-template",
            "application/vnd.oasis.opendocument.text-web",

            "application/vnd.sun.xml.calc",
            "application/vnd.sun.xml.calc.template",
            "application/vnd.sun.xml.chart",
            "application/vnd.sun.xml.draw",
            "application/vnd.sun.xml.draw.template",
            "application/vnd.sun.xml.impress",
            "application/vnd.sun.xml.impress.template",
            "application/vnd.sun.xml.math",
            "application/vnd.sun.xml.writer",
            "application/vnd.sun.xml.writer.global",
            "application/vnd.sun.xml.writer.template",
            "application/vnd.sun.xml.writer.web",

            "application/rtf",
            "text/rtf",
            "application/msword",
            "application/vnd.ms-powerpoint",
            "application/vnd.ms-excel",
            "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
            "application/vnd.ms-excel.sheet.macroEnabled.12",
            "application/vnd.ms-excel.template.macroEnabled.12",
            "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
            "application/vnd.ms-powerpoint.slide.macroEnabled.12",
            "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
            "application/vnd.ms-powerpoint.template.macroEnabled.12",
            "application/vnd.ms-word.document.macroEnabled.12",
            "application/vnd.ms-word.template.macroEnabled.12",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.openxmlformats-officedocument.presentationml.template",
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
            "application/vnd.openxmlformats-officedocument.presentationml.slide",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
            "application/vnd.visio",
            "application/visio.drawing",
            "application/vnd.visio2013",
            "application/vnd.visio.xml",
            "application/x-mspublisher",

            "application/wps-office.doc",
            "application/wps-office.docx",
            "application/wps-office.xls",
            "application/wps-office.xlsx",
            "application/wps-office.ppt",
            "application/wps-office.pptx",

            "application/xhtml+xml",
            "application/mathml+xml",
            "text/html",
            "application/docbook+xml",

            "text/csv",
            "text/spreadsheet",
            "application/x-qpro",
            "application/x-dbase",
            "application/vnd.corel-draw",
            "application/vnd.lotus-wordpro",
            "application/vnd.lotus-1-2-3",
            "application/vnd.wordperfect",
            "application/wordperfect5.1",
            "application/vnd.ms-works",
            "application/clarisworks",
            "application/macwriteii",
            "application/vnd.apple.keynote",
            "application/vnd.apple.numbers",
            "application/vnd.apple.pages",
            "application/x-iwork-keynote-sffkey",
            "application/x-iwork-numbers-sffnumbers",
            "application/x-iwork-pages-sffpages",
            "application/x-hwp",
            "application/x-aportisdoc",
            "application/prs.plucker",
            "application/vnd.palm",
            "application/x-sony-bbeb",
            "application/x-pocket-word",
            "application/x-t602",
            "application/x-fictionbook+xml",
            "application/x-abiword",
            "application/x-pagemaker",
            "application/x-gnumeric",
            "application/vnd.stardivision.calc",
            "application/vnd.stardivision.draw",
            "application/vnd.stardivision.writer",
            "application/x-starcalc",
            "application/x-stardraw",
            "application/x-starwriter",

            "image/x-freehand",
            "image/x-sgf",
            "image/x-svm",
            "image/x-cmx",
            "image/x-met",
            "image/x-wpg",
            "image/vnd.adobe.photoshop",
        ];
    }
}
