---
author: Joon Suh
---
# Day 3: Even more Collison
#### Author: Joon Suh

##  The Problem
Now that you could shoot at the enemy, I now needed to create a collision detection algorithm for enemy bullets colliding with the player.  I had a few options here.  I could use AABB, SAT, the same method as the boats, or a new method.  Each method had ups and downs.

AABB would be fairly good as it is very efficent, especially because the player is axis aligned.  However, AABB would not provide any form of Continuous Collision Detection, which would mean if the framerate dipped, the bullet could quantum tunnel pass the player.  

SAT would not be useful as it is overkill.  It has no benefits.

Using the same method as the boat method is not ideal.  The collision detection algorithm for the player bullets were designed with bullets going relatively straight in mind.  If the bullets were to go in a more severe angle, the collision detection can cause unexpected collisions.

Because none of the above methods were fully ideal for my needs, I decided to create a new collision algorithm for the player.

##  The Solution
###  Overview
After struggling to find a fast CCD (continuous collision detection) algorithm, I realised that this could be done very simply because the bullets travelled in a straight line.  This meant that I could use the [formula for the distance from a point to a line](https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line).  
### Implimentation
**First we find the gradient at which the bullet is travelling.**  This is done simply by dividing its y-velocity by its x-velocity.

**Then we calculate the distance squared of the point from the line.**  We use distance squared to avoid a square root in the formula as square roots are horrendously expensive operations.

**If the player is close enough to the line, and the bullet's x-position is less than the player's  x-position, the bullet hit us!**