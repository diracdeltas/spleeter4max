# spleeter for max

ableton max device for separating a clip into stems (vocals, bass, drums, other).

## download links:

there are two options for installing spleeter for max:

* **spleeter with docker** (requires windows professional and macos > 10.12, but is easier to install for non-technical users): https://www.dropbox.com/s/cn90sqpx3cuzttb/spleeter.zip?dl=0 ([backup download link](https://github.com/diracdeltas/spleeter4max/releases/download/1.4/spleeter.zip))
* **spleeter-native** (doesn't require docker and is faster, but potentially harder to install): https://github.com/diracdeltas/spleeter4max/blob/feature/native-spleeter/README.md#spleeter-for-max-native-version

## before you start

**NOTE: if you are using spleeter-native, ignore the rest of this page and [see instructions here](https://github.com/diracdeltas/spleeter4max/blob/feature/native-spleeter/README.md#spleeter-for-max-native-version)**.

otherwise install Docker from https://www.docker.com/products/docker-desktop (it's
free!).

once Docker is installed:

1. run the Docker application.
2. in `Preferences > Advanced`, set Memory to the maximum possible value or at least 8GB
3. on Windows, you will need to select the drives that you will load samples
   from in `Settings > Shared Drives`. on Mac, you may need to do this in
   `Settings > Resources > File Sharing` if you are loading samples from
   outside your home directory.

## system requirements

* Windows 10 64-bit: Pro, Enterprise, or Education; must be able to enable Hyper-V and Containers Windows features. UPDATE (5/16/20): it's now possible to install [Docker on Windows Home](https://www.docker.com/blog/docker-desktop-for-windows-home-is-here/) by joining the Windows insider program.
* Mac hardware must be a 2010 or a newer model / macOS must be version 10.13 or newer. **M1 Macs are NOT supported at this time. See https://github.com/diracdeltas/spleeter4max/issues/58 for more details.**
* At least 8GB, preferably at least 16GB of RAM
* Ableton 10.1+ and Max for Live 8.1+. (May work on earlier versions but I haven't tried it.)

## running

1. unzip spleeter.zip and add the `spleeter/` folder to your Places menu in Ableton
2. put `spleeter.amxd` onto any audio channel
3. select any audio clip in Ableton by clicking on it (don't just highlight a segment)
4. make sure docker is running.
5. press the start button in the spleeter device and wait. the first run may take a long time!

once you're done, you can quit docker, but make sure to start it again the next time you want to run spleeter.

## troubleshooting and FAQs

### can i run this if i have Windows Home?

i haven't tried it but apparently you can at least run docker if you opt into the latest Windows Insider builds. see https://www.docker.com/blog/docker-desktop-for-windows-home-is-here/.

### this plugin doesn't run

did you already do the steps in https://github.com/diracdeltas/spleeter4max#before-you-start? if so keep reading.

unfortunately this plugin may not work with versions earlier than Ableton 10.1 / Max 8.1 :(.

### the start button disappears, then nothing happens

this may be because spleeter can't find what it's supposed to be splitting in the Ableton session. **you need to select an entire audio clip, not just highlight part of it.** to split an audio clip into a shorter segment, click on a point in the clip, press cmd or ctrl+e to split, then right-click and consolidate.

### spleeter seems to take forever to run

the first time spleeter runs, it needs to download a virtual machine. on slow
networks, this might take a long time. once this is done, subsequent runs
should be faster.

if it's still taking a long time, try splitting your input
audio into shorter pieces. on a reasonably fast computer, spleeter usually
takes about a minute to stem a 3-minute track.

### docker will not start on windows

make sure you have [virtualization
enabled](https://support.bluestacks.com/hc/en-us/articles/115003174386-How-can-I-enable-virtualization-VT-on-my-PC-) in your BIOS settings.

### spleeter can't run because files are missing

unlike most Max devices, spleeter.amxd depends on many files that need to be in
the same directory. if you move spleeter.amxd to a location, make sure to move all the contents of the spleeter folder to the new location.

### spleeter says 'Spleeter could not run.'

this is a generic error message and can happen for many reasons. here's a few
of the common ones:

#### spleeter is out of memory

see Step 2 of https://github.com/diracdeltas/spleeter4max#before-you-start. if
you have already set the memory setting to the max, your audio might be too
long. try splitting your audio into 3-minute segments (split in Ableton
arrangement view, then right click and consolidate) and running it on
one segment at a time.

#### docker cannot access the drive on which your audio file is stored

see Step 3 of https://github.com/diracdeltas/spleeter4max#before-you-start.
this often happens if you are loading files from a different hard drive or
audio files outside your home folder.

### can i run this if i have less than 16GB of memory?

yes, as long as your audio files are short enough. if you get an error, try
splitting your audio file in half.

### spleeter says docker could not run

check that docker is running in your taskbar or task manager. if it's running,
then the issue might be that docker lacks network access. make sure your
firewall or proxy isn't [blocking
docker](https://stackoverflow.com/questions/49387263/docker-error-response-from-daemon-get-https-registry-1-docker-io-v2-servic).

### help! it's still not working.

try opening up the max console in order to get more useful error messages. instructions:

1. click on the rectangle icon in Spleeter to open max
<img width="214" alt="Screen Shot 2020-04-24 at 11 32 46 PM" src="https://user-images.githubusercontent.com/549654/80273255-7a5e6380-8685-11ea-8110-bf62b6265bb4.png">

2. make sure the lock icon is set to locked. click the hamburger menu icon to open the max console.
<img width="574" alt="Screen Shot 2020-04-24 at 11 34 03 PM" src="https://user-images.githubusercontent.com/549654/80273260-864a2580-8685-11ea-83e2-72fc0e49090b.png">

3. click the button to run spleeter. you should see a bunch of console messages.
<img width="663" alt="Screen Shot 2020-04-24 at 11 35 04 PM" src="https://user-images.githubusercontent.com/549654/80273267-919d5100-8685-11ea-9453-bfd2c7cc4f6a.png">

### i know how to run terminal commands. any other debugging tips?

1. you can run the docker command manually in the terminal and see what
   happens:
   https://github.com/diracdeltas/spleeter4max/blob/241ccc291d915c0b82f601948f6989ccefaeffa9/spleeter.js#L64O
2. if you have a python environment set up, you could install the original
   spleeter library from https://pypi.org/project/spleeter/ and use [spleeter for max native](https://github.com/diracdeltas/spleeter4max/releases/tag/1.3-native) instead, which will use the python installation.

### can i run this in other DAWs?

unfortunately no

### docker is not compatible with my operating system

try https://github.com/diracdeltas/spleeter4max/releases/tag/1.3-native instead

### can i stop docker?

yes, you can quit docker after spleeter is done. also i would turn off the
docker setting that automatically starts it when you start your computer. just
remember to start it before you run spleeter.

### spleeter seems to show 'starting docker' forever

this usually takes a long time when you run it for the first time, especially on slow networks, since it's downloading the VM. it might take several minutes and a few retries for the first time. if this actually seems to hang indefinitely, something on your network might be blocking the download.

you could try opening a terminal and doing this manually: `docker pull researchdeezer/spleeter@sha256:e46b042c25781c8ef041847d9615d799b3fa76d56a653ece0d0e2585067153a2`. if this succeeds, the spleeter max device won't try to download it anymore.

### spleeter ends with 'could not copy files from docker'

this could be due to an issue fixed in late january of 2020, so if you downloaded it prior to then, try re-downloading from the dropbox link above (and delete the old plugin) or from https://github.com/diracdeltas/spleeter4max/releases/download/1.2/spleeter.zip.

another possible solution is to copy the audio files you are splitting into the spleeter folder.

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
