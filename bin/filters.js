/*!
 * pixi-filters - v1.0.8
 * Compiled Thu, 20 Jul 2017 15:28:40 UTC
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

var fragment = "varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}";

// TODO (cengler) - The Y is flipped in this shader for some reason.

/**
 * @author Vico @vicocotea
 * original shader : https://www.shadertoy.com/view/lssGDj by @movAX13h
 */

/**
 * An ASCII filter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [size=8] Size of the font
 */
var AsciiFilter = (function (superclass) {
    function AsciiFilter(size) {
        if ( size === void 0 ) size = 8;

        superclass.call(this, vertex, fragment);
        this.size = size;
    }

    if ( superclass ) AsciiFilter.__proto__ = superclass;
    AsciiFilter.prototype = Object.create( superclass && superclass.prototype );
    AsciiFilter.prototype.constructor = AsciiFilter;

    var prototypeAccessors = { size: {} };

    /**
     * The pixel size used by the filter.
     *
     * @member {number}
     */
    prototypeAccessors.size.get = function () {
        return this.uniforms.pixelSize;
    };
    prototypeAccessors.size.set = function (value) {
        this.uniforms.pixelSize = value;
    };

    Object.defineProperties( AsciiFilter.prototype, prototypeAccessors );

    return AsciiFilter;
}(PIXI.Filter));

var ref = PIXI.filters;
var BlurXFilter = ref.BlurXFilter;
var BlurYFilter = ref.BlurYFilter;
var VoidFilter = ref.VoidFilter;

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|PIXI.Point} [blur=2] Sets the strength of both the blurX and blurY properties simultaneously
 */
var BloomFilter = (function (superclass) {
    function BloomFilter(blur) {
        if ( blur === void 0 ) blur = 2;

        superclass.call(this);
        this.blurXFilter = new BlurXFilter();
        this.blurYFilter = new BlurYFilter();
        this.blurYFilter.blendMode = PIXI.BLEND_MODES.SCREEN;
        this.defaultFilter = new VoidFilter();

        if (typeof blur === 'number') {
            this.blur = blur;
        }
        else if (blur instanceof PIXI.Point) {
            this.blurX = blur.x;
            this.blurY = blur.y;
        }
    }

    if ( superclass ) BloomFilter.__proto__ = superclass;
    BloomFilter.prototype = Object.create( superclass && superclass.prototype );
    BloomFilter.prototype.constructor = BloomFilter;

    var prototypeAccessors = { blur: {},blurX: {},blurY: {} };

    BloomFilter.prototype.apply = function apply (filterManager, input, output) {
        var renderTarget = filterManager.getRenderTarget(true);

        //TODO - copyTexSubImage2D could be used here?
        this.defaultFilter.apply(filterManager, input, output);

        this.blurXFilter.apply(filterManager, input, renderTarget);
        this.blurYFilter.apply(filterManager, renderTarget, output);

        filterManager.returnRenderTarget(renderTarget);
    };

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blur.get = function () {
        return this.blurXFilter.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this.blurXFilter.blur = this.blurYFilter.blur = value;
    };

    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blurX.get = function () {
        return this.blurXFilter.blur;
    };
    prototypeAccessors.blurX.set = function (value) {
        this.blurXFilter.blur = value;
    };

    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blurY.get = function () {
        return this.blurYFilter.blur;
    };
    prototypeAccessors.blurY.set = function (value) {
        this.blurYFilter.blur = value;
    };

    Object.defineProperties( BloomFilter.prototype, prototypeAccessors );

    return BloomFilter;
}(PIXI.Filter));

var vertex$1 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";

var fragment$1 = "uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nuniform vec4 dimensions;\nvarying vec2 vTextureCoord;\nvoid main()\n{\n    vec2 coord = vTextureCoord * dimensions.xy;\n    coord -= center;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius /     distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center;\n    gl_FragColor = texture2D(uSampler, coord / dimensions.xy);\n    vec2 clampedCoord = clamp(coord, vec2(0.0), dimensions.xy);\n    if (coord != clampedCoord) {\n    gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n";

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
        superclass.call(this, vertex$1, fragment$1);
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

var vertex$2 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";

var fragment$2 = "varying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n";

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|Array<number>} [originalColor=0xFF0000] The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
 * @param {number|Array<number>} [newColor=0x000000] The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
 * @param {number} [epsilon=0.4] Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(
 *   [220/255.0, 220/255.0, 220/255.0],
 *   [225/255.0, 200/255.0, 215/255.0],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(0xdcdcdc, 0xe1c8d7, 0.001)];
 *
 */
var ColorReplaceFilter = (function (superclass) {
    function ColorReplaceFilter(originalColor, newColor, epsilon) {
        if ( originalColor === void 0 ) originalColor = 0xFF0000;
        if ( newColor === void 0 ) newColor = 0x000000;
        if ( epsilon === void 0 ) epsilon = 0.4;

        superclass.call(this, vertex$2, fragment$2);
        this.originalColor = originalColor;
        this.newColor = newColor;
        this.epsilon = epsilon;
    }

    if ( superclass ) ColorReplaceFilter.__proto__ = superclass;
    ColorReplaceFilter.prototype = Object.create( superclass && superclass.prototype );
    ColorReplaceFilter.prototype.constructor = ColorReplaceFilter;

    var prototypeAccessors = { originalColor: {},newColor: {},epsilon: {} };

    /**
     * The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
     * @member {number|Array<number>}
     * @default 0xFF0000
     */
    prototypeAccessors.originalColor.set = function (value) {
        var arr = this.uniforms.originalColor;
        if (typeof value === 'number') {
            PIXI.utils.hex2rgb(value, arr);
            this._originalColor = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._originalColor = PIXI.utils.rgb2hex(arr);
        }
    };
    prototypeAccessors.originalColor.get = function () {
        return this._originalColor;
    };

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>}
     * @default 0x000000
     */
    prototypeAccessors.newColor.set = function (value) {
        var arr = this.uniforms.newColor;
        if (typeof value === 'number') {
            PIXI.utils.hex2rgb(value, arr);
            this._newColor = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._newColor = PIXI.utils.rgb2hex(arr);
        }
    };
    prototypeAccessors.newColor.get = function () {
        return this._newColor;
    };

    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @member {number}
     * @default 0.4
     */
    prototypeAccessors.epsilon.set = function (value) {
        this.uniforms.epsilon = value;
    };
    prototypeAccessors.epsilon.get = function () {
        return this.uniforms.epsilon;
    };

    Object.defineProperties( ColorReplaceFilter.prototype, prototypeAccessors );

    return ColorReplaceFilter;
}(PIXI.Filter));

var fragment$3 = "precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n";

/**
 * The ConvolutionFilter class applies a matrix convolution filter effect.
 * A convolution combines pixels in the input image with neighboring pixels to produce a new image.
 * A wide variety of image effects can be achieved through convolutions, including blurring, edge
 * detection, sharpening, embossing, and beveling. The matrix should be specified as a 9 point Array.
 * See http://docs.gimp.org/en/plug-in-convmatrix.html for more info.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param matrix {number[]} An array of values used for matrix transformation. Specified as a 9 point Array.
 * @param width {number} Width of the object you are transforming
 * @param height {number} Height of the object you are transforming
 */
var ConvolutionFilter = (function (superclass) {
    function ConvolutionFilter(matrix, width, height) {
        superclass.call(this, vertex, fragment$3);
        this.matrix = matrix;
        this.width = width;
        this.height = height;
    }

    if ( superclass ) ConvolutionFilter.__proto__ = superclass;
    ConvolutionFilter.prototype = Object.create( superclass && superclass.prototype );
    ConvolutionFilter.prototype.constructor = ConvolutionFilter;

    var prototypeAccessors = { matrix: {},width: {},height: {} };

    /**
     * An array of values used for matrix transformation. Specified as a 9 point Array.
     *
     * @member {Array<number>}
     */
    prototypeAccessors.matrix.get = function () {
        return this.uniforms.matrix;
    };
    prototypeAccessors.matrix.set = function (value) {
        this.uniforms.matrix = new Float32Array(value);
    };

    /**
     * Width of the object you are transforming
     *
     * @member {number}
     */
    prototypeAccessors.width.get = function () {
        return 1/this.uniforms.texelSize[0];
    };
    prototypeAccessors.width.set = function (value) {
        this.uniforms.texelSize[0] = 1/value;
    };

    /**
     * Height of the object you are transforming
     *
     * @member {number}
     */
    prototypeAccessors.height.get = function () {
        return 1/this.uniforms.texelSize[1];
    };
    prototypeAccessors.height.set = function (value) {
        this.uniforms.texelSize[1] = 1/value;
    };

    Object.defineProperties( ConvolutionFilter.prototype, prototypeAccessors );

    return ConvolutionFilter;
}(PIXI.Filter));

var fragment$4 = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n";

/**
 * A Cross Hatch effect filter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
var CrossHatchFilter = (function (superclass) {
    function CrossHatchFilter() {
        superclass.call(this, vertex, fragment$4);
    }

    if ( superclass ) CrossHatchFilter.__proto__ = superclass;
    CrossHatchFilter.prototype = Object.create( superclass && superclass.prototype );
    CrossHatchFilter.prototype.constructor = CrossHatchFilter;

    return CrossHatchFilter;
}(PIXI.Filter));

var fragment$5 = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n";

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [scale=1] The scale of the effect.
 * @param {number} [angle=5] The radius of the effect.
 */
var DotFilter = (function (superclass) {
    function DotFilter(scale, angle) {
        if ( scale === void 0 ) scale = 1;
        if ( angle === void 0 ) angle = 5;

        superclass.call(this, vertex, fragment$5);
        this.scale = scale;
        this.angle = angle;
    }

    if ( superclass ) DotFilter.__proto__ = superclass;
    DotFilter.prototype = Object.create( superclass && superclass.prototype );
    DotFilter.prototype.constructor = DotFilter;

    var prototypeAccessors = { scale: {},angle: {} };

    /**
     * The scale of the effect.
     * @member {number}
     * @default 1
     */
    prototypeAccessors.scale.get = function () {
        return this.uniforms.scale;
    };
    prototypeAccessors.scale.set = function (value) {
        this.uniforms.scale = value;
    };

    /**
     * The radius of the effect.
     * @member {number}
     * @default 5
     */
    prototypeAccessors.angle.get = function () {
        return this.uniforms.angle;
    };
    prototypeAccessors.angle.set = function (value) {
        this.uniforms.angle = value;
    };

    Object.defineProperties( DotFilter.prototype, prototypeAccessors );

    return DotFilter;
}(PIXI.Filter));

var fragment$6 = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = vec4(color, sample.a > 0.0 ? alpha : 0.0);\n}";

/**
 * Drop shadow filter.
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [rotation=45] The angle of the shadow in degrees.
 * @param {number} [distance=5] Distance of shadow
 * @param {number} [blur=2] Blur of the shadow
 * @param {number} [color=0x000000] Color of the shadow
 * @param {number} [alpha=0.5] Alpha of the shadow
 */
var DropShadowFilter = (function (superclass) {
    function DropShadowFilter(rotation, distance, blur, color, alpha) {
        if ( rotation === void 0 ) rotation = 45;
        if ( distance === void 0 ) distance = 5;
        if ( blur === void 0 ) blur = 2;
        if ( color === void 0 ) color = 0x000000;
        if ( alpha === void 0 ) alpha = 0.5;

        superclass.call(this);

        this.tintFilter = new PIXI.Filter(vertex, fragment$6);
        this.blurFilter = new PIXI.filters.BlurFilter();
        this.blurFilter.blur = blur;

        this.rotation = rotation;
        this.padding = distance;
        this.distance = distance;
        this.alpha = alpha;
        this.color = color;
    }

    if ( superclass ) DropShadowFilter.__proto__ = superclass;
    DropShadowFilter.prototype = Object.create( superclass && superclass.prototype );
    DropShadowFilter.prototype.constructor = DropShadowFilter;

    var prototypeAccessors = { distance: {},rotation: {},blur: {},alpha: {},color: {} };

    DropShadowFilter.prototype.apply = function apply (filterManager, input, output) {
        var target = filterManager.getRenderTarget();
        target.clear();
        if (!output.root) {
            output.clear();
        }
        target.transform = new PIXI.Matrix();
        target.transform.translate(
            this.distance * Math.cos(this.angle), 
            this.distance * Math.sin(this.angle)
        );
        this.tintFilter.apply(filterManager, input, target);
        this.blurFilter.apply(filterManager, target, output);
        superclass.prototype.apply.call(this, filterManager, input, output);
        target.transform = null;
        filterManager.returnRenderTarget(target);
    };

    DropShadowFilter.prototype.updatePadding = function updatePadding () {
        this.padding = Math.max(this.distance, 10) * this.blur * 2;
    };

    /**
     * Distance offset of the shadow
     * @member {number}
     * @default 5
     */
    prototypeAccessors.distance.get = function () {
        return this._distance;
    };
    prototypeAccessors.distance.set = function (value) {
        this._distance = value;
        this.updatePadding();
    };

    /**
     * The angle of the shadow in degrees
     * @member {number}
     * @default 2
     */
    prototypeAccessors.rotation.get = function () {
        return this.angle / PIXI.DEG_TO_RAD;
    };
    prototypeAccessors.rotation.set = function (value) {
        this.angle = value * PIXI.DEG_TO_RAD;
    };

    /**
     * The blur of the shadow
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blur.get = function () {
        return this.blurFilter.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this.blurFilter.blur = value;
        this.updatePadding();
    };

    /**
     * The alpha of the shadow
     * @member {number}
     * @default 1
     */
    prototypeAccessors.alpha.get = function () {
        return this.tintFilter.uniforms.alpha;
    };
    prototypeAccessors.alpha.set = function (value) {
        this.tintFilter.uniforms.alpha = value;
    };

    /**
     * The color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    prototypeAccessors.color.get = function () {
        return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color);
    };
    prototypeAccessors.color.set = function (value) {
        PIXI.utils.hex2rgb(value, this.tintFilter.uniforms.color);
    };

    Object.defineProperties( DropShadowFilter.prototype, prototypeAccessors );

    return DropShadowFilter;
}(PIXI.Filter));

var fragment$7 = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n";

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

        superclass.call(this, vertex, fragment$7);
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

var vertex$3 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";

var fragment$8 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n";

/**
 * GlowFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/12756-glow-filter/?hl=mishaa#entry73578
 * http://codepen.io/mishaa/pen/raKzrm
 *
 * @class
 * 
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [distance=10] The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
 * @param {number} [outerStrength=4] The strength of the glow outward from the edge of the sprite.
 * @param {number} [innerStrength=0] The strength of the glow inward from the edge of the sprite.
 * @param {number} [color=0xffffff] The color of the glow.
 * @param {number} [quality=0.1] A number between 0 and 1 that describes the quality of the glow.
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter(15, 2, 1, 0xFF0000, 0.5)
 *  ];
 */
var GlowFilter = (function (superclass) {
    function GlowFilter(distance, outerStrength, innerStrength, color, quality) {
        if ( distance === void 0 ) distance = 10;
        if ( outerStrength === void 0 ) outerStrength = 4;
        if ( innerStrength === void 0 ) innerStrength = 0;
        if ( color === void 0 ) color = 0xffffff;
        if ( quality === void 0 ) quality = 0.1;

        superclass.call(this, vertex$3, fragment$8
            .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/%DIST%/gi, '' + distance.toFixed(7)));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
        this.distance = distance;
        this.color = color;
        this.outerStrength = outerStrength;
        this.innerStrength = innerStrength;
    }

    if ( superclass ) GlowFilter.__proto__ = superclass;
    GlowFilter.prototype = Object.create( superclass && superclass.prototype );
    GlowFilter.prototype.constructor = GlowFilter;

    var prototypeAccessors = { color: {},distance: {},outerStrength: {},innerStrength: {} };

    /**
     * The color of the glow.
     * @member {number}
     * @default 0xFFFFFF
     */
    prototypeAccessors.color.get = function () {
        return PIXI.utils.rgb2hex(this.uniforms.glowColor);
    };
    prototypeAccessors.color.set = function (value) {
        PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
    };

    /**
     * The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
     * @member {number}
     * @default 10
     */
    prototypeAccessors.distance.get = function () {
        return this.uniforms.distance;
    };
    prototypeAccessors.distance.set = function (value) {
        this.uniforms.distance = value;
    };

    /**
     * The strength of the glow outward from the edge of the sprite.
     * @member {number}
     * @default 4
     */
    prototypeAccessors.outerStrength.get = function () {
        return this.uniforms.outerStrength;
    };
    prototypeAccessors.outerStrength.set = function (value) {
        this.uniforms.outerStrength = value;
    };

    /**
     * The strength of the glow inward from the edge of the sprite.
     * @member {number}
     * @default 0
     */
    prototypeAccessors.innerStrength.get = function () {
        return this.uniforms.innerStrength;
    };
    prototypeAccessors.innerStrength.set = function (value) {
        this.uniforms.innerStrength = value;
    };

    Object.defineProperties( GlowFilter.prototype, prototypeAccessors );

    return GlowFilter;
}(PIXI.Filter));

var vertex$4 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";

var fragment$9 = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";

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

        superclass.call(this, vertex$4, fragment$9.replace(/%THICKNESS%/gi, (1.0 / thickness).toFixed(7)));
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

var fragment$10 = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n";

/**
 * This filter applies a pixelate effect making display objects appear 'blocky'.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|Array<number>|number} [size=10] Either the width/height of the size of the pixels, or square size
 */
var PixelateFilter = (function (superclass) {
    function PixelateFilter(size) {
        if ( size === void 0 ) size = 10;

        superclass.call(this, vertex, fragment$10);
        this.size = size; 
    }

    if ( superclass ) PixelateFilter.__proto__ = superclass;
    PixelateFilter.prototype = Object.create( superclass && superclass.prototype );
    PixelateFilter.prototype.constructor = PixelateFilter;

    var prototypeAccessors = { size: {} };

    /**
     * This a point that describes the size of the blocks.
     * x is the width of the block and y is the height.
     *
     * @member {PIXI.Point|Array<number>|number}
     * @default 10
     */
    prototypeAccessors.size.get = function () {
        return this.uniforms.size;
    };
    prototypeAccessors.size.set = function (value) {
        if (typeof value === 'number') {
            value = [value, value];
        }
        this.uniforms.size = value;
    };

    Object.defineProperties( PixelateFilter.prototype, prototypeAccessors );

    return PixelateFilter;
}(PIXI.Filter));

var fragment$11 = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n";

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

        superclass.call(this, vertex, fragment$11);
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

var fragment$12 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nuniform vec2 center;\nuniform vec3 params; // 10.0, 0.8, 0.1\nuniform float time;\n\nvoid main()\n{\n    vec2 uv = vTextureCoord;\n    vec2 texCoord = uv;\n\n    float dist = distance(uv, center);\n\n    if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n    {\n        float diff = (dist - time);\n        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n\n        float diffTime = diff  * powDiff;\n        vec2 diffUV = normalize(uv - center);\n        texCoord = uv + (diffUV * diffTime);\n    }\n\n    gl_FragColor = texture2D(uSampler, texCoord);\n}\n";

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

        superclass.call(this, vertex, fragment$12, {
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

var vertex$5 = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform float pixelWidth;\nuniform float pixelHeight;\nvec2 px = vec2(pixelWidth, pixelHeight);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    for (float angle = 0.; angle < PI * 2.; angle +=  + (1 / thickness).toFixed(7) + ) {\n        curColor = texture2D(uSampler, vec2(vTextureCoord.x + thickness * px.x * cos(angle), vTextureCoord.y + thickness * px.y * sin(angle)));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";

var fragment$13 = "varying vec4 vColor;\nvarying vec2 vTextureCoord;\nuniform sampler2D u_texture; //diffuse map\nuniform sampler2D u_lightmap;   //light map\nuniform vec2 resolution; //resolution of screen\nuniform vec4 ambientColor; //ambient RGB, alpha channel is intensity\nvoid main() {\n    vec4 diffuseColor = texture2D(u_texture, vTextureCoord);\n    vec2 lighCoord = (gl_FragCoord.xy / resolution.xy);\n    vec4 light = texture2D(u_lightmap, vTextureCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vColor * vec4(finalColor, diffuseColor.a);\n}\n";

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
    
        superclass.call(this, vertex$5, fragment$13);
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

var fragment$14 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n";

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftAxisFilter = (function (superclass) {
    function TiltShiftAxisFilter(blur, gradientBlur, start, end){
        if ( blur === void 0 ) blur = 100;
        if ( gradientBlur === void 0 ) gradientBlur = 600;
        if ( start === void 0 ) start = null;
        if ( end === void 0 ) end = null;

        superclass.call(this, vertex, fragment$14);
        this.uniforms.blur = blur;
        this.uniforms.gradientBlur = gradientBlur;
        this.uniforms.start = start || new PIXI.Point(0, window.innerHeight / 2);
        this.uniforms.end = end || new PIXI.Point(600, window.innerHeight / 2);
        this.uniforms.delta = new PIXI.Point(30, 30);
        this.uniforms.texSize = new PIXI.Point(window.innerWidth, window.innerHeight);
        this.updateDelta();
    }

    if ( superclass ) TiltShiftAxisFilter.__proto__ = superclass;
    TiltShiftAxisFilter.prototype = Object.create( superclass && superclass.prototype );
    TiltShiftAxisFilter.prototype.constructor = TiltShiftAxisFilter;

    var prototypeAccessors = { blur: {},gradientBlur: {},start: {},end: {} };

    /**
     * Updates the filter delta values.
     * This is overridden in the X and Y filters, does nothing for this class.
     *
     */
    TiltShiftAxisFilter.prototype.updateDelta = function updateDelta () {
        this.uniforms.delta.x = 0;
        this.uniforms.delta.y = 0;
    };

    /**
     * The strength of the blur.
     *
     * @member {number}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.blur.get = function () {
        return this.uniforms.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this.uniforms.blur = value;
    };

    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.gradientBlur.get = function () {
        return this.uniforms.gradientBlur;
    };
    prototypeAccessors.gradientBlur.set = function (value) {
        this.uniforms.gradientBlur = value;
    };

    /**
     * The X value to start the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.start.get = function () {
        return this.uniforms.start;
    };
    prototypeAccessors.start.set = function (value) {
        this.uniforms.start = value;
        this.updateDelta();
    };

    /**
     * The X value to end the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.end.get = function () {
        return this.uniforms.end;
    };
    prototypeAccessors.end.set = function (value) {
        this.uniforms.end = value;
        this.updateDelta();
    };

    Object.defineProperties( TiltShiftAxisFilter.prototype, prototypeAccessors );

    return TiltShiftAxisFilter;
}(PIXI.Filter));

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShiftXFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftXFilter = (function (TiltShiftAxisFilter$$1) {
    function TiltShiftXFilter () {
        TiltShiftAxisFilter$$1.apply(this, arguments);
    }

    if ( TiltShiftAxisFilter$$1 ) TiltShiftXFilter.__proto__ = TiltShiftAxisFilter$$1;
    TiltShiftXFilter.prototype = Object.create( TiltShiftAxisFilter$$1 && TiltShiftAxisFilter$$1.prototype );
    TiltShiftXFilter.prototype.constructor = TiltShiftXFilter;

    TiltShiftXFilter.prototype.updateDelta = function updateDelta () {
        var dx = this.uniforms.end.x - this.uniforms.start.x;
        var dy = this.uniforms.end.y - this.uniforms.start.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        this.uniforms.delta.x = dx / d;
        this.uniforms.delta.y = dy / d;
    };

    return TiltShiftXFilter;
}(TiltShiftAxisFilter));

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShiftYFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftYFilter = (function (TiltShiftAxisFilter$$1) {
    function TiltShiftYFilter () {
        TiltShiftAxisFilter$$1.apply(this, arguments);
    }

    if ( TiltShiftAxisFilter$$1 ) TiltShiftYFilter.__proto__ = TiltShiftAxisFilter$$1;
    TiltShiftYFilter.prototype = Object.create( TiltShiftAxisFilter$$1 && TiltShiftAxisFilter$$1.prototype );
    TiltShiftYFilter.prototype.constructor = TiltShiftYFilter;

    TiltShiftYFilter.prototype.updateDelta = function updateDelta () {
        var dx = this.uniforms.end.x - this.uniforms.start.x;
        var dy = this.uniforms.end.y - this.uniforms.start.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        this.uniforms.delta.x = -dy / d;
        this.uniforms.delta.y = dx / d;
    };

    return TiltShiftYFilter;
}(TiltShiftAxisFilter));

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShift Filter. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [blur=100] The strength of the blur.
 * @param {number} [gradientBlur=600] The strength of the gradient blur.
 * @param {PIXI.Point} [start=null] The Y value to start the effect at.
 * @param {PIXI.Point} [end=null] The Y value to end the effect at.
 */
var TiltShiftFilter = (function (superclass) {
    function TiltShiftFilter(blur, gradientBlur, start, end) {
        if ( blur === void 0 ) blur = 100;
        if ( gradientBlur === void 0 ) gradientBlur = 600;
        if ( start === void 0 ) start = null;
        if ( end === void 0 ) end = null;

        superclass.call(this);
        this.tiltShiftXFilter = new TiltShiftXFilter(blur, gradientBlur, start, end);
        this.tiltShiftYFilter = new TiltShiftYFilter(blur, gradientBlur, start, end);
    }

    if ( superclass ) TiltShiftFilter.__proto__ = superclass;
    TiltShiftFilter.prototype = Object.create( superclass && superclass.prototype );
    TiltShiftFilter.prototype.constructor = TiltShiftFilter;

    var prototypeAccessors = { blur: {},gradientBlur: {},start: {},end: {} };

    TiltShiftFilter.prototype.apply = function apply (filterManager, input, output) {
        var renderTarget = filterManager.getRenderTarget(true);
        this.tiltShiftXFilter.apply(filterManager, input, renderTarget);
        this.tiltShiftYFilter.apply(filterManager, renderTarget, output);
        filterManager.returnRenderTarget(renderTarget);
    };

    /**
     * The strength of the blur.
     *
     * @member {number}
     */
    prototypeAccessors.blur.get = function () {
        return this.tiltShiftXFilter.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = value;
    };

    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     */
    prototypeAccessors.gradientBlur.get = function () {
        return this.tiltShiftXFilter.gradientBlur;
    };
    prototypeAccessors.gradientBlur.set = function (value) {
        this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = value;
    };

    /**
     * The Y value to start the effect at.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.start.get = function () {
        return this.tiltShiftXFilter.start;
    };
    prototypeAccessors.start.set = function (value) {
        this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = value;
    };

    /**
     * The Y value to end the effect at.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.end.get = function () {
        return this.tiltShiftXFilter.end;
    };
    prototypeAccessors.end.set = function (value) {
        this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = value;
    };

    Object.defineProperties( TiltShiftFilter.prototype, prototypeAccessors );

    return TiltShiftFilter;
}(PIXI.Filter));

var fragment$15 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n";

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

        superclass.call(this, vertex, fragment$15);

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

exports.AsciiFilter = AsciiFilter;
exports.BloomFilter = BloomFilter;
exports.BulgePinchFilter = BulgePinchFilter;
exports.ColorReplaceFilter = ColorReplaceFilter;
exports.ConvolutionFilter = ConvolutionFilter;
exports.CrossHatchFilter = CrossHatchFilter;
exports.DotFilter = DotFilter;
exports.DropShadowFilter = DropShadowFilter;
exports.EmbossFilter = EmbossFilter;
exports.GlowFilter = GlowFilter;
exports.OutlineFilter = OutlineFilter;
exports.PixelateFilter = PixelateFilter;
exports.RGBSplitFilter = RGBSplitFilter;
exports.ShockwaveFilter = ShockwaveFilter;
exports.SimpleLightmapFilter = SimpleLightmapFilter;
exports.TiltShiftFilter = TiltShiftFilter;
exports.TiltShiftAxisFilter = TiltShiftAxisFilter;
exports.TiltShiftXFilter = TiltShiftXFilter;
exports.TiltShiftYFilter = TiltShiftYFilter;
exports.TwistFilter = TwistFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, __pixiFilters);

})));
//# sourceMappingURL=filters.js.map
