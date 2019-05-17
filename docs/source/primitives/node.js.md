# node.js
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

