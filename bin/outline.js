/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:28:55 UTC
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

var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";

var fragment = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [thickness=1] The tickness of the outline. Make it 2 times more for resolution 2
 * @param {number} [color=0x000000] The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(9, 0xFF0000);
 */
var OutlineFilter = (function (superclass) {
    function OutlineFilter(thickness, color) {
        if ( thickness === void 0 ) thickness = 1;
        if ( color === void 0 ) color = 0x000000;

        superclass.call(this, vertex, fragment.replace(/%THICKNESS%/gi, (1.0 / thickness).toFixed(7)));
        this.thickness = thickness;
        this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);
        this.color = color;
    }

    if ( superclass ) OutlineFilter.__proto__ = superclass;
    OutlineFilter.prototype = Object.create( superclass && superclass.prototype );
    OutlineFilter.prototype.constructor = OutlineFilter;

    var prototypeAccessors = { color: {},thickness: {} };

    /**
     * The color of the glow.
     * @member {number}
     * @default 0x000000
     */
    prototypeAccessors.color.get = function () {
        return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
    };
    prototypeAccessors.color.set = function (value) {
        PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
    };

    /**
     * The tickness of the outline. Make it 2 times more for resolution 2
     * @member {number}
     * @default 1
     */
    prototypeAccessors.thickness.get = function () {
        return this.uniforms.thickness;
    };
    prototypeAccessors.thickness.set = function (value) {
        this.uniforms.thickness = value;
    };

    Object.defineProperties( OutlineFilter.prototype, prototypeAccessors );

    return OutlineFilter;
}(PIXI.Filter));

exports.OutlineFilter = OutlineFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=outline.js.map
