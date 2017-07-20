/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:28:53 UTC
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

var fragment = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n";

/**
 * An RGB Split Filter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=5] Strength of the emboss.
 */
var EmbossFilter = (function (superclass) {
    function EmbossFilter(strength){
        if ( strength === void 0 ) strength = 5;

        superclass.call(this, vertex, fragment);
        this.strength = strength;
    }

    if ( superclass ) EmbossFilter.__proto__ = superclass;
    EmbossFilter.prototype = Object.create( superclass && superclass.prototype );
    EmbossFilter.prototype.constructor = EmbossFilter;

    var prototypeAccessors = { strength: {} };

    /**
     * Strength of emboss.
     *
     * @member {number}
     */
    prototypeAccessors.strength.get = function () {
        return this.uniforms.strength;
    };
    prototypeAccessors.strength.set = function (value) {
        this.uniforms.strength = value;
    };

    Object.defineProperties( EmbossFilter.prototype, prototypeAccessors );

    return EmbossFilter;
}(PIXI.Filter));

exports.EmbossFilter = EmbossFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=emboss.js.map
