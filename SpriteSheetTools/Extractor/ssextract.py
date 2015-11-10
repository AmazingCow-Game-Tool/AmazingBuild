#!/usr/bin/python
#coding=utf8
##----------------------------------------------------------------------------##
##               █      █                                                     ##
##               ████████                                                     ##
##             ██        ██                                                   ##
##            ███  █  █  ███                                                  ##
##            █ █        █ █        ssextract.py                              ##
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
#OS stuff.
import os;
import os.path;
#Cmd line parsing stuff.
import sys;
import getopt;
#Libs to read the files...
import plistlib;
#To generate individual sprites.
import pygame;
#Parsers
import parsers._2DToolkit;
import parsers.AndEngine;
import parsers.AppGameKit;
import parsers.cocos2d;

################################################################################
## Constants Class                                                            ##
################################################################################
class Constants:
    FLAG_HELP         = "help";
    FLAG_VERSION      = "version";
    FLAG_VERBOSE      = "verbose";
    FLAG_SHOW_FORMATS = "show-formats";

    FLAG_INPUT_SHEET_FORMAT = "sheet-format";
    FLAG_INPUT_SHEET_IMAGE  = "sheet-image";
    FLAG_INPUT_SHEET_DATA   = "sheet-data";

    FLAG_OUTPUT_SPRITES_DIR = "output";

    ALL_FLAGS = [
        FLAG_HELP,
        FLAG_VERSION,
        FLAG_VERBOSE,
        FLAG_SHOW_FORMATS,

        FLAG_INPUT_SHEET_FORMAT + "=",
        FLAG_INPUT_SHEET_IMAGE  + "=",
        FLAG_INPUT_SHEET_DATA   + "=",

        FLAG_OUTPUT_SPRITES_DIR + "=",
    ];

    SHEET_FORMATS = [
        "2DToolkit",
        "AndEngine",
        "AppGameKit",
        "cocos2d",
    ];
    SHEET_PARSERS = None;


def _generate_parsers():
    Constants.SHEET_PARSERS = {
        "2DToolkit"  : parsers._2DToolkit,
        "AndEngine"  : parsers.AndEngine,
        "AppGameKit" : parsers.AppGameKit,
        "cocos2d"    : parsers.cocos2d,
    }


################################################################################
## Globals Class                                                              ##
################################################################################
class Globals:
    opt_verbose = False;

    opt_sheet_format = None;
    opt_sheet_image  = None;
    opt_sheet_data   = None;

    opt_output_dir = None;


################################################################################
## Output Class                                                               ##
################################################################################
class Output:
    @staticmethod
    def fatal(msg):
        print "[FATAL]", msg;
        exit(1);

    @staticmethod
    def warning(msg):
        print "[WARNING]", msg;

    @staticmethod
    def verbose(msg):
        if(Globals.opt_verbose):
            print msg;

    @staticmethod
    def help():
        print "help";
        exit(0);

    @staticmethod
    def version():
        print "version";
        exit(0);

    @staticmethod
    def formats():
        print "Formats available (You could enter them in any case):"
        print "\n".join(Constants.SHEET_FORMATS);
        exit(0);

################################################################################
## Run                                                                        ##
################################################################################
def create_sprites(frames_list):
    pygame.init();

    #Load the SpriteSheet image.
    try:
        sheet_surface = pygame.image.load(Globals.opt_sheet_image);
    except Exception, e:
        msg = "{} ({}) - Exception: {}".format("Failed to load SpriteSheet image",
                                                Globals.opt_sheet_image,
                                                str(e));
        Output.fatal(msg);


    #For each SpriteSheet frame, cut it from the SpriteSheet image
    #create a folder if needed and save the cut image to disk.
    for frame in frames_list:
        try:
            Output.verbose("Saving - {}\n{}\n".format(frame.name, frame));

            #Cut.
            sprite_surface = sheet_surface.subsurface(frame.get_rect());

            #If Frame has the path information, create a subdirectory.
            fullpath = os.path.join(Globals.opt_output_dir, frame.path);
            os.system("mkdir -p {}".format(fullpath));

            #Save the sprite frame to disk.
            fullpath = os.path.join(fullpath, frame.name);
            pygame.image.save(sprite_surface, fullpath);

        except Exception, e:
            msg = "{} ({}) - Exception: {}".format("Failed to save sprite frame",
                                                   frame.name,
                                                   str(e));
            Output.fatal(msg);

def run():
    #Check if all required options are given.
    if(Globals.opt_sheet_image is None):
        Output.fatal("sheet-image is required.");
    if(Globals.opt_sheet_data is None):
        Output.fatal("sheet-data is required.");
    if(Globals.opt_sheet_format is None):
        Output.fatal("sheet-format is required.");

    parser      = Constants.SHEET_PARSERS[Globals.opt_sheet_format];
    frames_list = parser.parse(Globals, Output);

    create_sprites(frames_list);

################################################################################
## Script Initialization                                                      ##
################################################################################
def set_sheet_format(value):
    if(Globals.opt_sheet_format is not None):
        Output.warning("{} - {}".format("Passing multiple values in sheet-format",
                                        "overriding the previous one."));

    if(value not in Constants.SHEET_FORMATS):
        Output.fatal("sheet-format: ({}) is not a valid format.".format(value));

    Globals.opt_sheet_format = value;

def set_sheet_image(value):
    if(Globals.opt_sheet_image is not None):
        Output.warning("{} - {}".format("Passing multiple values in sheet-image",
                                        "overriding the previous one."));

    if(not os.path.isfile(value)):
        Output.fatal("sheet-image: ({}) is not a valid file.".format(value));

    Globals.opt_sheet_image = value;

def set_sheet_data(value):
    if(Globals.opt_sheet_data is not None):
        Output.warning("{} - {}".format("Passing multiple values in sheet-data",
                                        "overriding the previous one."));

    if(not os.path.isfile(value)):
        Output.fatal("sheet-data: ({}) is not a valid file.".format(value));

    Globals.opt_sheet_data = value;

def set_output_dir(value):
    Globals.opt_output_dir = value;

def main():
    _generate_parsers();

    #Get the command line options.
    try:
        options = getopt.gnu_getopt(sys.argv[1:], "", Constants.ALL_FLAGS);
    except Exception, e:
        Output.fatal(e);

    #Parse the command line options.
    for key, value in options[0]:
        key = key.lstrip("-");

        #Help / Version / Verbose
        if  (key == Constants.FLAG_HELP        ): Output.help();
        elif(key == Constants.FLAG_VERSION     ): Output.version();
        elif(key == Constants.FLAG_VERBOSE     ): Globals.opt_verbose = True;
        elif(key == Constants.FLAG_SHOW_FORMATS): Output.formats();

        #Spritesheet options.
        elif(key == Constants.FLAG_INPUT_SHEET_FORMAT): set_sheet_format(value);
        elif(key == Constants.FLAG_INPUT_SHEET_IMAGE ): set_sheet_image(value);
        elif(key == Constants.FLAG_INPUT_SHEET_DATA  ): set_sheet_data(value);

        #Output options.
        elif(key == Constants.FLAG_OUTPUT_SPRITES_DIR): set_output_dir(value);

    run();

if(__name__ == "__main__"):
    main();
