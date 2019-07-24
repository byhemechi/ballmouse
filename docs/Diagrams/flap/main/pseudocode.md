# Root
## Main
Main game loop
```pascal
BEGIN MAIN
  SET timer TO 0
  SET score TO 0
  WHILE TRUE
    INCREASE timer BY 1
    SET spaceJustPressed TO S͟P͟A͟C͟E͟J͟U͟S͟T͟P͟R͟E͟S͟S͟E͟D͟
    IF timer > cloudSpawnTime
      A͟D͟D͟C͟L͟O͟U͟D͟S͟
    END IF
    M͟O͟V͟E͟C͟L͟O͟U͟D͟S͟
    
    IF (GameStarted)
      M͟O͟V͟E͟P͟L͟A͟Y͟E͟R͟
      M͟O͟V͟E͟P͟I͟P͟E͟S͟
      
      FOR EACH pipe IN pipes
        IF O͟V͟E͟R͟L͟A͟P͟S͟(pipe, player)
          E͟N͟D͟G͟A͟M͟E͟
          SET GameStarted TO False
        END IF
        
        IF pipe NOT passed
          IF playerPositionX > pipePositionX
            INCREASE score BY 1
            SET passed IN pipe TO True
          END IF
        END IF
      END FOR
      
      IF timer > pipeSpawnTime
        C͟R͟E͟A͟T͟E͟P͟I͟P͟E͟
      END IF
      
      IF timer > stateChangeTime
        C͟H͟A͟N͟G͟E͟G͟A͟M͟E͟S͟T͟A͟T͟E͟
      END IF
    END IF
  END WHILE
END MAIN
```
## Move Player, Move Pipes
Refer to pseudocode in respective folders
## Kill Player
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