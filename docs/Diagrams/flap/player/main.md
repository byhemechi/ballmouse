# Main
``` 
mermaid graph TD
A(START MAIN) --> B[Player Movement]
B-->C[Increment 'time' variable]
C-->D[Increment 'speed' variable]
D-->E[Move pipes left by speed * delta]
E-->F[Handle collision]
F-->G{is 'time' equal to<br> 'time between pipes'}
G-->|No|B
G--> |Yes| H[Create new pipe]
H-->B
```