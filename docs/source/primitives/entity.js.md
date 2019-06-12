# entity.js
<a name="Entity"></a>

## Entity
Base Entity class, everything rendered most likely extends this.
Note: If you extend this and have a render function, you *MUST* call `super.render(ctx)`, else children will not render.

**Kind**: global class  

* [Entity](#Entity)
    * [new Entity(options)](#new_Entity_new)
    * [.render(ctx)](#Entity+render)

<a name="new_Entity_new"></a>

### new Entity(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the Entity. These vary based on what Entity is being created, but generally will have position, rotation and children. |
| options.position | <code>Vector</code> | Position vector, defaults to `(0,0)` |
| options.rotation | <code>number</code> | (Clockwise) Rotation in radians, defaults to `0` |
| options.visible | <code>bool</code> | Should the Entity (and its children) render |

<a name="Entity+render"></a>

### entity.render(ctx)
**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

