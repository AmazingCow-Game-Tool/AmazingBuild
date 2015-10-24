//----------------------------------------------------------------------------//
//               █      █                                                     //
//               ████████                                                     //
//             ██        ██                                                   //
//            ███  █  █  ███                                                  //
//            █ █        █ █        GUI.jsx                                   //
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
#include "../../lib/Version.jsx";
#include "../../PSDCutter/Version.jsx";

#include "../../lib/GUIHelpers.jsx";
#include "../../lib/PSDHelpers.jsx";

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//  PUBLIC STUFF                                                              //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Classes                                                                    //
////////////////////////////////////////////////////////////////////////////////
var GUI = function()
{
    this._dialog = null;

    this.defaultOutputPath = null;

    this.onBuildButtonPressedCallback = null;
    this.onExitButtonPressedCallback  = null;
};


////////////////////////////////////////////////////////////////////////////////
// Show / Hide Methods                                                       //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype.show = function()
{
    this._createGUI();
}
GUI.prototype.close = function()
{
    this._dialog.close();
}


////////////////////////////////////////////////////////////////////////////////
// Get Paths Methods                                                          //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype.getOutputPath = function()
{
    return this._dialog.savingPanel.outputGroup.textField.text;
}
GUI.prototype.getPostScriptPath = function()
{
    //COWTODO: Return the right path.
    return null;
    //return this._dialog.postRunPanel.postRunGroup.textField.text;
}


////////////////////////////////////////////////////////////////////////////////
// Query Checkboxes Methods                                                   //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype.isToSaveScenesOnFolders = function()
{
    return this._dialog.savingPanel.saveFoldersGroup.scenesCheckbox.value;
}
GUI.prototype.isToSavePrefabsOnFolders = function()
{
    return this._dialog.savingPanel.saveFoldersGroup.prefabsCheckbox.value;
}
GUI.prototype.isToSaveLogs = function()
{
    return this._dialog.logsPanel.logsGroup.logsCheckbox.value;
}
GUI.prototype.isToRespectBoundingBox = function()
{
    return this._dialog.layersPanel.layersGroup.respectBBCheckbox.value;
}
GUI.prototype.isToHaveButtonsImplicityBoundingBox = function()
{
    return this._dialog.layersPanel.layersGroup.buttonsBBCheckbox.value
}
GUI.prototype.isToAddPadding = function()
{
    return this._dialog.layersPanel.layersGroup.paddingCheckbox.value
}


////////////////////////////////////////////////////////////////////////////////
//Show / Hide Methods                                                         //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype.disableButtonsForBuild = function()
{
    this._dialog.buttonPanel.buildButton.enabled = false;
    this._dialog.buttonPanel.aboutButton.enabled = false;
}
GUI.prototype.disableButtonsForExit = function()
{
    this._dialog.buttonPanel.buildButton.enabled = false;
    this._dialog.buttonPanel.exitButton.enabled = false;
    this._dialog.buttonPanel.aboutButton.enabled = false;
}




////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//  PRIVATE STUFF                                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// Constants //
GUI._kWindowTitle = "AmazingCow - PSDCutter - v" + kPSDCutterGUI_Version;
GUI._kPathTextFieldSize = [600, 20];
GUI._kBrowseButtonSize  = [40,  20];


////////////////////////////////////////////////////////////////////////////////
// Create Save Options Panel                                                  //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._createSaveOptionsPanel = function()
{
    //Create the Saving Panel.
    GUIHelpers.addPanel(this._dialog, "savingPanel", "Saving");

    //Create and init the output group.
    GUIHelpers.addGroup(this._dialog.savingPanel, "outputGroup");

    //Label.
    GUIHelpers.addLabel(this._dialog.savingPanel.outputGroup,
                        "label",
                        "Output Folder:");

    //Text Field.
    GUIHelpers.addTextField(this._dialog.savingPanel.outputGroup,
                            "textField",
                            this.defaultOutputPath,
                            GUI._kPathTextFieldSize);
    //Browse Button.
    GUIHelpers.addButton(this._dialog.savingPanel.outputGroup,
                        "browseButton",
                        "...",
                        this._onOutputBrowseButtonPressed.bind(this),
                        GUI._kBrowseButtonSize);




    //Create and init the saveFolders group.
    GUIHelpers.addGroup(this._dialog.savingPanel, "saveFoldersGroup");

    GUIHelpers.addCheckbox(this._dialog.savingPanel.saveFoldersGroup,
                           "scenesCheckbox",
                           "Save scenes on separated folders",
                           true);

    GUIHelpers.addCheckbox(this._dialog.savingPanel.saveFoldersGroup,
                           "prefabsCheckbox",
                           "Save prefabs on separated folders",
                           true);
}

////////////////////////////////////////////////////////////////////////////////
// Create Log Options Panel                                                   //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._createLogOptionsPanel = function()
{
    GUIHelpers.addPanel(this._dialog, "logsPanel", "Logs");

    GUIHelpers.addGroup(this._dialog.logsPanel, "logsGroup");

    GUIHelpers.addCheckbox(this._dialog.logsPanel.logsGroup,
                           "logsCheckbox",
                           "Generate log files");
}

////////////////////////////////////////////////////////////////////////////////
// Create Layer Options Panel                                                 //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._createLayerOptionsPanel = function()
{
    GUIHelpers.addPanel(this._dialog, "layersPanel", "Layers");
    GUIHelpers.addGroup(this._dialog.layersPanel, "layersGroup");

    //Bounding checkboxes.
    GUIHelpers.addCheckbox(this._dialog.layersPanel.layersGroup,
                          "respectBBCheckbox",
                          "Respect (*boundingBox)",
                          true);

    GUIHelpers.addCheckbox(this._dialog.layersPanel.layersGroup,
                           "buttonsBBCheckbox",
                           "Button implicit (*boudingBox)",
                           true);

    //Padding checkboxes.
    GUIHelpers.addCheckbox(this._dialog.layersPanel.layersGroup,
                           "paddingCheckbox",
                           "Add 2px padding",
                           true);
}

////////////////////////////////////////////////////////////////////////////////
// Create Post Run Panel                                                      //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._createPostRunPanel = function()
{
    GUIHelpers.addPanel(this._dialog, "postRunPanel", "Post Run");

    GUIHelpers.addGroup(this._dialog.postRunPanel, "postRunGroup");



    GUIHelpers.addLabel(this._dialog.postRunPanel.postRunGroup,
                        "label",
                        "Script path:");

    GUIHelpers.addTextField(this._dialog.postRunPanel.postRunGroup,
                            "textField",
                            "",
                            GUI._kPathTextFieldSize);

    GUIHelpers.addButton(this._dialog.postRunPanel.postRunGroup,
                         "browseButton",
                         "...",
                         this._onPostRunBrowseButtonPressed,
                         GUI._kBrowseButtonSize);
}


////////////////////////////////////////////////////////////////////////////////
// Create Script Output Panel                                                 //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._createScriptOutputPanel = function()
{
    // //Create the Script Output Panel.
    // GUIHelpers.addPanel(dialog, "outputPanel", "Script Output:");

    // //Create the Output Group.
    // GUIHelpers.addGroup(dialog.outputPanel, "outputGroup");

    // //Add the field.
    // with(dialog.outputPanel)
    // {
    //     outputGroup.textField = outputGroup.add("edittext",
    //                                              undefined,
    //                                             "",
    //                                             {multiline:true});
    //     outputGroup.textField.preferredSize = [550, 400];
    // }
}

////////////////////////////////////////////////////////////////////////////////
// Create Buttons Panel                                                       //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._createButtonsPanel = function()
{
    //Create the Buttons Panel.
    //COWOTODO: Find way to make the group border hidden.
    GUIHelpers.addPanel(this._dialog, "buttonPanel", "");
    this._dialog.buttonPanel.orientation = "row";

    //Number of openned documents. We will disable build
    //button if there is no document opened.
    var docsCount = app.documents.length;

    //Build Button.
    GUIHelpers.addButton(this._dialog.buttonPanel,
                        "buildButton",
                        "Build",
                        this.onBuildButtonPressedCallback);

    //Disable if no documents are open.
    if(docsCount == 0)
        this._dialog.buttonPanel.buildButton.enabled = false;

    //Exit Button.
    GUIHelpers.addButton(this._dialog.buttonPanel,
                        "exitButton",
                        "Exit",
                        this.onExitButtonPressedCallback);
    //About Button.
    GUIHelpers.addButton(this._dialog.buttonPanel,
                        "aboutButton",
                        "About",
                        this._onAboutButtonPressed);
}

////////////////////////////////////////////////////////////////////////////////
// Create GUI                                                                 //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._createGUI = function()
{
    //Create the Dialog.
    this._dialog = new Window("dialog", GUI._kWindowTitle);
    this._dialog.frameLocation = [100, 100];

    //Create the Dialog UI.
    this._createSaveOptionsPanel ();
    this._createLogOptionsPanel  ();
    this._createLayerOptionsPanel();
    this._createPostRunPanel     ();
    this._createScriptOutputPanel();
    this._createButtonsPanel     ();

    this._dialog.show();
}


////////////////////////////////////////////////////////////////////////////////
// Button Callbacks                                                           //
////////////////////////////////////////////////////////////////////////////////
GUI.prototype._onOutputBrowseButtonPressed = function()
{
    var retVal = Folder.selectDialog();
    if(retVal != null)
        this._dialog.savingPanel.outputGroup.textField.text = retVal;
}

GUI.prototype._onPostRunBrowseButtonPressed = function()
{
    var retVal = File.openDialog();
    if(retVal != null)
    {
        this._dialog.postRunPanel.postRunGroup.textField.text = retVal;
        postScriptPath = retVal;
    }
}

GUI.prototype._onAboutButtonPressed = function()
{
    var msg = PSDHelpers.String.concat(
        "PSDCutter:\n",
        "   N2OMatt <n2omatt@amazingcow.com> \n",
        "   Copyright (c) 2015 - Amazing Cow \n",
        "\n",
        "   This is a free software (GPLv3) - Share/Hack it \n",
        "   Check opensource.amazingcow.com for more :)     \n",
        "\n",
        "Components:\n",
        "   PSDCutterGUI  - ", kPSDCutterGUI_Version , "\n",
        "   PSDCutterCore - ", kPSDCutterCore_Version, "\n",
        "   PSDHelpers    - ", kPSDHelpers_Version   , "\n",
        "   GUIHelpers    - ", kGUIHelpers_Version
    );

    //Create the Dialog.
    infoDialog = new Window("dialog", "Info");
    infoDialog.frameLocation = [100, 100];


    //Label.
    infoDialog.label = infoDialog.add("edittext",
                                       undefined,
                                       msg,
                                       {multiline:true});

    infoDialog.label.graphics.font = ScriptUI.newFont("dialog:12");
    infoDialog.label.preferredSize = [390, 230];

    //Close Button.
    GUIHelpers.addButton(infoDialog,
                          "button",
                          "Close",
                          function() { infoDialog.close(); });
    infoDialog.show();
}


// ////////////////////////////////////////////////////////////////////////////////
// // Helper Functions                                                           //
// ////////////////////////////////////////////////////////////////////////////////
// var checkDialogDataFields = function()
// {
//     //Check if the output path is valid.
//     var outputPath = dialog.savingPanel.outputGroup.textField.text;
//     outputPath = strip(outputPath, " ");

//     var tmpFolder = Folder(outputPath);

//     //Path is a File.
//     if(tmpFolder instanceof File)
//     {
//         alert("Output path ("+outputPath+") refers to a file.");
//         return false;
//     }

//     //Path is empty.
//     if(outputPath.length == 0)
//     {
//         alert("Output path is empty.");
//         return false;
//     }

//     //Path does not exists, so create one.
//     if(!tmpFolder.exists)
//     {
//         //Cannot create.
//         if(!tmpFolder.create())
//         {
//             str = strConcat("Output path (",
//                             outputPath,
//                             ") is invalid\nFolder cannot be created.");
//             alert(str);
//             return false;
//         }
//     }

//     //All data are valid.
//     return true;
// }
