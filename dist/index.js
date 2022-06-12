"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartJSNodeCanvas = void 0;
const lib_1 = require("skia-canvas/lib");
class ChartJSNodeCanvas {
    /**
     * Create a new instance of CanvasRenderService.
     *
     * @param options Configuration for this instance
     */
    constructor(options) {
        if (options === null || typeof (options) !== 'object') {
            throw new Error('An options parameter object is required');
        }
        if (!options.width || typeof (options.width) !== 'number') {
            throw new Error('A width option is required');
        }
        if (!options.height || typeof (options.height) !== 'number') {
            throw new Error('A height option is required');
        }
        this._width = options.width;
        this._height = options.height;
        this._image = lib_1.Image;
        this._type = options.type && options.type.toLowerCase();
        this._chartJs = this.initialize(options);
    }
    /**
     * Render to a data url.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format, `image/png` or `image/jpeg`.
     */
    renderToDataURL(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            if (!chart.canvas) {
                return reject(new Error('Canvas is null'));
            }
            const canvas = chart.canvas;
            canvas.toDataURL(mimeType, (error, png) => {
                chart.destroy();
                if (error) {
                    return reject(error);
                }
                return resolve(png);
            });
        });
    }
    /**
     * Render to a data url synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format, `image/png` or `image/jpeg`.
     */
    renderToDataURLSync(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        if (!chart.canvas) {
            throw new Error('Canvas is null');
        }
        const canvas = chart.canvas;
        const dataUrl = canvas.toDataURL(mimeType);
        chart.destroy();
        return dataUrl;
    }
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToBuffer(configuration) {
        const chart = this.renderChart(configuration);
        return chart.canvas.toBuffer('png');
    }
    /**
     * Render to a buffer synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToBufferSync(configuration) {
        const chart = this.renderChart(configuration);
        return chart.canvas.toBufferSync('png');
    }
    /**
     * Use to register the font with Canvas to use a font file that is not installed as a system font, this must be done before the Canvas is created.
     *
     * @param path The path to the font file.
     * @param options The font options.
     * @example
     * registerFont('comicsans.ttf', { family: 'Comic Sans' });
     */
    registerFont(path, options) {
        lib_1.FontLibrary.use(options.family, [path]);
    }
    initialize(options) {
        const chartJs = require('chart.js');
        if (options.chartCallback) {
            options.chartCallback(chartJs);
        }
        delete require.cache[require.resolve('chart.js')];
        return chartJs;
    }
    renderChart(configuration) {
        const canvas = new lib_1.Canvas(this._width, this._height);
        canvas.style = canvas.style || {};
        // Disable animation (otherwise charts will throw exceptions)
        configuration.options = configuration.options || {};
        configuration.options.responsive = false;
        configuration.options.animation = false;
        const context = canvas.getContext('2d');
        global.Image = this._image; // Some plugins use this API
        const chart = new this._chartJs(context, configuration);
        delete global.Image;
        return chart;
    }
}
exports.ChartJSNodeCanvas = ChartJSNodeCanvas;
//# sourceMappingURL=index.js.map