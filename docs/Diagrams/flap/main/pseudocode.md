# Root
## Main
Main game loop
```pascal
BEGIN MAIN
  WHILE TRUE
    INCREASE timer BY 1
    SET spaceJustPressed TO S͟P͟A͟C͟E͟J͟U͟S͟T͟P͟R͟E͟S͟S͟E͟D͟
    IF timer > cloudSpawnTime
      A͟D͟D͟C͟L͟O͟U͟D͟
    END IF
    M͟O͟V͟E͟C͟L͟O͟U͟D͟S͟
    
    CASEWHERE: GameStarted
      M͟O͟V͟E͟P͟L͟A͟Y͟E͟R͟
      M͟O͟V͟E͟P͟I͟P͟E͟S͟
      
      C͟O͟L͟L͟I͟D͟E͟P͟L͟A͟Y͟E͟R͟A͟N͟D͟P͟I͟P͟E͟S͟
      
      IF timer > pipeSpawnTime
        C͟R͟E͟A͟T͟E͟P͟I͟P͟E͟
      END IF
      
      IF timer > stateChangeTime
        C͟H͟A͟N͟G͟E͟G͟A͟M͟E͟S͟T͟A͟T͟E͟
      END IF
    OTHERWISE:
      IF spaceJustPressed
        R͟E͟S͟E͟T͟
      END IF
    END CASE
  END WHILE
END MAIN
```
## Collide Player
```pascal
BEGIN COLLIDEPLAYERANDPIPES
  FOR EACH pipe IN pipes
    IF O͟V͟E͟R͟L͟A͟P͟S͟(pipe, player)
      E͟N͟D͟G͟A͟M͟E͟
      SET GameStarted TO False
      BREAK
    END IF
  END FOR
END COLLIDEPLAYERANDPIPES
```
## Move Player, Move Pipes
Refer to pseudocode in respective folders
## End Game
```pascal
BEGIN ENDGAME
  SET GameStarted TO False
  K͟I͟L͟L͟P͟L͟A͟Y͟E͟R͟
  S͟H͟A͟K͟E͟S͟C͟R͟E͟E͟N͟
END ENDGAME
```
## Overlaps
```pascal
BEGIN OVERLAPS(a, b)
  SET minX TO positionX OF a - positionX OF b + sizeX OF b < 0
  SET maxX TO positionX OF a + sizeX OF a - positionX OF b > 0
  SET minY TO positionY OF a - positionY OF b + sizeY OF b < 0
  SET maxY TO positionY OF a + sizeY OF a - positionY OF b > 0 
  
  IF minX < 0 AND maxX > 0 AND minY < 0 AND maxY > 0
    RETURN TRUE
  END IF
END OVERLAPS
```
## Reset
```pascal
BEGIN RESET
  SET timer TO 0
  SET score TO 0
  
  R͟E͟S͟E͟T͟P͟L͟A͟Y͟E͟R͟P͟O͟S͟I͟T͟I͟O͟N͟
  
  FOR EACH pipe IN pipes
    DELETE pipe
  END FOR
  
END RESET
```
## Space Just Pressed
```pascal
BEGIN SPACEJUSTPRESSED
  CASEWHERE: S͟P͟A͟C͟E͟P͟R͟E͟S͟S͟E͟D͟ AND NOT prevSpacePressed
    RETURN TRUE
  OTHERWISE:
    RETURN FALSE
  END CASE
  
  SET prevSpacePressed TO S͟P͟A͟C͟E͟P͟R͟E͟S͟S͟E͟D͟
END SPACEJUSTPRESSED
```
