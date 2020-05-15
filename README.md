# spleeter for max (native version)

ableton max device for separating a clip into stems (vocals, bass, drums,
other) **using an existing installation of spleeter**. if you aren't able to
install spleeter, check out
https://www.dropbox.com/s/cn90sqpx3cuzttb/spleeter.zip?dl=0 instead.

## before you start

### windows steps:

1. install ffmpeg following the instructions in https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg#installing-ffmpeg-in-windows
2. install python 3.7 from https://www.python.org/downloads/release/python-377/ and disable the "path length variable limit" option when you get to the end of the install process
3. open windows environment variable editor and remove `.JS;` from PATHEXT (https://support.shotgunsoftware.com/hc/en-us/articles/114094235653-Setting-global-environment-variables-on-Windows)
4. open CMD.exe and type `pip install spleeter`

### macOS steps:

1. install homebrew: https://brew.sh/
2. open terminal and install python/ffmpeg/spleeter with the following commands:
```
brew install python
brew install ffmpeg
pip3 install spleeter
```
3. on some versions of MacOS, spleeter gets installed somewhere other than `/usr/local/bin/spleeter`. you can check this by typing `which spleeter` into the terminal. if this is the case, enter this into the terminal to fix the location:
```
ln -s $(which spleeter) /usr/local/bin/spleeter
```

note: spleeter currently requires python 3.7

## running

1. unzip spleeter-native.zip and add the `spleeter-native/` folder to your Places menu in Ableton
2. put `spleeter-native.amxd` onto any audio channel
3. select any audio clip in Ableton by clicking on it
4. press the start button in the spleeter device and wait.

## troubleshooting and FAQs

### spleeter seems to take forever to run

try splitting your input audio into shorter pieces.

### the start button disappears, then nothing happens

this may be because spleeter can't find what it's supposed to be splitting in the Ableton session. **you need to select an entire audio clip, not just highlight part of it.** to split an audio clip into a shorter segment, click on a point in the clip, press cmd or ctrl+e to split, then right-click and consolidate.


### 'pip(3) install spleeter' is failing

try `python -m pip install spleeter` or `python3 -m pip install spleeter` to see if that works for some reason.

open terminal/CMD.exe and type `pip --version` or `pip3 --version` to make sure you have the version with python 3.7. if not, you need to install python 3.7 with the instructions above.

you could also try https://pypi.org/help/#tls-deprecation to get some more useful error messages.

it's possible the issue is pip needs to be upgraded, which can be done using https://stackoverflow.com/questions/49748063/pip-install-fails-for-every-package-could-not-find-a-version-that-satisfies.

## spleeter fails with command not found even though it works on command line

this might be because spleeter is not installed in a path that Max recognizes. on MacOS try entering this in terminal:

```
ln -s $(which spleeter) /usr/local/bin/spleeter
```

TODO: figure out what the equivalent is for windows

### it not working and i can't figure out why

try opening up the max console in order to get more useful error messages. instructions:

1. click on the rectangle icon in Spleeter to open max
<img width="214" alt="Screen Shot 2020-04-24 at 11 32 46 PM" src="https://user-images.githubusercontent.com/549654/80273255-7a5e6380-8685-11ea-8110-bf62b6265bb4.png">

2. make sure the lock icon is set to locked. click the hamburger menu icon to open the max console.
<img width="574" alt="Screen Shot 2020-04-24 at 11 34 03 PM" src="https://user-images.githubusercontent.com/549654/80273260-864a2580-8685-11ea-83e2-72fc0e49090b.png">

3. click the button to run spleeter. you should see a bunch of console messages.
<img width="663" alt="Screen Shot 2020-04-24 at 11 35 04 PM" src="https://user-images.githubusercontent.com/549654/80273267-919d5100-8685-11ea-9453-bfd2c7cc4f6a.png">

if this doesn't seem helpful, you could try this pre-release version which has better error messages: https://github.com/diracdeltas/spleeter4max/releases/tag/1.3.1-native

### can i run this in other DAWs?

unfortunately not right now

## support

email: spleeter@azuki.vip. want a higher chance of getting a response? you can
make a donation via
[bandcamp](https://azuki.bandcamp.com/merch/max-for-live-stem-splitter) and
mention it in your email!

## license (MIT)

Copyright 2020 Yan Zhu

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## credits

https://github.com/deezer/spleeter
