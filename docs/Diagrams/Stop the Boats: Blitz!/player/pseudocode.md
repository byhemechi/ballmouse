# Pseudocode
## Player
```pascal
BEGIN PLAYER
  REPEAT
    INCREASE position BY keyboardInput
    IF shoot is pressed
      _SHOOT_
    _DOCOLLISION_
    IF health < 0
      _ENDGAME_
    UNTIL Game is Over
END PLAYER
```
