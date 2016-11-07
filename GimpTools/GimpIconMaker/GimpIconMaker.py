#coding=utf8
##----------------------------------------------------------------------------##
##               █      █                                                     ##
##               ████████                                                     ##
##             ██        ██                                                   ##
##            ███  █  █  ███        GimpIconMaker.py                          ##
##            █ █        █ █        GimpTools - AmazingBuild                  ###
##             ████████████                                                   ##
##           █              █       Copyright (c) 2016                        ##
##          █     █    █     █      AmazingCow - www.AmazingCow.com           ##
##          █     █    █     █                                                ##
##           █              █       N2OMatt - n2omatt@amazingcow.com          ##
##             ████████████         www.amazingcow.com/n2omatt                ##
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
##        The email is: acknowledgment_opensource@AmazingCow.com              ##
##     3. Altered source versions must be plainly marked as such,             ##
##        and must not be misrepresented as being the original software.      ##
##     4. This notice may not be removed or altered from any source           ##
##        distribution.                                                       ##
##     5. Most important, you must have fun. ;)                               ##
##                                                                            ##
##      Visit opensource.amazingcow.com for more open-source projects.        ##
##                                                                            ##
##                                  Enjoy :)                                  ##
##----------------------------------------------------------------------------##

################################################################################
## Imports                                                                    ##
################################################################################
## Gimp
from gimpfu import *
## Python
import os;
import os.path;


################################################################################
## Constants                                                                  ##
################################################################################
SCRIPT_VERSION = "0.1.0";

ANDROID_SIZE_DICT = {
    "mdpi"    : 48,
    "hdpi"    : 72,
    "xhdpi"   : 96,
    "xxhdpi"  : 144,
    "xxxhdpi" : 192,
};
DESKTOP_SIZE_LIST = [
    512, 255, 128, 64, 32
];


################################################################################
## Functions                                                                  ##
################################################################################
def generate_icon(original_img, size, fullpath, filename):
    tmp_img = original_img.duplicate();

    pdb.gimp_image_scale(tmp_img, size, size);

    tmp_img.merge_visible_layers(0);

    pdb.file_png_save(
        tmp_img,
        tmp_img.layers[0],
        fullpath,
        filename,
        0, 9, 1, 1, 1, 1, 1
    );

    gimp.delete(tmp_img);


def generate_android_icons(original_img, output_path, android_folder_prefix):
    for folder in ANDROID_SIZE_DICT.keys():
        size   = ANDROID_SIZE_DICT[folder];
        folder = "%s-%s" %(android_folder_prefix, folder);

        filename   = "ic_launcher.png";
        folderpath = os.path.join(output_path, "Icons-Android", folder);
        fullpath   = os.path.join(folderpath, filename);

        ## Make sure that folder exists.
        try:
            os.makedirs(folderpath);
        except:
            pass;

        generate_icon(original_img, size, fullpath, filename);


def generate_desktop_icons(original_img, output_path):
    for size in DESKTOP_SIZE_LIST:
        filename   = "icon-%d.png" %(size);
        folderpath = os.path.join(output_path, "Icons-Desktop");
        fullpath   = os.path.join(folderpath, filename);

        ## Make sure that folder exists.
        try:
            os.makedirs(folderpath);
        except:
            pass;

        generate_icon(original_img, size, fullpath, filename)


def create_icons(output_path, android_folder_prefix, generate_desktop):
    original_img = gimp.image_list()[0];

    ## Make the output path the same of the image if
    ## it was not specified.
    if(output_path is None or len(output_path) == 0):
        output_path = os.path.dirname(original_img.filename);

    if(android_folder_prefix is None or len(android_folder_prefix) == 0):
        android_folder_prefix = "mipmap";

    generate_android_icons(original_img, output_path, android_folder_prefix);
    if(generate_desktop):
        generate_desktop_icons(original_img, output_path);



################################################################################
## Registration                                                               ##
################################################################################
register(
    proc_name     = "acow_gimp_icon_maker",
    blurb         = "Create Icons from Image. %s" %(SCRIPT_VERSION),
    help          = "Create Icons from Image. %s" %(SCRIPT_VERSION),
    author        = "N2OMatt <n2o.matt@gmail.com>",
    copyright     = "Amazing Cow! - www.amazingcow.com",
    date          = "2016",
    label         = "<Toolbox>/Xtns/Languages/Python-Fu/AmazingCow/GimpIconMaker",
    imagetypes    = "",
    params        = [
        ( PF_STRING,
          "output_path",
          "Output path - Empty to the same path of image",
          ""
        ),
        ( PF_STRING,
          "android_folder_prefix",
          "Android Folder prefix [drawable | mipmap]",
          "mipmap"
        ),
        ( PF_BOOL,
          "generate_desktop",
          "Generate Desktop icons too?",
          True
        ),
    ],
    results       = [],
    function      = create_icons
)


################################################################################
## Script Initialization                                                      ##
################################################################################
main()
