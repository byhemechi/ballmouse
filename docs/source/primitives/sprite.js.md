# sprite.js
<a name="Sprite"></a>

## Sprite ⇐ <code>Entity</code>
Sprite Entity

**Kind**: global class  
**Extends**: <code>Entity</code>  
<a name="new_Sprite_new"></a>

### new Sprite(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the Entity; See below |
| options.position | <code>Vector</code> | Position vector, defaults to `(0,0)` |
| options.rotation | <code>number</code> | (Clockwise) Rotation in radians, defaults to `0` |
| options.src | <code>String</code> | Path or image to draw; size will be discarded. |
| options.size | <code>Vector</code> | Size Vector, defaults to whatever size the image source is |
| [options.region] | <code>Object</code> | The section of the image to draw |
| [options.region.begin] | <code>Vector</code> | Top left corner of the clipping region |
| [options.region.size] | <code>Vector</code> | Size of the clipping region |

