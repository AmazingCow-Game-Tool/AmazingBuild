//----------------------------------------------------------------------------//
//               █      █                                                     //
//               ████████                                                     //
//             ██        ██                                                   //
//            ███  █  █  ███                                                  //
//            █ █        █ █        PSDCutterCore.jsx                         //
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
#include "../Lib/PSDHelpers.jsx"       //General Helpers.
#include "./PSDCutterCore/Helpers.jsx" //Helpers for PSDCutterCore.

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//  PUBLIC STUFF                                                              //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Classes                                                                    //
////////////////////////////////////////////////////////////////////////////////
function PSDCutterCore()
{
    // Private Vars //
    //The document that will be processed.
    //Needed because some PS functions will
    //change the Active document.
    this._sourceDoc = null;

    //First part of path of saved images.
    //Like (~/SomePath). This is always set.
    this._savePath = null;
    //Second part of path of saved images.
    //If PSDCutterCore is set to save scenes and
    //prefabs in separated folders this will contains
    //the name of Scene or Prefab.
    //In conjunction with the this._savePath it'll
    //look like (~/SomePath/NameOfSceneOrPrefab).
    this._currentSaveName = null;

    //Script was stopped by outside request.
    //Every method check it and if it's true
    //returns immediately
    this._shouldStop = false;


    // Public Vars //
    //Paths.
    ///@brief We're is to save the script's output.
    this.outputPath = null;

    //Saving.
    ///@brief Save all inner objects of
    ///ObjectType.Scene into separated folder.
    ///@see ObjectType, savePrefabsOnFolders.
    this.saveScenesOnFolders = false;
    ///@brief Save all inner objects of
    ///ObjectType.Prefab into separated folder.
    ///@see ObjectType, this.savePrefabsOnFolders.
    this.savePrefabsOnFolders = false;

    //COWTODO: Commnet.
    this.saveReferenceImage = true; //COWTODO: default should be false.

    ///@brief True if PSDCutter should generate the logs.
    ///The location of log file is the same location of the output folder.
    ///@see this.outputPath
    this.saveLog              = false;

    //Layers.
    ///@brief If an layer object contains a layer named
    ///the PSDCutterCore.kBoundingBoxLayerName and this
    ///var is set to true it will be cut with the size of
    ///the boundingBox layer. The layer contents will be centered.
    ///@see this.implicityButtonsBoundingBoxes, this.addPadding.
    this.respectBoundingBoxLayers = false;
    ///@brief Makes the layer object of type ObjectType.Button
    ///behaves as if it has a layer named PSDCutterCore.kBoundingBoxLayerName.
    ///@see this.respectBoundingBoxLayers, this.addPadding.
    this.implicityButtonsBoundingBoxes = false;
    ///@brief If true add a PSDCutterCore.kDefaultPadding pixels to each
    ///side of the cut image. This is helpful to avoid some possible image
    ///artifacts.
    ///@see this.respectBoundingBoxLayers, this.implicityButtonsBoundingBoxes.
    this.addPadding= false;

    //Callbacks.
    //COWTODO: Add comment.
    this.processingCallback = null;
};


////////////////////////////////////////////////////////////////////////////////
// Constants                                                                  //
////////////////////////////////////////////////////////////////////////////////

///@brief Constant that PSDCutterCore.run() returns
///when a outside stop request was made.
///@see PSDCutterCore.stop(), PSDCutterCore.run().
PSDCutterCore.kScriptWasStopped   = 1000;
///@brief Constant that PSDCutterCore.run() returns
///when script was completed.
///@see PSDCutterCore.stop(), PSDCutterCore.run().
PSDCutterCore.kScriptWasCompleted = 2000;

///@brief Padding that is added to the cut image if
///PSDCutterCore.addPadding is set to true.
///@see PSDCutterCore.addPadding.
PSDCutterCore.kDefaultPadding = [2, 2];

///@brief A default path for saved images.
PSDCutterCore.kDefaultOutputPath = (app.documents.length == 0)
                                    ? "~/Desktop/Output/"
                                    : PSDHelpers.FS.pathJoin(app.activeDocument.path, "Output");


////////////////////////////////////////////////////////////////////////////////
// Methods                                                                    //
////////////////////////////////////////////////////////////////////////////////
///@brief Iterate for all objects of a PSDFile
///and process it based in object type.
///@returns PSDCutterCore.kScriptWasCompleted if script was complete
///of PSDCutterCore.kScriptWasStopped if the script was stopped by
///an outside request.
///@see PSDCutterCore.kScriptWasCompleted, PSDCutterCore.kScriptWasStopped,
///PSDCutterCore.stop()
PSDCutterCore.prototype.run = function()
{
    //There is no document opened - Cannot continue.
    if(app.documents.length == 0)
    {
        alert("No document open... Exiting.");
        return PSDCutterCore.kScriptWasStopped;
    }

    //Set the units to pixels, needed to correct functionality of the script.
    preferences.rulerUnits = Units.PIXELS;

    //Set the reference to current document.
    this._sourceDoc = app.activeDocument;

    //Create the output folder and define the save path
    //of the output images to be a path of output folder.
    var folder = PSDHelpers.FS.createFolder(this.outputPath);
    this._savePath = folder.fullName;

    //Open the log file;
    //COWTODO: Add the log stuff.

    //Reset the save path, for the cases that
    //the save on folders are false.
    this._resetCurrentSavePath();

    //Process.
    this._startProcessing();

    return PSDCutterCore.kScriptWasCompleted;
};

PSDCutterCore.prototype.stop = function()
{
    this._processStep("Stopping...");
    this._shouldStop = true;
}



////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//  PRIVATE STUFF                                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////


PSDCutterCore.prototype._processStep = function(msg)
{}

//COWTODO: Add the doxygen comments.
PSDCutterCore.prototype._startProcessing = function()
{
    //Iterate for each top object and process it.
    for(var i  = 0; i < this._sourceDoc.layers.length; ++i)
    {
        if(this._shouldStop)
            return PSDCutterCore.kScriptWasStopped;

        //Get the Type of the object.
        //Here are 3 acceptable types.
        // - ObjectType.Prefab
        // - ObjectType.Scene
        // - ObjectType.Ignorable
        //Since we're at top level, we're going
        //actually ignore the ObjectType.Ignorable.
        var obj = this._sourceDoc.layers[i];

        //Check which type the object is.
        if(ObjectType.findObjectType(obj) == ObjectType.Prefabs)
            this._processPrefabs(obj);
        else if(ObjectType.findObjectType(obj) == ObjectType.Scene)
            this._processScene(obj);
    }

};

///@brief Iterate for all objects of a Scene
///and process it based in object type.
///@param scene A "layerset" with ObjectType.Scene
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype._processScene = function(scene)
{
    //Script was stopped by outside request. Do not do anything.
    if(this._shouldStop)
        return;

    //Check if this scene should be processed.
    if(ObjectType.findObjectType(scene) == ObjectType.Ignorable)
        return;

    //Reset the fullpath for save items.
    this._resetCurrentSavePath();

    //If is defined to save the scene into
    //a separated folder create one now.
    if(this.saveScenesOnFolders)
    {
        var fullpath = PSDHelpers.FS.pathJoin(this.outputPath, scene.name);
        PSDHelpers.FS.createFolder(fullpath);

        this._currentSaveName = scene.name;
    }

    //Iterate for each element of scene and process it.
    for(var i = 0; i < scene.layers.length; ++i)
        this._processObject(scene.layers[i]);

    //COWTODO: Comment.
    if(this.saveReferenceImage)
        this._saveRefImage(scene);
};

///@brief Iterate of all objects in Prefabs
///and process them (All prefabs are "smartobjects").
///@param prefabs A "layerset" with ObjectType.Prefabs
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype._processPrefabs = function(prefabs)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Save a reference for the current document.
    var originalDoc = app.activeDocument;

    for(var i = 0; i < prefabs.layers.length; ++i)
    {
        var smartObject = prefabs.layers[i];

        //If is defined to save the scene into
        //a separated folder create one now.
        if(this.savePrefabsOnFolders)
        {
            var fullpath = PSDHelpers.FS.pathJoin(this.outputPath, smartObject.name);
            PSDHelpers.FS.createFolder(fullpath);

            this._currentSaveName = smartObject.name;
        }

        //Check if we're dealing with a group to ignore.
        if(ObjectType.findObjectType(smartObject) == ObjectType.Ignorable)
            continue;

        //Open a smartobject.
        this._sourceDoc.activeLayer = prefabs.layers[i];
        var idAction = stringIDToTypeID("placedLayerEditContents");
        var idDesc   = new ActionDescriptor();
        executeAction(idAction, idDesc, DialogModes.NO);

        var currDoc = app.activeDocument;
        this._sourceDoc = currDoc;

        //Process the objects inside the smartobject.
        for(var j = 0; j < currDoc.layers.length; ++j)
            this._processObject(currDoc.layers[j]);

        currDoc.close(SaveOptions.DONOTSAVECHANGES);
        this._sourceDoc = originalDoc
    }

    this._sourceDoc = originalDoc;
};

///@brief Process (Save its contents) an object.
///@param prefabs A "layerset" with ObjectType.Sprite,
///ObjectType.Sprite, ObjectType.Button.
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype._processObject = function(obj)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Check if this scene should be processed.
    if(ObjectType.findObjectType(obj) == ObjectType.Ignorable)
        return;

    //Process the object based and it's type.
    var objType = ObjectType.findObjectType(obj);
    if(objType == ObjectType.Sprite)
        this._processSprite(obj);
    else if(objType == ObjectType.Button)
        this._processButton(obj);
    else if(objType == ObjectType.Scene) //This enables Scenes inside Scenes|Prefabs...
        this._processScene(obj);
    else if(objType == ObjectType.Prefabs) //This enables Prefabs inside Scenes|Prefabs...
        this._processPrefabs(obj);

};

///@brief Process (Save its contents) a Sprite.
///@param prefabs A "layerset" with ObjectType.Sprite
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype._processSprite = function(sprite)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Canonize and build the save name.
    //So the layer could be named anything like:
    //  Type_Name | TypeName | NameType | Name_Type
    //  (underscores doesn't matter here)
    //That the output will be:
    //  Type_Name.png
    var canonizedName = ObjectType.canonizeName(sprite.name);
    var saveName      = PSDHelpers.String.concat(canonizedName, ".png");

    //Just to keep the PSD organized we rename the first group of the
    //sprite group to contents. :)
    sprite.layers[0].name = "contents";

    //Save...
    this._saveLayer(sprite,
                    saveName,
                    this._getAddPadding());
};

///@brief Process (Save its contents) a Button.
///The button state images will be saved with the same
///size, i.e. the greater size will be used as reference
///to the other state images.
///The smaller ones will be centralized.
///@param prefabs A "layerset" with ObjectType.Button
///@returns None
///@see ObjectType
PSDCutterCore.prototype._processButton = function(button)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Canonize and build the save name.
    //So the layer could be named anything like:
    //  Type_Name | TypeName | NameType | Name_Type
    //  (underscores doesn't matter here)
    //That the output will be:
    //  Type_Name.png
    var canonizedName = ObjectType.canonizeName(button.name);

    //Button save names.
    var normalName   = PSDHelpers.String.concat(canonizedName, "_Normal.png"  );
    var pressedName  = PSDHelpers.String.concat(canonizedName, "_Pressed.png" );
    var disabledName = PSDHelpers.String.concat(canonizedName, "_Disabled.png");

    //The state layers.
    var normalLayer   = null;
    var pressedLayer  = null;
    var disabledLayer = null;

    //Find and assign the state layers to the named vars.
    for(var i = 0; i < button.layers.length; ++i)
    {
        var layer = button.layers[i];

        if     (layer.name.indexOf("Normal"  ) != -1) normalLayer   = layer;
        else if(layer.name.indexOf("Pressed" ) != -1) pressedLayer  = layer;
        else if(layer.name.indexOf("Disabled") != -1) disabledLayer = layer;
    }

    var normalLayerPadding   = [0,0];
    var pressedLayerPadding  = [0,0];
    var disabledLayerPadding = [0,0];

    if(this.implicityButtonsBoundingBoxes)
    {
        //Get the layers' size.
        var normalLayerSize   = PSDLayer.getSize(normalLayer);
        var pressedLayerSize  = PSDLayer.getSize(pressedLayer);
        var disabledLayerSize = PSDLayer.getSize(disabledLayer);

        //Get the max Width and max Height of the layers.
        var maxW = Math.max(normalLayerSize  [0],
                            pressedLayerSize [0],
                            disabledLayerSize[0]);

        var maxH = Math.max(normalLayerSize  [1],
                            pressedLayerSize [1],
                            disabledLayerSize[1]);


        var padding = this._getAddPadding();

        //Calculate the paddings...
        var maxWithPadding = [maxW + padding[0],
                              maxH + padding[1]];

        normalLayerPadding   = [Math.abs(maxWithPadding[0] - normalLayerSize[0]),
                                Math.abs(maxWithPadding[1] - normalLayerSize[1])];

        pressedLayerPadding  = [Math.abs(maxWithPadding[0] - pressedLayerSize[0]),
                                Math.abs(maxWithPadding[1] - pressedLayerSize[1])];

        disabledLayerPadding = [Math.abs(maxWithPadding[0] - disabledLayerSize[0]),
                                Math.abs(maxWithPadding[1] - disabledLayerSize[1])];
    }

    //Save the layers....
    this._saveLayer(normalLayer,   normalName,    normalLayerPadding);
    this._saveLayer(pressedLayer,  pressedName,   pressedLayerPadding);
    this._saveLayer(disabledLayer, disabledName,  disabledLayerPadding);
};


////////////////////////////////////////////////////////////////////////////////
// Helper Methods                                                             //
////////////////////////////////////////////////////////////////////////////////
//COWTODO: Add doxygen docs.
PSDCutterCore.prototype._resetCurrentSavePath = function()
{
    this._currentSaveName = "";
}

//COWTODO: Add doxygen docs.
PSDCutterCore.prototype._saveLayer = function(layer, saveName, padding)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Nothing to save...
    if(layer == null)
        return;

    //Create the fullpath to save.
    var fullpath = PSDHelpers.FS.pathJoin(this._savePath,        //Path of output folder.
                                          this._currentSaveName, //Path of scene|prefab if is to save on folder.
                                          saveName);             //The actual object name.

    var newDocument = PSDDocument.create("Temp.psd",  //Name of the document.
                                                  1,  //Width.  (This don't matter here.)
                                                  1,  //Height. (This don't matter here.)
                                    this._sourceDoc); //Document that will be active after creation.

     PSDDocument.duplicateLayer(layer,                         //Layer to duplicate.
                                padding,                       //OBIVOUS :O.
                                this.respectBoundingBoxLayers, //Respect bounding box layers.
                                newDocument,                   //Document that layer will be placed.
                                newDocument);                  //Document that will be active after duplication.

    PSDDocument.export(newDocument, fullpath);
    PSDDocument.close(newDocument);
};

PSDCutterCore.prototype._getAddPadding = function()
{
    if(this.addPadding)
        return PSDCutterCore.kDefaultPadding;

    return [0,0];
}

//COWTODO: Comment.
PSDCutterCore.prototype._saveRefImage = function(layer)
{
    var duplicatedLayer = layer.duplicate();
    duplicatedLayer     = duplicatedLayer.merge();

    this._saveLayer(layer,
                    PSDHelpers.String.concat(layer.name, "_REF.png"),
                    [0, 0]);

    duplicatedLayer.remove();
}
