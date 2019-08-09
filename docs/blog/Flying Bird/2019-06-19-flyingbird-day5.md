subtitle: Forgot to blog day 3
# Day 4: Better Gravity
Today I realised that there was a major flaw with how I was handling velocities in this game.  This problem caused there to be framerate dependancies that would result in an unfair advantage to lower framerates.  

## The Problem
The previous method of movement was increasing both velocity and position linearly.  Because position was a quadratic, using linear incrementation would cause miscalculations as our framerate lowered.  
### Example of Previous Code (broken)
```typescript
velocity -= gravity * deltaTime;
position += velocity * deltaTime;
```
This method would break when we had a higher deltaTime and cause inaccuracies.
###  Broken Behaviour
```typescript
// Script
var acceleration = 5;
var velocity = 0;
var position = 0;

for (i = 0; i > 300; i += deltaTime) {
  velocity += acceleration * deltaTime;
  position += velocity * deltaTime;
}
```
In the code above, when deltaTime was 3, position would equal 227250.  But when deltaTime was 6, position would equal 229500.

To fix this problem, I researched for some solutions online and found [this](https://answers.unity.com/questions/829958/question-concerning-timedeltatime.html?childToView=830071#answer-830071) tutorial.  I analysed the given solution and implimented it into the game.
### Example of New Code (fixed)
```typescript
velocity -= 0.5 * gravity * deltaTime;
position += velocity * deltaTime;
velocity -= 0.5 * gravity * deltaTime;
```
The difference between the old and new method was that in the new method, we incremented velocity by half of gravity before and after incrementing position.  This meant that we increased velocity using the deltaTime of the previous and gives us much smoother movement.
### Fixed Behaviour
```typescript
// Script
var acceleration = 5;
var velocity = 0;
var position = 0;

for (i = 0; i > 300; i += deltaTime) {
  velocity += 0.5 * acceleration * deltaTime;
  position += velocity * deltaTime;
  velocity += 0.5 * acceleration * deltaTime;
}
```
In the script above, when deltaTime was 3, position was 225000.  When deltaTime was 6, position was also 225000.