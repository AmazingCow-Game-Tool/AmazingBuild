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
// Constants //
kPSDHelpers_Version = "0.1";

// Variables //
var logFile;

//COWTODO: Doxygen Comment.
var ObjectType = {
    Prefabs   : "Prefabs",
    Sprite    : "Sprite",
    Scene     : "Scene",
    Button    : "Button",
    Ignorable : "Ignorable",
    Unknown   : "Unknown",
};

//COWTODO: Doxygen Comment.
function findObjectType(group)
{
    var name = group.name;

    if(name[0] == "_")                        return ObjectType.Ignorable;
    if(name == ObjectType.Prefabs           ) return ObjectType.Prefabs;
    if(name.indexOf(ObjectType.Sprite) != -1) return ObjectType.Sprite;
    if(name.indexOf(ObjectType.Scene ) != -1) return ObjectType.Scene;
    if(name.indexOf(ObjectType.Button) != -1) return ObjectType.Button;

    return ObjectType.Unknown;
}

////////////////////////////////////////////////////////////////////////////////
// Log Functions                                                              //
////////////////////////////////////////////////////////////////////////////////
//COWTODO: Doxygen Comment.
function log(str)
{
    logFile.writeln(str);
};
//COWTODO: Doxygen Comment.
function openLog(name, path, enabled)
{
    //COWTODO: Comment.
    if(enabled)
    {
        logFile = File(path + name + ".txt");
        $.writeln(logFile.absoluteURI);
        logFile.open("w");
    }
    else
    {
         logFile = $;
    }
}
//COWTODO: Doxygen Comment.
function closeLog()
{
    //COWTODO: Comment.
    if(logFile != $)
        logFile.close();
}

///@brief Remove all occurrences of ch from the left of str.
///@param str The string that will be cleaned.
///@param ch  The char that will be removed.
///@returns A new string with the chars removed.
function lstrip(str, ch)
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
}
///@brief Remove all occurrences of ch from the right of str.
///@param str The string that will be cleaned.
///@param ch  The char that will be removed.
///@returns A new string with the chars removed.
function rstrip(str, ch)
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
}
///@brief Remove all occurrences of ch from the left and right of str.
///@param str The string that will be cleaned.
///@param ch  The char that will be removed.
///@returns A new string with the chars removed.
function strip(str, ch)
{
    return rstrip(lstrip(str, ch), ch);
}

///@brief Remove all occurrences of whitespace char from the string.
///@param str The string that will be cleaned.
///@returns A new string with all whitespace removed.
function removeSpaces(str)
{
    while(str.indexOf(" ") != -1)
        str = str.replace(" ", "");

    return str;
};

////////////////////////////////////////////////////////////////////////////////
// Filesystem Functions                                                       //
////////////////////////////////////////////////////////////////////////////////
///@brief Join the paths components in the same way of python's os.path.join
///@param A variable length of path components.
///@returns A string with all path components joined without the trailing /.
function pathJoin()
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
}

////////////////////////////////////////////////////////////////////////////////
// Document Functions                                                         //
////////////////////////////////////////////////////////////////////////////////
///@brief Create a new Photoshop document.
///@param filename The filename of the new document.
///@param width Width of the new document.
///@param height Height of the new document.
///@param documentActiveAfterCreation Which document will be set as the 
///       app.activeDocument. If no document is passed, the created one
///       is set to active.
//@returns The new created document.
function createDocument(filename, width, height, documentActiveAfterCreation)
{
    var newDoc = app.documents.add(width,                     //Width of layer.
                                   height,                    //Height of layer.
                                   72,                        //DPI.
                                   filename,                  //Complete filename.
                                   NewDocumentMode.RGB,       //Document Mode.
                                   DocumentFill.TRANSPARENT); //Fill type.

    //If documentActiveAfterCreation is not undefined means that we
    //must set the App Active Document to this document.
    if(documentActiveAfterCreation != undefined)
        app.activeDocument = documentActiveAfterCreation;

    return newDoc;
}
///@brief Save the document to a file with the extension PSD.
//@param doc The Photoshop document that will be saved.
//@param filename The fullpath of the file that will be created to save the doc.
//@returns Nothing
function saveDocument(doc, filename)
{
    var file = new File(filename);
    doc.saveAs(file, SaveDocumentType.PHOTOSHOP , true, Extension.LOWERCASE);
}
///@brief Save the document to a file with the extension PNG.
//@param doc The Photoshop document that will be saved.
//@param filename The fullpath of the file that will be created to save the doc.
//@returns Nothing
function exportDocument(doc, filename)
{
    var file = new File(filename);
    doc.saveAs(file, SaveDocumentType.PNG, true, Extension.LOWERCASE);
}
///@brief Close the document without save.
//@param doc The Photoshop document that will be closed.
//@returns Nothing
function closeDocument(doc)
{
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

////////////////////////////////////////////////////////////////////////////////
// Layer Functions                                                            //
////////////////////////////////////////////////////////////////////////////////
//COWTODO: Doxygen Comment.
function duplicateLayer(layer, intoDocument, merge, documentActiveAfterOperation)
{
    //Duplicate the layer into the document
    //and merge if needed.
    var duplicatedLayer = layer.duplicate(intoDocument, ElementPlacement.INSIDE);

    app.activeDocument = intoDocument;

    //COWTODO: Comment.
    centerLayer(duplicatedLayer);
    if(merge)
        duplicatedLayer = duplicatedLayer.merge();

    if(documentActiveAfterOperation != undefined)
        app.activeDocument = documentActiveAfterOperation;

    return duplicatedLayer;
}
//COWTODO: Doxygen Comment.
function setLayerPosition(layer, x, y)
{
    var pos = getLayerPosition(layer);

    pos[0] = x - pos[0];
    pos[1] = y - pos[1];

    layer.translate(pos[0], pos[1]);
}
//COWTODO: Doxygen Comment.
function getLayerPosition(layer)
{
    return [layer.bounds[0].value, layer.bounds[1].value];
}
//COWTODO: Doxygen Comment.
function getLayerSize(layer)
{
    var pos = getLayerPosition(layer);
    return [Math.abs(pos[0] - layer.bounds[2].value),
            Math.abs(pos[1] - layer.bounds[3].value)];
}
//COWTODO: Doxygen Comment.
function centerLayer(layer)
{
    var docW      = app.activeDocument.width;
    var docH      = app.activeDocument.height;
    var docCenter = [docW / 2, docH / 2];

    var layerPos    = getLayerPosition(layer);
    var layerSize   = getLayerSize(layer);
    var layerCenter = [layerSize[0] / 2, layerSize[1] / 2];

    setLayerPosition(layer, docCenter[0], docCenter[1]);
    setLayerPosition(layer,
                     docCenter[0] - layerCenter[0],
                     docCenter[1] - layerCenter[1]);
}
