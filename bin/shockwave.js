/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:29:00 UTC
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

var fragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nuniform vec2 center;\nuniform vec3 params; // 10.0, 0.8, 0.1\nuniform float time;\n\nvoid main()\n{\n    vec2 uv = vTextureCoord;\n    vec2 texCoord = uv;\n\n    float dist = distance(uv, center);\n\n    if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n    {\n        float diff = (dist - time);\n        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n\n        float diffTime = diff  * powDiff;\n        vec2 diffUV = normalize(uv - center);\n        texCoord = uv + (diffUV * diffTime);\n    }\n\n    gl_FragColor = texture2D(uSampler, texCoord);\n}\n";

/**
 * The ColorMatrixFilter class lets you apply a 4x4 matrix transformation on the RGBA
 * color and alpha values of every pixel on your displayObject to produce a result
 * with a new set of RGBA color and alpha values. It's pretty powerful!
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point} [center=[0.5, 0.5]] See center property
 * @param {Array<number>} [params=[10, 0.8, 0.1]] See params property
 * @param {number} [time=0] See time property
 */
var ShockwaveFilter = (function (superclass) {
    function ShockwaveFilter(center, params, time) {
        if ( center === void 0 ) center = [0.5, 0.5];
        if ( params === void 0 ) params = [10, 0.8, 0.1];
        if ( time === void 0 ) time = 0;

        superclass.call(this, vertex, fragment, {
            center: { type: 'v2', value: { x: 0.5, y: 0.5 } },
            params: { type: 'v3', value: { x: 10, y: 0.8, z: 0.1 } },
            time: { type: '1f', value: 0 }
        });

        this.center = center;
        this.params = params;
        this.time = time;
    }

    if ( superclass ) ShockwaveFilter.__proto__ = superclass;
    ShockwaveFilter.prototype = Object.create( superclass && superclass.prototype );
    ShockwaveFilter.prototype.constructor = ShockwaveFilter;

    var prototypeAccessors = { center: {},params: {},time: {} };

    /**
     * Sets the center of the shockwave in normalized screen coords. That is
     * (0,0) is the top-left and (1,1) is the bottom right.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.center.get = function () {
        return this.uniforms.center;
    };
    prototypeAccessors.center.set = function (value) {
        this.uniforms.center = value;
    };

    /**
     * Sets the params of the shockwave. These modify the look and behavior of
     * the shockwave as it ripples out.
     *
     * @member {Array<number>}
     */
    prototypeAccessors.params.get = function () {
        return this.uniforms.params;
    };
    prototypeAccessors.params.set = function (value) {
        this.uniforms.params = value;
    };

    /**
     * Sets the elapsed time of the shockwave. This controls the speed at which
     * the shockwave ripples out.
     *
     * @member {number}
     */
    prototypeAccessors.time.get = function () {
        return this.uniforms.time;
    };
    prototypeAccessors.time.set = function (value) {
        this.uniforms.time = value;
    };

    Object.defineProperties( ShockwaveFilter.prototype, prototypeAccessors );

    return ShockwaveFilter;
}(PIXI.Filter));

exports.ShockwaveFilter = ShockwaveFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=shockwave.js.map
