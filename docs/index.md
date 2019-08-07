# Ballmouse
## Overview
General documentation such as feasability is in [General](http://localhost:8000/General/feasability/).  
Diagrams such as flowcharts, pseudocode, data-flow diagram, structure charts, etc are in [Diagrams](http://localhost:8000/Diagrams/flap/structureChart/). change link later  
Daily Blogs are in [Blogs](http://localhost:8000/blog/2019-05-14-planning/).

When marking the code, most of the relevant code will be in /src/, and especially /src/objects/.  
/src/ contains everything involving the actual games and /src/objects/ contains the code for the different classes in the games, such as player, enemy, etc.  
/src/primitives/ contain the base types that the engine provides.  The most important being entity.ts, which every object inherits from.  It is responsible for allowing communicaton between different Entities in the scene.

While the code does have some comments, going into [Source](http://localhost:8000/ts/) will provide the comments in a much more organised form.  

