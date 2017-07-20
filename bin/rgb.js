/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:28:58 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.__pixiFilters = {})));
}(this, (function (exports) { 'use strict';

if (typeof PIXI.Filter === 'undefined') { throw 'PixiJS is required'; }

var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

var fragment = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n";

/**
 * An RGB Split Filter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point} [red=[-10,0]] Red channel offset
 * @param {PIXI.Point} [green=[0, 10]] Green channel offset
 * @param {PIXI.Point} [blue=[0, 0]] Blue channel offset
 */
var RGBSplitFilter = (function (superclass) {
    function RGBSplitFilter(red, green, blue) {
        if ( red === void 0 ) red = [-10, 0];
        if ( green === void 0 ) green = [0, 10];
        if ( blue === void 0 ) blue = [0, 0];

        superclass.call(this, vertex, fragment);
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    if ( superclass ) RGBSplitFilter.__proto__ = superclass;
    RGBSplitFilter.prototype = Object.create( superclass && superclass.prototype );
    RGBSplitFilter.prototype.constructor = RGBSplitFilter;

    var prototypeAccessors = { red: {},green: {},blue: {} };

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.red.get = function () {
        return this.uniforms.red;
    };
    prototypeAccessors.red.set = function (value) {
        this.uniforms.red = value;
    };

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.green.get = function () {
        return this.uniforms.green;
    };
    prototypeAccessors.green.set = function (value) {
        this.uniforms.green = value;
    };

    /**
     * Blue offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.blue.get = function () {
        return this.uniforms.blue;
    };
    prototypeAccessors.blue.set = function (value) {
        this.uniforms.blue = value;
    };

    Object.defineProperties( RGBSplitFilter.prototype, prototypeAccessors );

    return RGBSplitFilter;
}(PIXI.Filter));

exports.RGBSplitFilter = RGBSplitFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=rgb.js.map
