#!/usr/bin/env python3

import os
import platform
import struct
import subprocess

print("Checking install...")

operating_system = platform.system()
isWin = operating_system == 'Windows'
isMac = operating_system == 'Darwin'

if isWin or isMac:
    ### 1
    # check FFMPEG is installed
    ffmpeg_result = subprocess.run(['ffmpeg'], capture_output=True).stderr.decode('utf-8')

    # we could check for len > 1, but we can be a bit more robust? I don't trust computers...
    if "ffmpeg version" not in ffmpeg_result:
        print("(Step 1) ffmpeg may not be installed correctly.")

    ### 2
    # check python version is 3.9.X and 64 bit
    python_version = platform.python_version()

    if not python_version.startswith("3.9."):
        print("(Step 2) Your installed python version may be incorrect, I see " + python_version)

    python_32_or_64_bit = struct.calcsize("P") * 8

    if python_32_or_64_bit != 64:
        print("(Step 2) Your installed python version is 32 bit (" + python_version + ")")

    ### 3
    # check PATHEXT env variable doesn't have .JS
    if isWin:
        path_ext = os.environ['PATHEXT']

        if ".JS;" in path_ext:
            print("(Step 3) You may need to remove .JS from PATHEXT")

    ### 4
    # check spleeter install
    try:
        spleeter_result = subprocess.run(["spleeter", "--help"], capture_output=True).stdout.decode('utf-8')

        if "usage: spleeter" not in spleeter_result.lower():
            print("(Step 4) Spleeter may be installed incorrectly.")

    # we'll get an error if spleeter has been set to 'Run as administrator'
    except OSError as err:
        print("OS error: {0}".format(err))
        if isWin:
            print("... you may need admin privileges, try running [spleeter -h] in CMD.exe (no brackets) and see if there is output")
        quit()
    print("Done. If no errors printed, you might be good to go! Make sure Ableton is 10.1+ and Max is 8.1+.")
else:
    print('Sorry, your operating system is not supported.')
