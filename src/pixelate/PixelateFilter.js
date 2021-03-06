import vertex from '../fragments/default.vert';
import fragment from './pixelate.frag';

/**
 * This filter applies a pixelate effect making display objects appear 'blocky'.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|Array<number>|number} [size=10] Either the width/height of the size of the pixels, or square size
 */
export default class PixelateFilter extends PIXI.Filter {

    constructor(size = 10) {
        super(vertex, fragment);
        this.size = size; 
    }

    /**
     * This a point that describes the size of the blocks.
     * x is the width of the block and y is the height.
     *
     * @member {PIXI.Point|Array<number>|number}
     * @default 10
     */
    get size() {
        return this.uniforms.size;
    }
    set size(value) {
        if (typeof value === 'number') {
            value = [value, value];
        }
        this.uniforms.size = value;
    }
}
