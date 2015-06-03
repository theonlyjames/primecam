#PRIMECAM Prototype Project

Prototype to simulate how our PrimeCam Product would work. 

Mostly a modified version of this tutorial. 
https://crosswalk-project.org/documentation/webrtc.html

###Description

Node server hosted on local computer. 

There are three separate client web application.

    1. Camera Simulator - basically just using the camer of the device to stream to the other devices. 
    2. Viewport Simulator - displays what the streaming coming from the Camera Simulator. (non-interactive at the moment).
    3. Buddy Mode Simulator - This also displays the stream coming from the camera simulator but it also simulates controlling the gimble and other interations that you would want to have from a separate controller.

###Directories

crosswalk-13..... : Android build diretory. 

Downloaded from: https://crosswalk-project.org/documentation/downloads.html

https://crosswalk-project.org/documentation/getting_started/run_on_android.html

xwalk-webrtc

Dowloaded from: https://github.com/crosswalk-project/crosswalk-samples

This directory includes the server that is to be hosting on a local machine that all of the devices can be connected to. It also contains the three web applications that are to be built using the files in crosswalk-13 directory.


###Usage

####I don't feel like writing this all out because it's basically all on the tutorial page. 

Clone the project

cd into project

```
npm install
```

First get the ip address of the computer that is going to be hosting the server.

Open xwalk-webrtc/server/main.js and edit the SERVER_IP var

Then start the web server by going into xwalk-webrtc/server dir and running the command `node index.js'




