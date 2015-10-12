//----------------------------------------------------------------------------//
//               █      █                                                     //
//               ████████                                                     //
//             ██        ██                                                   //
//            ███  █  █  ███                                                  //
//            █ █        █ █        PSDCutterGUI.jsx                          //
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
#include "PSDCutterCore.jsx"

// Constants //
kPSDCutterGUI_Version = "0.1.3";

// Vars //
var cutterCore     = null;
var dialog         = null;
var postScriptPath = null;

// Constants //
kWindowTitle = "AmazingCow - PSDCutter - v" + kPSDCutterGUI_Version;

////////////////////////////////////////////////////////////////////////////////
// GUI Helpers                                                                //
////////////////////////////////////////////////////////////////////////////////
var addPanel = function(parent, name, title, alignment)
{
    parent[name] = parent.add("panel", undefined, title);
    if(alignment != undefined)
        parent[name].alignChildren = alignment;
}
var addGroup = function(parent, name)
{
    parent[name] = parent.add("group");
}
var addLabel = function(parent, name, title)
{
    parent[name] = parent.add("statictext", undefined, title);
}
var addTextField = function(parent, name, contents, size)
{
    parent[name] = parent.add("edittext", undefined, contents);
    if(size != undefined)
        parent[name].preferredSize = size;
}
var addButton = function(parent, name, title, size)
{
    parent[name] = parent.add("button", undefined, title);
    if(size != undefined)
        parent[name].preferredSize = size;
}
var addCheckbox = function(parent, name, title)
{
    parent[name] = parent.add("checkbox", undefined, title);
}


////////////////////////////////////////////////////////////////////////////////
// Configuration Panel                                                        //
////////////////////////////////////////////////////////////////////////////////
var createConfigurationPanel = function()
{
    //Create the Configuration Panel.
    addPanel(dialog, "configPanel", "Configuration");

    //Create the groups.
    with(dialog)
    {
        addGroup(configPanel, "outputGroup");
        addGroup(configPanel, "saveFoldersGroup");
    }

    with(dialog.configPanel)
    {
        //Label.
        addLabel(outputGroup, "label", "Output Folder:");

        //Text Field.
        addTextField(outputGroup,
                     "textField",
                     PSDCutterCore.kDefaultOutputDir,
                     [400, 20]);

        //Browse Button.
        addButton(outputGroup, "browseButton", "...", [40, 20]);
        outputGroup.browseButton.onClick = onOutputBrowseButtonPressed;

        //Scenes / Prefabs checkboxes.
        var msg = "Save scenes on separated folders";
        addCheckbox(saveFoldersGroup, "scenesCheckbox", msg);

        msg = "Save prefabs on separated folders";
        addCheckbox(saveFoldersGroup, "prefabsCheckbox", msg);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Post Run Panel                                                             //
////////////////////////////////////////////////////////////////////////////////
var createPostRunPanel = function()
{
    //Create the PostRun Panel.
    addPanel(dialog, "postRunPanel", "Post Run");

    //Create the PostRun Group.
    with(dialog)
    {
        addGroup(postRunPanel, "postRunGroup");
    }

    //Create the PostRun UI elements.
    with(dialog.postRunPanel)
    {
        addLabel    (postRunGroup, "label",        "Script path:");
        addTextField(postRunGroup, "textField",    "",    [400, 20]);
        addButton   (postRunGroup, "browseButton", "...", [40, 20]);

        //Set the callback
        postRunGroup.browseButton.onClick = onPostRunBrowseButtonPressed;
    }
}


////////////////////////////////////////////////////////////////////////////////
// ScriptOutput Panel                                                         //
////////////////////////////////////////////////////////////////////////////////
var createScriptOutputPanel = function()
{
    //Create the Script Output Panel.
    addPanel(dialog, "outputPanel", "Script Output:");

    //Create the Output Group.
    with(dialog)
    {
        addGroup(outputPanel, "outputGroup");
    }

    //Add the field.
    with(dialog.outputPanel)
    {
        outputGroup.textField = outputGroup.add("edittext",
                                                 undefined,
                                                "",
                                                {multiline:true});
        outputGroup.textField.preferredSize = [550, 400];
    }
}

////////////////////////////////////////////////////////////////////////////////
// Buttons Panel                                                              //
////////////////////////////////////////////////////////////////////////////////
var createButtonsPanel = function()
{
    //Create the Buttons Panel.
    //COWOTODO: Find way to make the group border hidden.
    addPanel(dialog, "buttonPanel", "");
    dialog.buttonPanel.orientation = "row";

    with(dialog)
    {
        //Number of openned documents. We will disable build
        //button if there is no document opened.
        var docsCount = app.documents.length;

        //Build Button.
        addButton(buttonPanel, "buildButton", "Build");
        buttonPanel.buildButton.onClick = onBuildButtonPressed;
        //Disable if no documents are open.
        if(docsCount == 0)
            buttonPanel.buildButton.enabled = false;

        //Exit Button.
        addButton(buttonPanel, "exitButton", "Exit");
        buttonPanel.exitButton.onClick = onExitButtonPressed;

        //About Button.
        addButton(buttonPanel, "aboutButton", "About");
        buttonPanel.aboutButton.onClick = onAboutButtonPressed;
    }
}

////////////////////////////////////////////////////////////////////////////////
// Create GUI                                                                 //
////////////////////////////////////////////////////////////////////////////////
// GUI Creation //
///@brief Create the Script GUI.
///@returns None
var createGUI = function()
{
    //Create the Dialog.
    dialog = new Window("dialog", kWindowTitle);
    dialog.frameLocation = [100, 100];

    //Create the Dialog UI.
    createConfigurationPanel();
    createPostRunPanel();
    createScriptOutputPanel();
    createButtonsPanel();
}


////////////////////////////////////////////////////////////////////////////////
// Button Callbacks                                                           //
////////////////////////////////////////////////////////////////////////////////
///@brief Callback for when the Build Button gets pressed.
///@returns None
var onBuildButtonPressed = function()
{
    //Check if the data fields have valid data.
    if(!checkDialogDataFields())
        return;

    //Disable the buttons.
    dialog.configPanel.outputGroup.browseButton.enabled = false;
    dialog.buttonPanel.buildButton.enabled              = false;

    outpath     = dialog.configPanel.outputGroup.textField.text;
    saveFolders = dialog.configPanel.saveFoldersGroup.scenesCheckbox.value;
    savePrefabs = dialog.configPanel.saveFoldersGroup.scenesCheckbox.value;

    //Create the PSDCutterCore object, sets the
    //processing callback and start the processing...
    cutterCore = new PSDCutterCore();

    cutterCore.outputPath           = outpath;
    cutterCore.saveScenesOnFolders  = saveFolders;
    cutterCore.savePrefabsOnFolders = savePrefabs;
    cutterCore.processingCallback   = onProcessingCallback;

    var retVal = cutterCore.run();

    if(retVal == PSDCutterCore.kScriptWasCompleted)
    {
        var cutterCoreMsg = "PSDCutterCore - Completed sucessfully...";
        var scriptMsg     = "";

        if(postScriptPath != null)
        {
            var f = new File(postScriptPath);
            if(f.execute())
                scriptMsg = "Post Run Script - Was executed...";
            else
                scriptMsg = "Post Run Script - Was NOT executed...";
        }

        alert(strConcat("Done...", "\n", cutterCoreMsg, "\n", scriptMsg));
        dialog.close();
    }
}

///@brief Callback for when Exit Button gets pressed.
///@returns None
var onExitButtonPressed = function()
{
    //Disable the exit button.
    dialog.buttonPanel.exitButton.enabled = false;

    if(cutterCore != null)
    {
        cutterCore.stop();
        alert("Script processing stopped.");
    }

    dialog.close();
}
///@brief Callback for when ... Button of Output gets pressed.
///@returns None
var onOutputBrowseButtonPressed = function()
{
    var retVal = Folder.selectDialog();
    if(retVal != null)
        dialog.configPanel.outputGroup.textField.text = retVal;
}

///@brief Callback for when ... Button of Pos Run Script gets pressed.
///@returns None
var onPostRunBrowseButtonPressed = function()
{
    var retVal = File.openDialog();
    if(retVal != null)
    {
        dialog.postRunPanel.postRunGroup.textField.text = retVal;
        postScriptPath = retVal;
    }
}


///@brief Callback for when About Button gets pressed.
///@returns None
var onAboutButtonPressed = function()
{
    msg  = "PSDCutter:\n";
    msg += "   N2OMatt <n2omatt@amazingcow.com> \n";
    msg += "   Copyright (c) 2015 - Amazing Cow \n";
    msg += "\n";
    msg += "   This is a free software (GPLv3) - Share/Hack it \n";
    msg += "   Check opensource.amazingcow.com for more :) \n";
    msg += "\n";
    msg += "Components:\n";
    msg += "   PSDCutterGUI  - " + kPSDCutterGUI_Version + "\n"
    msg += "   PSDCutterCore - " + kPSDCutterCore_Version + "\n";
    msg += "   PSDHelpers    - " + kPSDHelpers_Version;

    //Create the Dialog.
    infoDialog = new Window("dialog", "Info");
    infoDialog.frameLocation = [100, 100];


    //Label.
    infoDialog.label = infoDialog.add("edittext",
                                       undefined,
                                       msg,
                                       {multiline:true});

    infoDialog.label.graphics.font = ScriptUI.newFont("dialog:12");
    infoDialog.label.preferredSize = [390, 170];

    //Close Button.
    addButton(infoDialog, "button", "Close");
    infoDialog.button.onClick = function() {
        infoDialog.close();
    }

    infoDialog.show();
}

////////////////////////////////////////////////////////////////////////////////
// PSDCutterCore Callbacks                                                   //
////////////////////////////////////////////////////////////////////////////////
///@brief Callback for when a processing step of PSDCutterCore is executed.
///@returns None
var onProcessingCallback = function(msg)
{
    dialog.outputPanel.outputGroup.textField.text += msg + "\n";
}

////////////////////////////////////////////////////////////////////////////////
// Helper Functions                                                           //
////////////////////////////////////////////////////////////////////////////////
///@brief Validate the data filled in text boxes.
///@returns true If all data is correct, false otherwise.
var checkDialogDataFields = function()
{
    //Check if the output path is valid.
    var outputPath = dialog.configPanel.outputGroup.textField.text;
    outputPath = strip(outputPath, " ");

    var tmpFolder = Folder(outputPath);

    //Path is a File.
    if(tmpFolder instanceof File)
    {
        alert("Output path ("+outputPath+") refers to a file.");
        return false;
    }

    //Path is empty.
    if(outputPath.length == 0)
    {
        alert("Output path is empty.");
        return false;
    }

    //Path does not exists, so create one.
    if(!tmpFolder.exists)
    {
        //Cannot create.
        if(!tmpFolder.create())
        {
            str = strConcat("Output path (",
                            outputPath,
                            ") is invalid\nFolder cannot be created.");
            alert(str);
            return false;
        }
    }

    //All data are valid.
    return true;
}


////////////////////////////////////////////////////////////////////////////////
// Script Initialization                                                      //
////////////////////////////////////////////////////////////////////////////////
function main()
{
    createGUI();
    dialog.show();
}

//Starts the script.
main();
