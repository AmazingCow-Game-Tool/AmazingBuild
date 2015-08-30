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
kPSDCutterGUI_Version = "0.1.1";

// Vars //
var cutterCore;
var dialog;

// Constants //
kWindowTitle = "AmazingCow - PSDCutter - v" + kPSDCutterGUI_Version;


var createConfigurationPanel = function()
{
    //Create the Configuration Panel.
    dialog.configPanel = dialog.add("panel", undefined, "Configuration");
    dialog.configPanel.alignChildren = "right";

    //Create the Output Group.
    dialog.configPanel.outputGroup = dialog.configPanel.add("group");
    with(dialog.configPanel)
    {
        //Label.
        outputGroup.label = outputGroup.add("statictext", 
                                             undefined,
                                            "Output Folder:");
        //Text Field.
        outputGroup.textField = outputGroup.add("edittext", 
                                                 undefined, 
                                                 PSDCutterCore.kDefaultOutputDir);        
        outputGroup.textField.preferredSize = [200, 20];

        //Browse Button.
        outputGroup.browseButton = outputGroup.add("button", 
                                                    undefined,
                                                   "...");
        outputGroup.browseButton.preferredSize = [40, 20];
        outputGroup.browseButton.onClick = onOutputBrowseButtonPressed;
    }
}

var createScriptOutputPanel = function()
{
    //Create the Script Output Panel.
    dialog.outputPanel = dialog.add("panel", 
                                     undefined,
                                    "Script Output");
    dialog.outputPanel.alignChildren = "right";

    //Create the Output Group.
    dialog.outputPanel.outputGroup = dialog.outputPanel.add("group");
    with(dialog.outputPanel) 
    {
        outputGroup.textField = outputGroup.add("edittext", 
                                                 undefined,
                                                "", 
                                                {multiline:true});
        outputGroup.textField.preferredSize = [336, 80];  
    }
}

var createButtonsPanel = function()
{
    //Create the Buttons Panel.
    //COWOTODO: Find way to make the group border hidden.
    dialog.buttonPanel = dialog.add("panel", undefined, "");
    dialog.buttonPanel.orientation = "row";
    with(dialog)
    {
        //Build Button.
        buttonPanel.buildButton = dialog.buttonPanel.add("button",
                                                          undefined,
                                                         "Build");
        buttonPanel.buildButton.onClick = onBuildButtonPressed;
        
        //Exit Button.
        buttonPanel.exitButton = dialog.buttonPanel.add("button",
                                                         undefined,
                                                        "Exit");
        buttonPanel.exitButton.onClick = onExitButtonPressed;                                                                     
        
        //About Button.
        buttonPanel.aboutButton = dialog.buttonPanel.add("button",
                                                          undefined,
                                                          "About");
        buttonPanel.aboutButton.onClick = onAboutButtonPressed;                                                                                                                       
    }    
}

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
    createScriptOutputPanel();
    createButtonsPanel();
}


// Button Callbacks //
//COWTODO: Comment.
var onBuildButtonPressed = function()
{
    //Check if the data fields have valid data.
    if(!checkDialogDataFields())
        return;
        
    //Disable the buttons.
    dialog.configPanel.outputGroup.browseButton.enabled = false;
    dialog.buttonPanel.buildButton.enabled              = false;
    
    //Create the PSDCutterCore object, sets the 
    //processing callback and start the processing...
    cutterCore = new PSDCutterCore();
    cutterCore.outputPath         = dialog.configPanel.outputGroup.textField.text;
    cutterCore.processingCallback = onProcessingCallback;

    var retVal = cutterCore.run();

    if(retVal == PSDCutterCore.kScriptWasCompleted)
    {
        alert("Script processing completed.");
        dialog.close();
    }
}

//COWTODO: Comment.
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
//COWTODO: Comment.
var onOutputBrowseButtonPressed = function()
{
    var retVal = Folder.selectDialog();
    if(retVal != null)
        dialog.configPanel.outputGroup.textField.text = retVal;
}
//COWTODO: Comment.
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

    infoDialog.label.graphics.font = ScriptUI.newFont("Droid Sans Mono", 
                                                      ScriptUI.FontStyle.BOLD, 
                                                      12);                            
    infoDialog.label.preferredSize = [390, 170];
    
    //Close Button.
    infoDialog.button = infoDialog.add("button", 
                                       undefined,
                                       "Close");
    infoDialog.button.onClick = function() {
        infoDialog.close();
    }

    infoDialog.show();
    
}

// PSDCutterCore Callbacks //
//COWTODO: Comment.
var onProcessingCallback = function(msg)
{
    dialog.outputPanel.outputGroup.textField.text += msg + "\n";
}

// Helper Functions //
//COWTODO: Comment.
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
            alert("Output path ("+outputPath+") is invalid\nFolder cannot be created.");
            return false;
        }
    }
    
    //All data are valid.
    return true;
}

//COWTODO: COMMENT.
function main()
{
    createGUI();
    dialog.show(); 
}

//Starts the script.
main();
