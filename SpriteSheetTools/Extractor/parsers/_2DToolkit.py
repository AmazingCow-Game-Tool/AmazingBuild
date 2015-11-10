#!/usr/bin/python
#coding=utf8
##----------------------------------------------------------------------------##
##               █      █                                                     ##
##               ████████                                                     ##
##             ██        ██                                                   ##
##            ███  █  █  ███                                                  ##
##            █ █        █ █        _2DToolkit.py                             ##
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

    #Open and read the file til the end.
    data_lines = open(Globals.opt_sheet_data).read();

    #Split the lines with the ~ separator.
    #Since the very first item is the information about the sheet
    #we discard it.
    frames_items = data_lines.split("~")[1:-1];

    #The structure of the item is.
    # n Filename.
    # s Size.
    # o Offset.
    # r Rotated.
    for frame_item in frames_items:
        #Make a list.
        frame_lines = frame_item.split("\n");

        #Clean up the list of whitespaces let just the actual values.
        frame_lines.sort();
        while(frame_lines[0] == "" or frame_lines[0] == " "):
            frame_lines.pop(0);

        #Create a Frame object to normalize the values.
        parsed_frame = Frame.FrameInfo();

        for line in frame_lines:
            type  = line[0];
            value = line[1:];

            #Name.
            if(type == "n"):
                parsed_frame.set_name_path(value);

            #Size.
            elif(type == "s"):
                #Split the size components and turn them into floats.
                size = map(float, value.lstrip(" ").split(" "));
                parsed_frame.set_rect(size);

            #Rotation.
            if(type == "r"):
                parsed_frame.set_rotated(value == "1");

        parsed_frame_list.append(parsed_frame);

    return parsed_frame_list;
