# Ballmouse
<a href='https://splorge.space/game'><img alt="Play Game"  src="https://img.shields.io/badge/play-game-green?color=ff7043&amp;style=for-the-badge"></a>

## Overview
Click "Play Game" to play game.

[Manual](/manual) is in the sidebar or the hyperlink.
!!! note
    The game Dino Guy is not available due to an incident with Git.  Because of this, there is no remaining evidence of the game's existance outside of daily logs.  

General documentation such as feasability is in [General](/General/feasibility/).  
Diagrams such as flowcharts, pseudocode, data-flow diagram, structure charts, etc are in [Diagrams](/Diagrams/). 
Daily Blogs are in [Blogs](/blog/2019-05-14-planning/).

When marking the code, most of the relevant code will be in /src/, and especially /src/objects/.  
/src/ contains everything involving the actual games and /src/objects/ contains the code for the different classes in the games, such as player, enemy, etc.  
/src/primitives/ contain the base types that the engine provides.  The most important being entity.ts, which every object inherits from.  It is responsible for allowing communicaton between different Entities in the scene.

While the code does have some comments, going into [Source](/ts/) will provide the comments in a much more organised form.  

