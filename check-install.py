#!/usr/bin/env python3

import os
import platform
import struct
import subprocess

print("Checking install...")

operating_system = platform.system()

if operating_system != "Windows":
    print("This script doesn't support your OS.")

if operating_system == "Windows":
    ### 1
    # check FFMPEG is installed
    ffmpeg_result = subprocess.run(['ffmpeg'], capture_output=True).stderr.decode('utf-8')

    # we could check for len > 1, but we can be a bit more robust? I don't trust computers...
    if "ffmpeg version" not in ffmpeg_result:
        print("(Step 1) ffmpeg may not be installed correctly.")

    ### 2
    # check python version is 3.7.X and 64 bit
    python_version = platform.python_version()

    python_major_version = python_version[0]
    python_minor_version = python_version[2]

    if python_major_version != "3" or python_minor_version != "7":
        print("(Step 2) Your installed python version may be incorrect, I see " + python_version)

    python_32_or_64_bit = struct.calcsize("P") * 8

    if python_32_or_64_bit != 64:
        print("(Step 2) Your installed python version is 32 bit (" + python_version + ")")

    ### 3
    # check PATHEXT env variable doesn't have .JS
    path_ext = os.environ['PATHEXT']

    if ".JS;" in path_ext:
        print("(Step 3) You may need to remove .JS from PATHEXT")

    ### 4
    # check spleeter install
    try:
        spleeter_result = subprocess.run(["spleeter", "-h"], capture_output=True).stdout.decode('utf-8')

        if "usage: spleeter" not in spleeter_result:
            print("(Step 4) Spleeter may be installed incorrectly.")

    # we'll get an error if spleeter has been set to 'Run as administrator'
    except OSError as err:
        print("OS error: {0}".format(err))
        print("... you may need admin privileges, try running [spleeter -h] in CMD.exe (no brackets) and see if there is output")
        quit()

print("Done. If no errors printed, you might be good to go!")