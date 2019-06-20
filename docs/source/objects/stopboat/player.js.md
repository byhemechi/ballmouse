# player.js
## Functions

<dl>
<dt><a href="#keyboardMove">keyboardMove()</a></dt>
<dd><p>Determine movement direction</p>
</dd>
<dt><a href="#clampPosition">clampPosition()</a></dt>
<dd><p>Clamp player position so they don&#39;t go off screen</p>
</dd>
<dt><a href="#incrementTimers">incrementTimers(delta)</a></dt>
<dd><p>Update timers for weapons and increment bullet queue</p>
</dd>
<dt><a href="#shoot">shoot()</a></dt>
<dd><p>Shoot bullets if we are able to</p>
</dd>
<dt><a href="#weaponSpread">weaponSpread()</a></dt>
<dd><p>Return a random angle for the bullets. Squares its output to make it more center heavy.</p>
</dd>
<dt><a href="#isShootJustPressed">isShootJustPressed()</a></dt>
<dd><p>Determine if we pressed shoot on this frame</p>
</dd>
</dl>

<a name="keyboardMove"></a>

## keyboardMove()
Determine movement direction

**Kind**: global function  
<a name="clampPosition"></a>

## clampPosition()
Clamp player position so they don't go off screen

**Kind**: global function  
<a name="incrementTimers"></a>

## incrementTimers(delta)
Update timers for weapons and increment bullet queue

**Kind**: global function  

| Param | Type |
| --- | --- |
| delta | <code>number</code> | 

<a name="shoot"></a>

## shoot()
Shoot bullets if we are able to

**Kind**: global function  
<a name="weaponSpread"></a>

## weaponSpread()
Return a random angle for the bullets. Squares its output to make it more center heavy.

**Kind**: global function  
<a name="isShootJustPressed"></a>

## isShootJustPressed()
Determine if we pressed shoot on this frame

**Kind**: global function  
