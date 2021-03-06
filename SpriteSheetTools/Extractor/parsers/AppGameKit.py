#!/usr/bin/python
#coding=utf8
##----------------------------------------------------------------------------##
##               █      █                                                     ##
##               ████████                                                     ##
##             ██        ██                                                   ##
##            ███  █  █  ███                                                  ##
##            █ █        █ █        AppGameKit.py                             ##
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
#Our frame representation.
from frame import Frame;

################################################################################
## Parser Functions                                                           ##
################################################################################
def parse(Globals, Output):
    parsed_frame_list = [];

    sheet_file = open(Globals.opt_sheet_data);

    for line in sheet_file.readlines():
        #Clean up the line.
        line = line.replace("\n", "");

        #The format of the info is defined as
        #   PATH/NAME:X:Y:WIDTH:HEIGHT
        #With the ":" as the separators.

        #Turn the info into a list.
        attributes = line.split(":");


        #Create the frame and set it's values.
        parsed_frame = Frame.FrameInfo();

        parsed_frame.set_name_path(attributes[0]);
        parsed_frame.set_rotated(False); #ALWAYS...
        parsed_frame.set_rect(attributes[1:]); #All attributes without the name.

        #Add to parsed frames.
        parsed_frame_list.append(parsed_frame);

    return parsed_frame_list;
