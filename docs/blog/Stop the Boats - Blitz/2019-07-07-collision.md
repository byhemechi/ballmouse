---
author: Joon Suh
---
# Day 2: Collision
**Author: Joon Suh**  
**Date: 2019 07 07**

## The Problem
One of the main challenges for creating this game was the collision.  Whereas in Flying Guy we could use AABB collision because all of the pipes were axis-aligned, in this game the boats would move in different angles.

The other collision detection method that is commonly used is the SAT method.  This would allow us to calculate collision with sloped surfaces.  However, this method is significantly more expensive, and also suffer from framerate dependance.  If the bullet passed through the boat completely in 1 frame, it would not collide with the boat.

I decided instead of using AABB and only making the boats move directly to the left; or use SAT, which would use up extra cycles; I would develop a specialised collision detection algorithm.  This method would be a modified SAT with the framerate dependance removed and several cycles saved.

## The Solution
### Overview
The solution that I came up with had a few shortcuts, with benefits and drawbacks to them.

**In this collision detection algorithm, if the bullet was behind the boat, it would collide.**  This would mean if the bullet passed through the boat in 1 frame, it would still collide, removing framerate dependancies.  

However, if the bullet was behind 2 boats, the boat created first would collide with the bullet but not the other.  This drawback should not be too much of an issue as boat created first would likely be infront anyways.

The way that collision was done was by creating lines as the walls of the boat, and colliding if the bullet is behind the line.  

### Method
**First we check if we are facing up or down.**  This is done because we need different calculations depending on our angle.  The code sniplets below all assume that we are facing up.

**Then, 3 y points are created, the top, the leftmost, and the bottom.**  These are the points on the front of the boat.  The rear point is not relevant to us, so we ignore it.
```typescript
const sin = -this.velocity.y;
const cos = -this.velocity.x;

var minY = this.position.y - (cos * this.size.y + -sin * this.size.x) / 2;
var midY = this.position.y + (-cos * this.size.y + -sin * this.size.x) / 2;
var maxY = this.position.y + (cos * this.size.y + -sin * this.size.x) / 2;
```
The sin and cos variables are the sin and cos values of the angle of the boat, which conveniently, are precalculated in our velocity vector.  The values are negative because the boat is heading towards the left so we make them positive.  

**Then we create lines of the boat walls.**  We use some more trigonometry magic to calculate equations for the front facing sides of the boat.
```typescript
const Ym1 = sin / cos; // Gradient is tan(x), which is sin(x)/cos(x)
const Yx1 = this.position.x + (cos * this.size.x - -sin * this.size.y) / 2; // Get the x value of the top point 
const Yb1 = minY - Ym1 * Yx1; // Calculate y when x is zero 

const Ym2 = -cos / sin; // Gradient is -cot(x), which is -cos(x)/sin(x)
const Yx2 = this.position.x - (-sin * this.size.x - cos * this.size.y) / 2; // Get the x value of the bottom point
const Yb2 = maxY - Ym2 * Yx2; // Calculate y when x is zero 
```
**From here on, we now check for each bullet.** The steps before this are only run once a frame.  This is done to minimise needless computation.

**Then we find what line the bullet is in.** We find which line we should compare the bullet with based off of the bullet's y position.

**Then we calculate where the bullet would be if it was on the line.** This means if the bullet's y position was inserted into the function of the side of the boat, what would the x position be?

**If the bullet is to the right of that value, we collided.**

