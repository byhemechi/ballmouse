# root.js
## Functions

<dl>
<dt><a href="#newSlidingRandom">newSlidingRandom()</a></dt>
<dd><p>Create a random value smoothed by previous outputs</p>
</dd>
<dt><a href="#createPipe">createPipe(width, min, range, size, sprite, useSlidingRandom)</a></dt>
<dd><p>Creates a new pipe</p>
</dd>
<dt><a href="#isInitialJump">isInitialJump()</a></dt>
<dd><p>Check if this is the first framw where jump is pressed</p>
</dd>
<dt><a href="#updateScore">updateScore()</a></dt>
<dd><p>Update the score counter to reflect the current game state</p>
</dd>
<dt><a href="#addPipes">addPipes()</a></dt>
<dd><p>Add pipes where required</p>
</dd>
<dt><a href="#setState">setState()</a></dt>
<dd><p>Set the game state to the appropriate style (hoverbored or flap)</p>
</dd>
<dt><a href="#counters">counters(delta)</a></dt>
<dd><p>Update distance counters</p>
</dd>
<dt><a href="#ceiling_groundCollision">ceiling_groundCollision()</a></dt>
<dd><p>Check if the player is colliding with the ceiling or ground</p>
</dd>
<dt><a href="#pipeCollision">pipeCollision()</a></dt>
<dd><p>Check if the player is colliding with the pipes</p>
</dd>
<dt><a href="#reset">reset()</a></dt>
<dd><p>Reset the game back to its&#39; default state</p>
</dd>
</dl>

<a name="newSlidingRandom"></a>

## newSlidingRandom()
Create a random value smoothed by previous outputs

**Kind**: global function  
<a name="createPipe"></a>

## createPipe(width, min, range, size, sprite, useSlidingRandom)
Creates a new pipe

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | The size of the gap between pipes |
| min | <code>Number</code> | The minimum distance of bottom pipe from the top of the screen |
| range | <code>Number</code> | The range where the pipes can move |
| size | <code>Number</code> | Size of the hitbox for the pipe |
| sprite | <code>String</code> | Path to the sprite used for the pipe |
| useSlidingRandom | <code>bool</code> | Should the position be smoothed |

<a name="isInitialJump"></a>

## isInitialJump()
Check if this is the first framw where jump is pressed

**Kind**: global function  
<a name="updateScore"></a>

## updateScore()
Update the score counter to reflect the current game state

**Kind**: global function  
<a name="addPipes"></a>

## addPipes()
Add pipes where required

**Kind**: global function  
<a name="setState"></a>

## setState()
Set the game state to the appropriate style (hoverbored or flap)

**Kind**: global function  
<a name="counters"></a>

## counters(delta)
Update distance counters

**Kind**: global function  

| Param | Type |
| --- | --- |
| delta | <code>number</code> | 

<a name="ceiling_groundCollision"></a>

## ceiling\_groundCollision()
Check if the player is colliding with the ceiling or ground

**Kind**: global function  
<a name="pipeCollision"></a>

## pipeCollision()
Check if the player is colliding with the pipes

**Kind**: global function  
<a name="reset"></a>

## reset()
Reset the game back to its' default state

**Kind**: global function  
