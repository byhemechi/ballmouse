# sprite.js
<a name="Sprite"></a>

## Sprite ⇐ <code>Node</code>
Sprite node

**Kind**: global class  
**Extends**: <code>Node</code>  
<a name="new_Sprite_new"></a>

### new Sprite(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the node; See below |
| options.position | <code>Vector</code> | Position vector, defaults to `(0,0)` |
| options.rotation | <code>number</code> | (Clockwise) Rotation in radians, defaults to `0` |
| options.image | <code>Image</code> | An image, either a `canvas`, `Image` or `<img>`. Size information will be discarded. |
| options.size | <code>Vector</code> | Size Vector, defaults to whatever size the image source is |
| [options.region] | <code>Object</code> | The section of the image to draw |
| [options.region.begin] | <code>Vector</code> | Top left corner of the clipping region |
| [options.region.end] | <code>Vector</code> | Bottom right corner of the clipping region |

