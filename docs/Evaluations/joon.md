# Joon Suh

The developement of our game was relatively succesful.  We had a rough plan for project roles and it mostly worked out.  The programming was relatively easy without any major issues.  I did find some difficulty balancing the game in its gameplay.  We also had some last minute issues involving Git where the entire project was breaking due to some merge conflicts. 


The plan for project roles went as following.  Geordie would create the engine and aid development whenever needed.  Finley would primariy be responsible for the assets for the games.  I would create most of the games.  This plan seemed to work out pretty well, with the workload *reasonably* spread out.  

Geordie's work was the same as our plan, working on backend elements such as the engine and website.  
Finley also did end up doing what he was told, which was to make art assets.  During the last two weeks, we asked him to create a game so we had more than 2 games but the game was lost during a Git incident.
My work extended a bit further than the plan.  When I needed a feature that was not currently part of the engine, I implimented it myself.  I also created the sound elements for the games using audio software.

As I was one of the primary game developers, I was responsible for most of the code for the games.  From designing and researching online, I learnt about many different interesting methods for different problems.  One of the most prominent being on how the way I was handling acceleration was incorrect where:
```python
speed += acceleration * deltaTime
position += speed * deltaTime
```
was incorrect and I was supposed to use:
```python
speed += 1/2 * acceleration * deltaTime
position += speed * deltaTime
speed += 1/2 * acceleration * deltaTime
```
instead.  Overall, the process of designing software solutions was not too difficult and most of the time spent was used for getting used to the engine.

I found the gameplay suprisingly difficult to balance.  What I thought was easy or balanced others found absurdly hard or found a way to abuse.  For example, in Stop the Boats: Battle, the Blitz mechanic was originally extremely spammable and this caused the game to break as you could cheese the entire game.  This showed me how much more thoroughly I needed to playtest my products.

We had some last minute issues with Git where Finley and/or I accidentally caused a few merge conflicts that rendered the game unplayable.  This resulted in the loss of Finley's game, Dino Guy, as we didn't have enough time to recover it.  This gave us some useful experience on why to be careful when using Git.

Overall, the project was somewhat succesful and we managed to overcome most of our problems without any issues.
 


