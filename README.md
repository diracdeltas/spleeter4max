# spleeter for max (native version)

ableton max device for separating a clip into stems (vocals, bass, drums,
other) **using an existing installation of spleeter**. if you aren't able to
install spleeter, check out
https://github.com/diracdeltas/spleeter4max#spleeter-for-max instead for the version that uses docker.

## download link

https://github.com/diracdeltas/spleeter4max/releases/download/1.4-native/spleeter-native.zip

## before you start

all instructions were tested with Max 8.1 / Ableton 10.1 and will not work for earlier versions. also your CPU must [support AVX](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions) - unfortunately this excludes older computers like ~2010 Macbooks.

### windows steps:

1. install ffmpeg following the instructions in https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg#installing-ffmpeg-in-windows.

> :white_check_mark: to test, run `ffmpeg` in CMD.exe, if there is no output something is wrong

2. install **python 3.7** from https://www.python.org/downloads/release/python-377/. in the installer, make sure to enable the setting that adds Python to your path and disable the "path length variable limit" option when you get to the end of the install process.

> :white_check_mark: to test, run `python -V` or `py -V` in CMD.exe, if there is no output or something other than `Python 3.7.X` then something is wrong

3. open windows environment variable editor and remove `.JS;` from PATHEXT (https://support.shotgunsoftware.com/hc/en-us/articles/114094235653-Setting-global-environment-variables-on-Windows). on some systems you may need to restart for these changes to take effect.

> :white_check_mark: to test, run `echo %pathext%` in CMD.exe and make sure `.JS` is not there

4. open CMD.exe and type `pip3 install spleeter==2.1` (hit enter)

> :white_check_mark: to test, run `spleeter -h` in CMD.exe. it should show you usage instructions. if not, you may need to [set spleeter to run as administrator](https://github.com/diracdeltas/spleeter4max/issues/7) or try [the instructions in this thread](https://github.com/diracdeltas/spleeter4max/issues/8).

if you want to verify everything is installed on windows, download https://raw.githubusercontent.com/diracdeltas/spleeter4max/feature/native-spleeter/check-install.py to your home directory, open CMD.exe, and run `py check-install.py` or `python check-install.py`.

### macOS steps:

1. install homebrew: https://brew.sh/

2. open terminal and install python3.7/ffmpeg/spleeter with the following commands:
```
brew install python@3.7
brew link --force python@3.7
brew install ffmpeg
pip3 install spleeter==2.1
```
Note: if you already have Python 3.7+ installed from Homebrew, you may need to run `brew unlink python3` first.

3. on some versions of MacOS, spleeter gets installed somewhere other than `/usr/local/bin/spleeter`. you can check this by typing `which spleeter` into the terminal. if this is the case, enter this into the terminal to fix the location:
```
ln -s $(which spleeter) /usr/local/bin/spleeter
```

note for existing python users: spleeter currently requires **python 3.7** (3.6 may work too)

if you want to verify everything is installed on macos, download https://raw.githubusercontent.com/diracdeltas/spleeter4max/feature/native-spleeter/check-install.py to your home directory, open terminal, and run `./check-install.py`.

## running

1. unzip spleeter-native.zip and add the `spleeter-native/` folder to your Places menu in Ableton
2. put `spleeter-native.amxd` onto any audio channel
3. select any audio clip in Ableton by clicking on it
4. press the start button in the spleeter device and wait.

## troubleshooting and FAQs

### spleeter seems to take forever to run

try splitting your input audio into shorter pieces.

on windows, if it hangs for more than a few minutes, this might indicate that you [need to run spleeter as administrator](https://github.com/diracdeltas/spleeter4max/issues/7).

### the start button disappears, then nothing happens

this may be because spleeter can't find what it's supposed to be splitting in the Ableton session. **you need to select an entire audio clip, not just highlight part of it.** to split an audio clip into a shorter segment, click on a point in the clip, press cmd or ctrl+e to split, then right-click and consolidate.


### 'pip(3) install spleeter' is failing

try `python -m pip install spleeter==2.1` or `python3 -m pip install spleeter==2.1` to see if that works for some reason.

open terminal/CMD.exe and type `pip --version` or `pip3 --version` to make sure you have the version with python 3.7. if not, you need to install python 3.7 with the instructions above.

you could also try https://pypi.org/help/#tls-deprecation to get some more useful error messages.

it's possible the issue is pip needs to be upgraded, which can be done using https://stackoverflow.com/questions/49748063/pip-install-fails-for-every-package-could-not-find-a-version-that-satisfies.

### spleeter fails with command not found

this might be because spleeter is not installed in a path that Max recognizes. on MacOS try entering this in terminal:

```
ln -s $(which spleeter) /usr/local/bin/spleeter
```

on Windows, you might need to go to `C:\Program Files\Python37\Scripts`, right click on spleeter, select Properties, and under Compatibility enable `Run this program as an administrator` (https://github.com/diracdeltas/spleeter4max/issues/7). 

if it's still not working on Windows, see advice in https://github.com/diracdeltas/spleeter4max/issues/8.

### max console says it can't find a .js file

make sure spleeter-native.amxd is in the spleeter-native directory. it cannot be moved out of this directory or else it will break, but you can move the entire directory.

### windows throws a jscript error when i click start

you may need to restart your computer, assuming you already did step 3 in https://github.com/diracdeltas/spleeter4max/tree/feature/native-spleeter#windows-steps.

### it not working and i can't figure out why

try opening up the max console in order to get more useful error messages. instructions:

1. click on the rectangle icon in Spleeter to open max
<img width="214" alt="Screen Shot 2020-04-24 at 11 32 46 PM" src="https://user-images.githubusercontent.com/549654/80273255-7a5e6380-8685-11ea-8110-bf62b6265bb4.png">

2. make sure the lock icon is set to locked. click the hamburger menu icon to open the max console.
<img width="574" alt="Screen Shot 2020-04-24 at 11 34 03 PM" src="https://user-images.githubusercontent.com/549654/80273260-864a2580-8685-11ea-83e2-72fc0e49090b.png">

3. click the button to run spleeter. you should see a bunch of console messages.
<img width="663" alt="Screen Shot 2020-04-24 at 11 35 04 PM" src="https://user-images.githubusercontent.com/549654/80273267-919d5100-8685-11ea-9453-bfd2c7cc4f6a.png">

### can i run this in other DAWs?

unfortunately not right now

## support

please open an issue at https://github.com/diracdeltas/spleeter4max/issues. want a higher chance of getting a response? you can
make a donation via
[bandcamp](https://azuki.bandcamp.com/merch/max-for-live-stem-splitter) and
mention it in the issue!

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
