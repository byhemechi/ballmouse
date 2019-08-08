# Pseudocode
## Main
Main game loop
```pascal
BEGIN MAIN
  WHILE TRUE
    INCREASE timer
    IF timer > cloudSpawnTime
      _ADDCLOUD_
    END IF
    _MOVECLOUDS_
    
    CASEWHERE: GameStarted
      _CHILDRENMAIN_
      _MOVEPIPES_
      
      _CHECKCOLLISION_
      
      IF timer > pipeSpawnTime
        _CREATEPIPE_
      END IF
      
      IF timer > stateChangeTime
        _CHANGEGAMESTATE_
      END IF
    OTHERWISE:
      IF _SPACEJUSTPRESSED_
        _RESETGAME_
      END IF
    END CASE
  END WHILE
END MAIN
```
## Check Collision
```pascal
BEGIN CHECKCOLLISION
  FOR EACH pipe IN pipes
    IF _OVERLAPPING(player, pipe)_
      _ENDGAME_
      SET GameStarted TO False
      BREAK
    END IF
  END FOR
END COLLIDEPLAYERANDPIPES
```
## End Game
```pascal
BEGIN ENDGAME
  SET GameStarted TO False
  _KILLPLAYER_
  _SHAKESCREEN_
END ENDGAME
```