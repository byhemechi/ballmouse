# Pseudocode
## Player
Main player loop
```pascal
BEGIN PLAYER
  WHILE Player IS Alive
    CASEWHERE state IS "flap":
      _FLAPMODE_
    state IS "copter":
      _COPTERMODE_
    END CASE
  END WHILE
END PLAYER
```
## Flap Mode
Flap mode method
```pascal
BEGIN FLAPMODE
  INCREASE velocity by flapGravity
  IF _SPACEJUSTPRESSED_
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
  IF _SPACEPRESSED_
    INCREASE velocity BY copterForce
  END IF
  
  SET spriteRotation TO velocity
END COPTERMODE
```
