/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:28:46 UTC
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

var fragment = "uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nuniform vec4 dimensions;\nvarying vec2 vTextureCoord;\nvoid main()\n{\n    vec2 coord = vTextureCoord * dimensions.xy;\n    coord -= center;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius /     distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center;\n    gl_FragColor = texture2D(uSampler, coord / dimensions.xy);\n    vec2 clampedCoord = clamp(coord, vec2(0.0), dimensions.xy);\n    if (coord != clampedCoord) {\n    gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n";

/**
 * @author Julien CLEREL @JuloxRox
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/warp/bulgepinch.js by Evan Wallace : http://madebyevan.com/
 */
 
/**
 * Bulges or pinches the image in a circle.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|Array<number>} [center=[0,0]] The x and y coordinates of the center of the circle of effect.
 * @param {number} [radius=100] The radius of the circle of effect.
 * @param {number} [strength=1] -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
 */
var BulgePinchFilter = (function (superclass) {
    function BulgePinchFilter(center, radius, strength) {
        superclass.call(this, vertex, fragment);
        this.center = center || [0.5, 0.5];
        this.radius = radius || 100;
        this.strength = strength || 1;
    }

    if ( superclass ) BulgePinchFilter.__proto__ = superclass;
    BulgePinchFilter.prototype = Object.create( superclass && superclass.prototype );
    BulgePinchFilter.prototype.constructor = BulgePinchFilter;

    var prototypeAccessors = { radius: {},strength: {},center: {} };

    /**
     * The radius of the circle of effect.
     *
     * @member {number}
     */
    prototypeAccessors.radius.get = function () {
        return this.uniforms.radius;
    };
    prototypeAccessors.radius.set = function (value) {
        this.uniforms.radius = value;
    };

    /**
     * The strength of the effect. -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     *
     * @member {number}
     */
    prototypeAccessors.strength.get = function () {
        return this.uniforms.strength;
    };
    prototypeAccessors.strength.set = function (value) {
        this.uniforms.strength = value;
    };

    /**
     * The x and y coordinates of the center of the circle of effect.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.center.get = function () {
        return this.uniforms.center;
    };
    prototypeAccessors.center.set = function (value) {
        this.uniforms.center = value;
    };

    Object.defineProperties( BulgePinchFilter.prototype, prototypeAccessors );

    return BulgePinchFilter;
}(PIXI.Filter));

exports.BulgePinchFilter = BulgePinchFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=bulgepinch.js.map
