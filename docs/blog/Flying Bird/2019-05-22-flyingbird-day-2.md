# Day 2: Collision Detection
Today, we implimented collision detection.  

The collision detection for the pipes were implimented using basic AABB collision.  We used Minkowski Difference because it is very cheap and simple.  I used [this tutorial](https://blog.hamaluik.ca/posts/simple-aabb-collision-using-minkowski-difference/) as a guide to create the collision logic.
```pascal
MIN_X = PLAYER.POSITION.X - (PIPE.POSITION.X + PIPE.SIZE.X)
MAX_X = PLAYER.POSITION.X + PLAYER.SIZE.X - PIPE.POSITION.X
MIN_Y = PLAYER.POSITION.Y - (PIPE.POSITION.Y + PIPE.SIZE.Y)
MAX_Y = PLAYER.POSITION.Y + PLAYER.SIZE.Y - PIPE.POSITION.Y

IF MIN_X < 0 AND MAX_X > 0 AND MIN_Y < 0 AND MAX_Y > 0
  KILL_PLAYER()
```
The collision response section was not implimented as we it was not necessary as when the player touches a pipe they instantly die.

Implimenting collision for the ground and ceiling was much easier to impliment because the ground and ceiling never moves.
```pascal
IF PLAYER.POSITION.Y > GROUND_Y OR PLAYER.POSITION.Y < 0
  KILL_PLAYER()
```




