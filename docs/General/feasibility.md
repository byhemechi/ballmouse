# Feasibility of Project
**Author: Group**

## Requirements from the User
### Hardware
Our game collection should run on any modern computer as it is not very heavy and *most* of us can write competent code.
### Software
We are creating the game in JavaScript/TypeScript and Canvas.  The engine is designed to run on a browser, which means that you need some kind of browser (or Electron[^1]) to play.  We figured that this was enough accessable as literally everyone has some form of web browser installed.

However, an issue that we found was that the JavaScript was not very reliable on Internet Explorer as it was missing a couple of features present in other browsers.  This issue could be resolved by packaging the game as an Electron[^1] app.
## Requirements from the Devs
### Hardware 
As stated [above](/General/feasability/#hardware), the hardware required for the engine is very low and will not be an issue.
### Software
Because of how simple our engine is, all of our APIs are open source and we are not at the mercy of any proprietary software.  Every single software used for developement was open source.  JavaScript + Canvas are both open source web standards; Visual Studio Code, the editor we used was open source; Git, our version controller was also open source; and even our OS, Linux was open source.
## Scheduling
While theoretically we were given more than enough time, we knew that we would likely end up doing most of the work during the last two weeks.  To try and reduce that, we created a time-action plan / gantt chart for how we should aim to complete the project.
### Gantt Chart
```
mermaid gantt
dateFormat DD-MM-YYYY

Section Key
George Fischer     :, 19-05-2019, 15d
Joon Suh     :active, 19-05-2019, 15d
Finley Turner    :done, 19-05-2019, 15d

section Engine
Godie add what you did      : , 06-06-2019, 5d

section Flying Guy
Planning               :active, 19-05-2019, 3d
Game Programming       :active, 22-05-2019, 16d
Playtesting            :active, 30-05-2019, 8d
Polish                 :active, 07-06-2019, 5d
Assets                 :done , 22-05-2019, 16d

section Stop the Boats Blitz!
Planning               :active, 10-06-2019, 3d
Game Programming       :active, 13-06-2019, 35d
Playtesting            :active, 28-06-2019, 20d
Polish                 :active, 18-07-2019, 8d
Assets                 :done, 13-06-2019, 35d
```
## Social and Ethical Issues
It is important for us to consider the potential impacts of our software.  Without proper considerations and safety measures, it could cause unwanted harm to the user.

One of the issues with games is that they are usually in the form of an executable.  This makes them much more vulnerable to being infected with malware and being spread alongside the game.  This could result in harmful malware spreading across different computers[^2].  

To partially avoid this potential issue, we created the engine as a web app.  This moves the dangerous safety responsibilities to the web browser developers, whom are much more experienced and knowlegeable in protection.  In the case that it is infected with malware, it reduces the risk of the game spreading malware as if we notice that our game is being hijacked, we can shut the servers down and stop the malware from spreading any further.




[^1]: Electron is a stripped down version of Chrome  
[^2]: Assuming people play our game, which they will most definitely not