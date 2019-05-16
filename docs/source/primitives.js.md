# primitives.js
## Classes

<dl>
<dt><a href="#Node">Node</a></dt>
<dd><p>Base node class, everything rendered most likely extends this.
Note: If you extend this and have a render function, you <em>MUST</em> call <code>super.render(ctx)</code>, else children will not render.</p>
</dd>
<dt><a href="#Rect">Rect</a> ⇐ <code><a href="#Node">Node</a></code></dt>
<dd><p>Rectangle Node</p>
</dd>
<dt><a href="#Sprite">Sprite</a> ⇐ <code><a href="#Node">Node</a></code></dt>
<dd><p>Sprite node</p>
</dd>
</dl>

<a name="Node"></a>

## Node
Base node class, everything rendered most likely extends this.
Note: If you extend this and have a render function, you *MUST* call `super.render(ctx)`, else children will not render.

**Kind**: global class  

* [Node](#Node)
    * [new Node(options)](#new_Node_new)
    * [.render(ctx)](#Node+render)

<a name="new_Node_new"></a>

### new Node(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the node. These vary based on what node is being created, but generally will have position, rotation and children. |
| options.position | <code>Vector</code> | Position vector, defaults to `(0,0)` |
| options.rotation | <code>number</code> | (Clockwise) Rotation in radians, defaults to `0` |

<a name="Node+render"></a>

### node.render(ctx)
**Kind**: instance method of [<code>Node</code>](#Node)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="Rect"></a>

## Rect ⇐ [<code>Node</code>](#Node)
Rectangle Node

**Kind**: global class  
**Extends**: [<code>Node</code>](#Node)  

* [Rect](#Rect) ⇐ [<code>Node</code>](#Node)
    * [new Rect(options)](#new_Rect_new)
    * [.render(ctx)](#Node+render)

<a name="new_Rect_new"></a>

### new Rect(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the node; See below |
| options.position | <code>Vector</code> | Position vector, defaults to `(0,0)` |
| options.rotation | <code>number</code> | (Clockwise) Rotation in radians, defaults to `0` |
| options.width | <code>number</code> | How wide the rectangle should be, defaults to `0` (zero width; invisible) |
| options.height | <code>number</code> | How tall the rectangle should be, defaults to `0` (zero height; invisible) |
| options.fill | <code>string</code> | What the rectangle should be filled with, defaults to `#000` (solid black) |

<a name="Node+render"></a>

### rect.render(ctx)
**Kind**: instance method of [<code>Rect</code>](#Rect)  
**Overrides**: [<code>render</code>](#Node+render)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="Sprite"></a>

## Sprite ⇐ [<code>Node</code>](#Node)
Sprite node

**Kind**: global class  
**Extends**: [<code>Node</code>](#Node)  

* [Sprite](#Sprite) ⇐ [<code>Node</code>](#Node)
    * [new Sprite(options)](#new_Sprite_new)
    * [.render(ctx)](#Node+render)

<a name="new_Sprite_new"></a>

### new Sprite(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the node; See below |
| options.position | <code>Vector</code> | Position vector, defaults to `(0,0)` |
| options.rotation | <code>number</code> | (Clockwise) Rotation in radians, defaults to `0` |
| options.image | <code>Image</code> | An image, either a `canvas`, `Image` or `<img>`. Size information will be discarded. |
| [options.rect] | <code>Object</code> | The section of the image to draw |
| [options.rect.begin] | <code>Vector</code> | Top left corner of the clipping region |
| [options.rect.end] | <code>Vector</code> | Bottom right corner of the clipping region |

<a name="Node+render"></a>

### sprite.render(ctx)
**Kind**: instance method of [<code>Sprite</code>](#Sprite)  
**Overrides**: [<code>render</code>](#Node+render)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

