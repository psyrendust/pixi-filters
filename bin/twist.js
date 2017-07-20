/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:29:03 UTC
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

var fragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n";

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [radius=200] The radius of the twist.
 * @param {number} [angle=4] The angle of the twist.
 * @param {number} [padding=20] Padding for filter area.
 */
var TwistFilter = (function (superclass) {
    function TwistFilter(radius, angle, padding) {
        if ( radius === void 0 ) radius = 200;
        if ( angle === void 0 ) angle = 4;
        if ( padding === void 0 ) padding = 20;

        superclass.call(this, vertex, fragment);

        this.radius = radius;
        this.angle = angle;
        this.padding = padding;
    }

    if ( superclass ) TwistFilter.__proto__ = superclass;
    TwistFilter.prototype = Object.create( superclass && superclass.prototype );
    TwistFilter.prototype.constructor = TwistFilter;

    var prototypeAccessors = { offset: {},radius: {},angle: {} };

    /**
     * This point describes the the offset of the twist.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.offset.get = function () {
        return this.uniforms.offset;
    };
    prototypeAccessors.offset.set = function (value) {
        this.uniforms.offset = value;
    };

    /**
     * The radius of the twist.
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
     * The angle of the twist.
     *
     * @member {number}
     */
    prototypeAccessors.angle.get = function () {
        return this.uniforms.angle;
    };
    prototypeAccessors.angle.set = function (value) {
        this.uniforms.angle = value;
    };

    Object.defineProperties( TwistFilter.prototype, prototypeAccessors );

    return TwistFilter;
}(PIXI.Filter));

exports.TwistFilter = TwistFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=twist.js.map
