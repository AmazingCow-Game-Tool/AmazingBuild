//----------------------------------------------------------------------------//
//               █      █                                                     //
//               ████████                                                     //
//             ██        ██                                                   //
//            ███  █  █  ███                                                  //
//            █ █        █ █        PSDHelpers.jsx                            //
//             ████████████         AmazingBuild                              //
//           █              █       Copyright (c) 2015 AmazingCow             //
//          █     █    █     █      www.AmazingCow.com                        //
//          █     █    █     █                                                //
//           █              █       N2OMatt - n2omatt@amazingcow.com          //
//             ████████████         www.amazingcow.com/n2omatt                //
//                                                                            //
//                                                                            //
//                  This software is licensed as GPL-v3                       //
//                 CHECK THE COPYING FILE TO MORE DETAILS                     //
//                                                                            //
//    Permission is granted to anyone to use this software for any purpose,   //
//   including commercial applications, and to alter it and redistribute it   //
//               freely, subject to the following restrictions:               //
//                                                                            //
//     0. You **CANNOT** change the type of the license.                      //
//     1. The origin of this software must not be misrepresented;             //
//        you must not claim that you wrote the original software.            //
//     2. If you use this software in a product, an acknowledgment in the     //
//        product IS HIGHLY APPRECIATED, both in source and binary forms.     //
//        (See opensource.AmazingCow.com/acknowledgment.html for details).    //
//        If you will not acknowledge, just send us a email. We'll be         //
//        *VERY* happy to see our work being used by other people. :)         //
//        The email is: acknowledgmentopensource@AmazingCow.com               //
//     3. Altered source versions must be plainly marked as such,             //
//        and must notbe misrepresented as being the original software.       //
//     4. This notice may not be removed or altered from any source           //
//        distribution.                                                       //
//     5. Most important, you must have fun. ;)                               //
//                                                                            //
//      Visit opensource.amazingcow.com for more open-source projects.        //
//                                                                            //
//                                  Enjoy :)                                  //
//----------------------------------------------------------------------------//

var PSDHelpers = function(){};

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// String                                                                     //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

//Namespace like.
PSDHelpers.String = function() {};

///@brief Concat several strings. Like the python's "".join(list_of_strings).
///@param A variable length of strings.
///@returns A concatenated string.
PSDHelpers.String.concat = function()
{
    var fullStr = "";
    for(var i = 0; i < arguments.length; ++i)
        fullStr += arguments[i];
    return fullStr;
};


///@brief Remove all occurrences of ch from the left of str.
///@param str The string that will be cleaned.
///@param ch  The char that will be removed.
///@returns A new string with the chars removed.
PSDHelpers.String.lstrip = function(str, ch)
{
    index = -1;
    for(var i = 0; i < str.length; ++i)
    {
        if(str[i] != ch)
        {
            index = i;
            break;
        }
    }

    if(index == -1)
        return "";

    return str.substr(index, str.length);
};

///@brief Remove all occurrences of ch from the right of str.
///@param str The string that will be cleaned.
///@param ch  The char that will be removed.
///@returns A new string with the chars removed.
PSDHelpers.String.rstrip = function(str, ch)
{
    index = str.length;
    for(var i = str.length -1; i >= 0; --i)
    {
        if(str[i] != ch)
        {
            index = i;
            break;
        }
    }
    return str.substr(0, index+1);
};

///@brief Remove all occurrences of ch from the left and right of str.
///@param str The string that will be cleaned.
///@param ch  The char that will be removed.
///@returns A new string with the chars removed.
PSDHelpers.String.strip = function(str, ch)
{
    return PSDHelpers.String.rstrip(PSDHelpers.String.lstrip(str, ch), ch);
};

///@brief Remove all occurrences of whitespace char from the string.
///@param str The string that will be cleaned.
///@returns A new string with all whitespace removed.
PSDHelpers.String.removeSpaces = function(str)
{
    while(str.indexOf(" ") != -1)
        str = str.replace(" ", "");

    return str;
};



////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// Filesystem Functions                                                       //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

//Namepace like.
PSDHelpers.FS = function(){};

///@brief Join the paths components in the same way of python's os.path.join
///@param A variable length of path components.
///@returns A string with all path components joined without the trailing /.
PSDHelpers.FS.pathJoin = function()
{
    //COWTODO: Today this method is very *nix centered, should we support windows?
    var fullpath = "";
    for(var i = 0; i < arguments.length -1; ++i)
    {
        fullpath += arguments[i];
        if(fullpath.slice(-1) != "/")
            fullpath += "/";
    }
    fullpath += arguments[arguments.length -1];
    return fullpath;
};

//COWTODO: Add Doxygen comments.
PSDHelpers.FS.createFolder = function(path, removeIfExists)
{
    var folder = new Folder(path);
    if(folder.exists)
        folder.remove();
    folder.create();

    return folder;
}




////////////////////////////////////////////////////////////////////////////////
// Layer Functions                                                            //
////////////////////////////////////////////////////////////////////////////////
function PSDLayer()
{
    // Empty //
};

///@brief Get the x and y coordinates of the layer.
///@param The layer that will be queried.
///@returns An array of two floats representing the x and y.
PSDLayer.getPosition = function(layer)
{
    if(layer == null)
        return [0, 0];

    return [layer.bounds[0].value, layer.bounds[1].value];
};

///@brief Get the width and height of the layer.
///@param The layer that will be queried.
///@warning THIS FUNCTION MIGHT CONTAIN A BUG. SEE IT'S COMMENTS.
///@returns An array of two floats representing the width and height.
PSDLayer.getSize = function(layer)
{
    if(layer == null)
        return [0, 0];

    //Just to ease the typing.
    var doc = app.activeDocument;

    //Merge a duplicated layer, so the original one keeps untouched.
    //Get its bounds and remove it. Also restore the history state.
    var duplicatedLayer = layer.duplicate();
    duplicatedLayer     = duplicatedLayer.merge();
    var bounds          = duplicatedLayer.bounds;
    duplicatedLayer.remove();

    //Seems that Photoshop (at least the CS6 for OSX) contains
    //a strange bug, that while pass unnoticed in the GUI usage
    //when is used in scripts make a big difference.
    //The bug is that PS place the objects with 1px offset from
    //the position reported in the GUI. So when you place a layer
    //in the position xy(0,0) it's actually being placed in the
    //position xy(-1, -1).
    //This affects the width and height of the object of the same
    //amount, so it will have a +1 width and +1 height.
    //I do not know if this is a real bug or it's me making some
    //wrong stuff. I'm checked and rechecked my calculations and
    //seems that it's right, making the other possibility (the PS bug)
    //more plausible for me.
    //I only have a PSCS6 at OSX 10.10, so I do not know how this code
    //will behave in another systems and PS versions.
    //SOLUTION:
    //  Since it is offsetting all the bounds' values by the same amount
    //  is pretty easy to figure out that we just have to subtract them :).
    //
    var x = bounds[0];
    var y = bounds[1];
    var w = bounds[2];
    var h = bounds[3];


    return [w - Math.abs(x),
            h - Math.abs(y)];
};




//COWTODO: check.
//http://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/
//
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
