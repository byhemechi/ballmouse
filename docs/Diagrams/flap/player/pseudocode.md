# Pseudocode
## Player
Main player loop
```pascal
BEGIN PLAYER
  WHILE Player IS ALIVE
    SET spaceJustPressed TO S͟P͟A͟C͟E͟J͟U͟S͟T͟P͟R͟E͟S͟S͟E͟D͟
    CASEWHERE state = 0:
      F͟L͟A͟P͟M͟O͟D͟E͟
    OTHERWISE
      C͟O͟P͟T͟E͟R͟M͟O͟D͟E͟
    ENDCASE
  END WHILE
END PLAYER
```
## Flap Mode
Flap mode method
```pascal
BEGIN FLAPMODE
  INCREASE flapGravity BY velocity
  IF spaceJustPressed
    SET velocity TO jumpForce
  END IF
  
  CASEWHERE velocity > 0
    SET sprite TO 1
  OTHERWISE
    SET sprite TO 0
  END CASE
END FLAPMODE
```
## Copter Mode
Copter mode method
```pascal
BEGIN COPTERMODE
  INCREASE velocity BY copterGravity
  IF S͟P͟A͟C͟E͟P͟R͟E͟S͟S͟E͟D͟
    INCREASE velocity BY copterForce
  END IF
  
  SET spriteRotation TO velocity
END COPTERMODE
```
## Space Just Pressed
Space Pressed function/method, run once per cycle or else it will break
```pascal
BEGIN SPACEJUSTPRESSED
  CASEWHERE S͟P͟A͟C͟E͟P͟R͟E͟S͟S͟E͟D͟ AND NOT prevSpacePressed
    RETURN TRUE
  OTHERWISE
    RETURN FALSE
  END CASE
  
  SET prevSpacePressed TO S͟P͟A͟C͟E͟P͟R͟E͟S͟S͟E͟D͟
END SPACEJUSTPRESSED
```
