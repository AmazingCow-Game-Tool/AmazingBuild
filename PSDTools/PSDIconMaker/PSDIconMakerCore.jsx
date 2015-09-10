//----------------------------------------------------------------------------//
//               █      █                                                     //
//               ████████                                                     //
//             ██        ██                                                   //
//            ███  █  █  ███                                                  //
//            █ █        █ █        PSDIconMakerCore.jsx                      //
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

//Import the needed helper functions.
#include "../Lib/PSDHelpers.jsx"

// Constants //
kPSDIconMakerCore_Version = "0.1.1";

function PSDIconMakerCore()
{
    // Variables //
    this._sourceDoc   = null;
    this._savePath    = null;
    this._shouldStop  = false;

    this.outputPath         = null;
    this.processingCallback = null;
    this.resampleMethod     = ResampleMethod.BICUBICSMOOTHER;
    this.iconSizeList       = [ 1024, 512, 128, 80, 58, 57, 29 ];
};

// Constants //
PSDIconMakerCore.kDefaultOutputDir = (app.documents.length == 0)
                                     ? "~/Desktop/Output/"
                                     : pathJoin(app.activeDocument.path, "Output");

PSDIconMakerCore.kScriptWasStopped   = 1;
PSDIconMakerCore.kScriptWasCompleted = 0;


PSDIconMakerCore.prototype.run = function()
{
    if(app.documents.length == 0)
    {
        alert("No document open... Exiting.");
        return PSDIconMakerCore.kScriptWasStopped;
    }

    //Set the units to pixels, needed to correct functionality of the script.
    preferences.rulerUnits = Units.PIXELS;

    //Set the reference to current document.
    this._sourceDoc = app.activeDocument;

    //Create the Output folder at same location of
    //source document. If the folder exists delete all its content.
    if(this.outputPath == null)
        this.outputPath = PSDIconMakerCore.kDefaultOutputDir;

    var folder = new Folder(this.outputPath);
    if(folder.exists)
        folder.remove();
    folder.create();

    //Define the save path of the output images to be a path of output folder.
    this._savePath = folder.fullName;

    //Open the log file.
    openLog(this._sourceDoc.name, this._savePath, false);

    for(var i = 0; i < this.iconSizeList.length; ++i)
    {
        if(this._shouldStop)
            return PSDIconMakerCore.kScriptWasStopped;

        this.generateIcon(this.iconSizeList[i]);
    }


    //Close the log file.
    closeLog();

    return PSDIconMakerCore.kScriptWasCompleted;
}

// Functions //
PSDIconMakerCore.prototype.processStep = function(msg)
{
    if(this.processingCallback != null)
        this.processingCallback(msg);
    log(msg);
}

PSDIconMakerCore.prototype.generateIcon = function(iconSize)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Build the save name and path to save.
    var saveName = strConcat("Icon-", iconSize, ".png")
    var fullpath = pathJoin(this._savePath, saveName);

    //Inform the processing.
    var msg = strConcat("Generation icon of size: ",
                        iconSize,
                        " -- Saving at: ",
                        fullpath);
    this.processStep(msg);


    //Create the icon.
    var currLayer   = this._sourceDoc.layers[0];
    var layerSize   = getLayerSize(currLayer);
    var newDocument = createDocument("Temp.png",       //Name of the document.
                                     layerSize[0],     //Width
                                     layerSize[1],     //Height
                                     this._sourceDoc); //Document that will be
                                                       //active after creation.

    duplicateLayer(currLayer,    //Layer to duplicate.
                   newDocument,  //Document that layer will be placed.
                   true,         //Merge the layer.
                   newDocument); //Document that will be
                                 //active after duplication.

    newDocument.resizeImage(iconSize,             //Width.
                            iconSize,             //Height.
                            72,                   //Resolution.
                            this.resampleMethod); //ResampleMethod.

    exportDocument(newDocument, fullpath);
    closeDocument(newDocument);
}
