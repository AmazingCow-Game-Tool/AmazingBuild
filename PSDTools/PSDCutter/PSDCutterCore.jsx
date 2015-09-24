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
#include "../Lib/PSDHelpers.jsx"

// Constants //
kPSDCutterCore_Version = "0.1.3";

function PSDCutterCore()
{
    // Variables //
    this._sourceDoc;
    this._savePath;
    this._shouldStop = false;

    this.outputPath         = null;
    this.processingCallback = null;

    this.saveScenesOnFolders  = true;
    this.savePrefabsOnFolders = true;

    this._currentSaveName = "";
};

// Constants //
PSDCutterCore.kDefaultOutputDir = (app.documents.length == 0)
                                  ? "~/Desktop/Output/"
                                  : pathJoin(app.activeDocument.path, "Output");

PSDCutterCore.kScriptWasStopped   = 1;
PSDCutterCore.kScriptWasCompleted = 0;

///@brief Iterate for all objects of a PSDFile
///and process it based in object type.
///@returns 0
PSDCutterCore.prototype.run = function()
{
    if(app.documents.length == 0)
    {
        alert("No document open... Exiting.");
        return PSDCutterCore.kScriptWasStopped;
    }

    //Set the units to pixels, needed to correct functionality of the script.
    preferences.rulerUnits = Units.PIXELS;

    //Set the reference to current document.
    this._sourceDoc = app.activeDocument;

    //Create the Output folder at same location of
    //source document. If the folder exists delete all its content.
    if(this.outputPath == null)
        this.outputPath = PSDCutterCore.kDefaultOutputDir;

    var folder = new Folder(this.outputPath);
    if(folder.exists)
        folder.remove();
    folder.create();

    //Define the save path of the output images to be a path of output folder.
    this._savePath = folder.fullName;

    //Open the log file.
    openLog(this._sourceDoc.name, this._savePath, false);

    //Iterate for each top object and process it.
    var objectsCount = activeDocument.layers.length;
    for(var i  = 0; i < objectsCount; ++i)
    {
        if(this._shouldStop)
            return PSDCutterCore.kScriptWasStopped;

        //Get the Type of the object.
        //Here are 3 acceptable types.
        // - ObjectType.Prefab
        // - ObjectType.Scene
        // - ObjectType.Ignoreable
        //
        //Since we're at top level, we're going
        //actually ignore the ObjectType.Ignorable.
        var obj = this._sourceDoc.layers[i];

        //Check which type the object is.
        if(ObjectType.findObjectType(obj) == ObjectType.Prefabs)
            this.processPrefabs(obj);
        else if(ObjectType.findObjectType(obj) == ObjectType.Scene)
            this.processScene(obj);
    }

    //Close the log file.
    closeLog();

    return PSDCutterCore.kScriptWasCompleted;
};

PSDCutterCore.prototype.stop = function()
{
    this.processStep("Stopping...");
    this._shouldStop = true;
}

PSDCutterCore.prototype.processStep = function(msg)
{
    if(this.processingCallback != null)
        this.processingCallback(msg);
    log(msg);
}

///@brief Iterate for all objects of a Scene
///and process it based in object type.
///@param scene A "layerset" with ObjectType.Scene
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype.processScene = function(scene)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Check if this scene should be processed.
    if(ObjectType.findObjectType(scene) == ObjectType.Ignorable)
        return;

    this.processStep(scene.name);

    //Reset the saveName, eliminates all the settings from
    //Prefabs if the saveScenesOnFolders is false, so scenes
    //will keep saving right.
    this._currentSaveName = "";
    if(this.saveScenesOnFolders)
    {
        //Update the scene name.
        this._currentSaveName = scene.name;

        //Create the scene folder if it does not exists already.
        var folder = new Folder(pathJoin(this.outputPath,
                                         this._currentSaveName));
        if(!folder.exists)
            folder.create();
    }

    //Iterate for each ui object and process it.
    var objectsCount = scene.layers.length;
    for(var i = 0; i < objectsCount; ++i)
        this.processObject(scene.layers[i]);
};

///@brief Iterate of all objects in Prefabs
///and process them (All prefabs are "smartobjects").
///@param prefabs A "layerset" with ObjectType.Prefabs
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype.processPrefabs = function(prefabs)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    this.processStep("Processing Prefabs");

    //Save a reference for the current document.
    var originalDoc = app.activeDocument;

    for(var i = 0; i < prefabs.layers.length; ++i)
    {
        var smartObject = prefabs.layers[i];

        //Reset the saveName, eliminates all the settings from
        //Scenes if the savePrefabsOnFolders is false, so prefabs
        //will keep saving right.
        this._currentSaveName = "";
        if(this.saveScenesOnFolders)
        {
            //Update the scene name.
            this._currentSaveName = smartObject.name;

            //Create the scene folder if it does not exists already.
            var folder = new Folder(pathJoin(this.outputPath,
                                             this._currentSaveName));
            if(!folder.exists)
                folder.create();
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
            this.processObject(currDoc.layers[j]);

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
PSDCutterCore.prototype.processObject = function(obj)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Check if this scene should be processed.
    if(ObjectType.findObjectType(obj) == ObjectType.Ignorable)
        return;

    if(ObjectType.findObjectType(obj) == ObjectType.Sprite)
        this.processSprite(obj);
    else if(ObjectType.findObjectType(obj) == ObjectType.Button)
        this.processButton(obj);
    else
        this.processStep("Object not recognized: " + name);
};

///@brief Process (Save its contents) a Sprite.
///@param prefabs A "layerset" with ObjectType.Sprite
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype.processSprite = function(sprite)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Get the name of sprite and insert the underscores at right locations.
    //This will transform the name of SpriteEazz to Sprite_Eazz
    var name     = sprite.name;
    var index    = name.indexOf("Sprite");
    var realName = name.substr(index + "Sprite".length, name.length);

    this.processStep(name);

    var spriteName = strConcat("Sprite_", realName, ".png");
    this.saveLayer(sprite, spriteName, PSDLayer.getSize(sprite));

    //Just to keep the PSD organized we rename the first group of the
    //sprite group to contents. :)
    sprite.layers[0].name = "contents";
};

///@brief Process (Save its contents) a Button.
///The button state images will be saved with the same
///size, i.e. the greater size will be used as reference
///to the other state images.
///The smaller ones will be centralized.
///@param prefabs A "layerset" with ObjectType.Button
///@returns None
///@seealso ObjectType
PSDCutterCore.prototype.processButton = function(button)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Get the name of button and insert the underscores at right locations.
    //This will transform the name of ButtonEazz to Button_Eazz
    var name     = button.name;
    var index    = name.indexOf("Button");
    var realName = name.substr(index + "Button".length, name.length);

    this.processStep(name);

    var normalLayer   = null;
    var pressedLayer  = null;
    var disabledLayer = null;

    //Button save paths.
    var normalName   = strConcat("Button_", realName, "_Normal.png");
    var pressedName  = strConcat("Button_", realName, "_Pressed.png");
    var disabledName = strConcat("Button_", realName, "_Disabled.png");

    //For each button state on the button, correct the name in the same
    //way did for for the button name, and call the cut for the state.
    for(var i = 0; i < button.layers.length; ++i)
    {
        var layer = button.layers[i];

        //Check the type of button
             if(layer.name.indexOf("Normal"  ) != -1) normalLayer   = layer;
        else if(layer.name.indexOf("Pressed" ) != -1) pressedLayer  = layer;
        else if(layer.name.indexOf("Disabled") != -1) disabledLayer = layer;
    }

    //Get the max Width and max Height of the layers.
    var maxW = Math.max(PSDLayer.getSize(normalLayer)[0],
                        PSDLayer.getSize(pressedLayer)[0]);
    var maxH = Math.max(PSDLayer.getSize(normalLayer)[1],
                        PSDLayer.getSize(pressedLayer)[1]);

    //Is uncommon but disable layer can
    //occurs so we must get the size of it too.
    if(disabledLayer != null)
    {
        var maxW = Math.max(maxW, PSDLayer.getSize(disabledLayer)[0]);
        var maxH = Math.max(maxH, PSDLayer.getSize(disabledLayer)[1]);

        //Yep, just save the disabled layer already.
        this.saveLayer(disabledLayer, disabledName, [maxW, maxH]);
    }

    //Save the normal and pressed layers.
    this.saveLayer(pressedLayer, pressedName, [maxW, maxH]);
    this.saveLayer(normalLayer,  normalName,  [maxW, maxH]);
};

PSDCutterCore.prototype.saveLayer = function(layer, saveName, layerSize)
{
    //Script was stopped by outside request. Do not do anything
    if(this._shouldStop)
        return;

    //Create the fullpath to save.
    var fullpath = pathJoin(this._savePath,
                            this._currentSaveName,
                            saveName);

    var newDocument = PSDDocument.create(
                        "Temp.psd",       //Name of the document.
                        layerSize[0],     //Width
                        layerSize[1],     //Height
                        this._sourceDoc); //Document that will be
                                          //active after creation.

    PSDLayer.duplicate(
                layer,        //Layer to duplicate.
                newDocument,  //Document that layer will be placed.
                false,        //Merge the layer.
                newDocument); //Document that will be active
                              //after duplication.

    PSDDocument.export(newDocument, fullpath);
    PSDDocument.close(newDocument);
};
