#!/usr/bin/python
#coding=utf8
##----------------------------------------------------------------------------##
##               █      █                                                     ##
##               ████████                                                     ##
##             ██        ██                                                   ##
##            ███  █  █  ███                                                  ##
##            █ █        █ █        cocos2d.py                                ##
##             ████████████         SpriteSheet Extractor                     ##
##           █              █       Copyright (c) 2015 AmazingCow             ##
##          █     █    █     █      www.AmazingCow.com                        ##
##          █     █    █     █                                                ##
##           █              █       N2OMatt - n2omatt@amazingcow.com          ##
##             ████████████         www.amazingcow.com/n2omatt                ##
##                                                                            ##
##                                                                            ##
##                  This software is licensed as GPLv3                        ##
##                 CHECK THE COPYING FILE TO MORE DETAILS                     ##
##                                                                            ##
##    Permission is granted to anyone to use this software for any purpose,   ##
##   including commercial applications, and to alter it and redistribute it   ##
##               freely, subject to the following restrictions:               ##
##                                                                            ##
##     0. You **CANNOT** change the type of the license.                      ##
##     1. The origin of this software must not be misrepresented;             ##
##        you must not claim that you wrote the original software.            ##
##     2. If you use this software in a product, an acknowledgment in the     ##
##        product IS HIGHLY APPRECIATED, both in source and binary forms.     ##
##        (See opensource.AmazingCow.com/acknowledgment.html for details).    ##
##        If you will not acknowledge, just send us a email. We'll be         ##
##        *VERY* happy to see our work being used by other people. :)         ##
##        The email is: acknowledgmentopensource@AmazingCow.com               ##
##     3. Altered source versions must be plainly marked as such,             ##
##        and must notbe misrepresented as being the original software.       ##
##     4. This notice may not be removed or altered from any source           ##
##        distribution.                                                       ##
##     5. Most important, you must have fun. ;)                               ##
##                                                                            ##
##      Visit opensource.amazingcow.com for more open-source projects.        ##
##                                                                            ##
##                                  Enjoy :)                                  ##
##----------------------------------------------------------------------------##

## Imports ##
#To read the cocos2d sheet format.
import plistlib;
#Our frame representation.
from frame import Frame;

################################################################################
## Parser Functions                                                           ##
################################################################################
def parse(Globals, Output):
    parsed_frame_list = [];

    #Cocos2d sheet data is a plist that will contains
    #two main dictionaries. One of them is the information
    #about the frames, the another one is metadata that
    #we're not interested so we gonna ignore it completely.
    plist = plistlib.readPlist(Globals.opt_sheet_data);

    #Check if we have our frames dictionary.
    if("frames" not in plist):
        Output.fatal("Cocos2d sheet data is bad formated - Missing frames key");

    #In an frames dictionary each item key is the name|path of sprite
    #Next we'll have a dictionary that can be composed of the following keys:
    # frame           - Used.
    # offset          - Not Used.
    # rotated         - Used.
    # sourceColorRect - Not Used.
    # sourceSize      - Not Used.
    # A good explanation about this items can be found here:
    # http://gamedev.stackexchange.com/questions/18758/in-cocos2ds-plist-output-what-are-offset-colorsourcerect-and-these-other
    frames_dict = plist["frames"];

    for key in frames_dict.keys():
        frame_dict = frames_dict[key];

        #Get the values.
        info_frame   = __get_value_from_key(frame_dict, "frame");
        info_rotated = __get_value_from_key(frame_dict, "rotated");

        #Make the numeric values, well... numeric.
        info_frame = __number_list_from_value(info_frame);

        parsed_frame = Frame.FrameInfo();
        parsed_frame.set_name_path(key);
        parsed_frame.set_rect(info_frame);
        parsed_frame.set_rotated(info_rotated);

        parsed_frame_list.append(parsed_frame);

    return parsed_frame_list;


################################################################################
## Helper Functions                                                           ##
################################################################################
def __get_value_from_key(frame_dict, key):
    if(key in frame_dict.keys()):
        return frame_dict[key];
    return None;

def __number_list_from_value(value):
    if(value is None):
        return None;

    #This will remove the curly braces and split the comma separated
    #values, after will turn them into integers and return as a list.
    return map(int, value.replace("{", "").replace("}", "").split(","));
