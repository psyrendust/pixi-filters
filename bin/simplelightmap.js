/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:28:59 UTC
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

var vertex = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform float pixelWidth;\nuniform float pixelHeight;\nvec2 px = vec2(pixelWidth, pixelHeight);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    for (float angle = 0.; angle < PI * 2.; angle +=  + (1 / thickness).toFixed(7) + ) {\n        curColor = texture2D(uSampler, vec2(vTextureCoord.x + thickness * px.x * cos(angle), vTextureCoord.y + thickness * px.y * sin(angle)));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";

var fragment = "varying vec4 vColor;\nvarying vec2 vTextureCoord;\nuniform sampler2D u_texture; //diffuse map\nuniform sampler2D u_lightmap;   //light map\nuniform vec2 resolution; //resolution of screen\nuniform vec4 ambientColor; //ambient RGB, alpha channel is intensity\nvoid main() {\n    vec4 diffuseColor = texture2D(u_texture, vTextureCoord);\n    vec2 lighCoord = (gl_FragCoord.xy / resolution.xy);\n    vec4 light = texture2D(u_lightmap, vTextureCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vColor * vec4(finalColor, diffuseColor.a);\n}\n";

/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
* @param {PIXI.Texture} lightmapTexture a texture where your lightmap is rendered
* @param {Array<number>} ambientColor An RGBA array of the ambient color
* @param {Array<number>} [resolution=[1, 1]] An array for X/Y resolution
*
* @example
*  var lightmapTex = new PIXI.RenderTexture(renderer, 400, 300);
*
*  // ... render lightmap on lightmapTex
*
*  stageContainer.filters = [
*    new SimpleLightmapFilter(lightmapTex, [0.3, 0.3, 0.7, 0.5], [1.0, 1.0])
*  ];
*/
var SimpleLightmapFilter = (function (superclass) {
    function SimpleLightmapFilter(lightmapTexture, ambientColor, resolution) {
        if ( resolution === void 0 ) resolution = [1, 1];
    
        superclass.call(this, vertex, fragment);
        this.uniforms.u_lightmap = lightmapTexture;
        this.uniforms.resolution = new Float32Array(resolution);
        this.uniforms.ambientColor =  new Float32Array(ambientColor);
    }

    if ( superclass ) SimpleLightmapFilter.__proto__ = superclass;
    SimpleLightmapFilter.prototype = Object.create( superclass && superclass.prototype );
    SimpleLightmapFilter.prototype.constructor = SimpleLightmapFilter;

    var prototypeAccessors = { texture: {},color: {},resolution: {} };


    /**
     * a texture where your lightmap is rendered
     * @member {PIXI.Texture}
     */
    prototypeAccessors.texture.get = function () {
        return this.uniforms.u_lightmap;
    };
    prototypeAccessors.texture.set = function (value) {
        this.uniforms.u_lightmap = value;
    };

    /**
     * An RGBA array of the ambient color
     * @member {Array<number>}
     */
    prototypeAccessors.color.get = function () {
        return this.uniforms.ambientColor;
    };
    prototypeAccessors.color.set = function (value) {
        this.uniforms.ambientColor = new Float32Array(value);
    };

    /**
     * An array for X/Y resolution
     * @member {Array<number>}
     */
    prototypeAccessors.resolution.get = function () {
        return this.uniforms.resolution;
    };
    prototypeAccessors.resolution.set = function (value) {
        this.uniforms.resolution = new Float32Array(value);
    };

    Object.defineProperties( SimpleLightmapFilter.prototype, prototypeAccessors );

    return SimpleLightmapFilter;
}(PIXI.Filter));

exports.SimpleLightmapFilter = SimpleLightmapFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=simplelightmap.js.map
