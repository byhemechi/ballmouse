# Pseudocode
## Player
Main player loop
```pascal
BEGIN PLAYER
  WHILE Player IS Alive
    SET spaceJustPressed TO S͟P͟A͟C͟E͟J͟U͟S͟T͟P͟R͟E͟S͟S͟E͟D͟
    CASEWHERE state IS "flap":
      F͟L͟A͟P͟M͟O͟D͟E͟
    state IS "copter":
      C͟O͟P͟T͟E͟R͟M͟O͟D͟E͟
    END CASE
  END WHILE
END PLAYER
```
## Flap Mode
Flap mode method
```pascal
BEGIN FLAPMODE
  INCREASE velocity by flapGravity
  IF spaceJustPressed
    SET velocity TO jumpForce
  END IF
  
  CASEWHERE velocity > 0
    SET sprite TO 'flapping'
  OTHERWISE
    SET sprite TO 'normal'
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
