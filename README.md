### Time-Lapse Camera WEB app

This is the companion app for Time-Lapse Camera (TLCAM) (https://github.com/fernandorpardo/Time-Lapse-Camera) for playing the images as motion video.

TLCAM and TLCAM WEB app are part of the Wilson project (www.iambobot.com)

### DESCRIPTION

TLCAM captures images from an USB camera and stores them as JPEG files. TLCAM WEB app takes the latest stored image and shows it on the browser. The images are refreshed and displayed as if they were frames of a motion video. 


### REQUISITES
This is a WEB application running on a browser. You need a WEB server such as Apache and the storage directory to be created under the DocumentRoot so Apache can serve its content. If you need guidance for installing and configuring the environment visit www.iambobot.com and follow the instructions.


### USAGE

Let’s assume your DocumentRoot is /var/www and that you have created the ‘cam’ directory under it so that the WEB app files are placed at /var/www/cam and that tlcam is running.
All you need to do is to open your browser and access to 
```
http://<IP_address_of_your_Raspberry>/cam
```

By default, the frame rate is 10 frames per second (refresh period = 100 milisecond). You can select a different frame rate providing the refresh time as a parameter in the URL:
```
http://<IP_address_of_your_Raspberry>/cam/index.php?time=200
```
will play 5 frames per second.


### LIMITATIONS
Does not work with Safari (AJAX part needs some debugging).

