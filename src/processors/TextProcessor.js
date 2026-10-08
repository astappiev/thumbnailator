import LibreOfficeProcessor from "./LibreOfficeProcessor.js";

/**
 * Renders plain text and source files as is, using LibreOffice with the plain text import filter.
 * Without the filter, some types (e.g. XML) would be interpreted instead of showing their content.
 */
export default class TextProcessor extends LibreOfficeProcessor {

    getInputFilter() {
        return 'Text (encoded):UTF8,LF,,,';
    }

    getSupportedMimeTypes() {
        return [
            "text/plain",
            "text/markdown",
            "text/x-markdown",
            "text/x-rst",
            "text/xml",
            "application/xml",
            "application/json",
            "text/javascript",
            "application/javascript",
            "text/css",
            "text/yaml",
            "application/x-yaml",
            "application/x-sh",
            "text/x-python",
            "application/sql",
            "application/x-sql",
        ];
    }
}
