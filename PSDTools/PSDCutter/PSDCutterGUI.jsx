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
#include "PSDCutterCore.jsx";    //The core functionality
#include "PSDCutterGUI/GUI.jsx"; //The GUI creation code.

// Vars //
var _cutterCore = null;
var _gui        = null;

////////////////////////////////////////////////////////////////////////////////
// Script Initialization                                                      //
////////////////////////////////////////////////////////////////////////////////
function main()
{
    //Create the objects.
    _cutterCore = new PSDCutterCore();
    _gui        = new GUI();

    //Set the GUI options.
    _gui.defaultOutputPath            = PSDCutterCore.kDefaultOutputPath;
    _gui.onBuildButtonPressedCallback = onBuildButtonPressed;
    _gui.onExitButtonPressedCallback  = onExitButtonPressed;

    _gui.show();
}


////////////////////////////////////////////////////////////////////////////////
// Dialog Functions                                                           //
////////////////////////////////////////////////////////////////////////////////
function showSuccessDialog()
{
    var cutterCoreMsg = "PSDCutterCore - Completed successfully...";
    var scriptMsg     = "";

    //Execute the post script file if any is set.
    if(_gui.getPostScriptPath() != null)
    {
        var f = new File(postScriptPath);
        scriptMsg = (f.execute())
                     ? "Post Run Script - Was executed..."
                     : "Post Run Script - Was NOT executed...";
    }

    //Build the msg.
    var fullMsg = PSDHelpers.String.concat("Done...\n",
                                           cutterCoreMsg,
                                           "\n",
                                           scriptMsg);
    alert(fullMsg);
}

function showStopDialog()
{
    _cutterCore.stop();
    alert("Script processing stopped.");
}


////////////////////////////////////////////////////////////////////////////////
// Button Callbacks                                                           //
////////////////////////////////////////////////////////////////////////////////
function onBuildButtonPressed()
{
    _gui.disableButtonsForBuild();

    //Get the options from GUI.
    var outpath          = _gui.getOutputPath           ();
    var scenesOnFolders  = _gui.isToSaveScenesOnFolders ();
    var prefabsOnFolders = _gui.isToSavePrefabsOnFolders();

    var generateLogs = _gui.isToSaveLogs();

    var respectBB  = _gui.isToRespectBoundingBox             ();
    var buttonsBB  = _gui.isToHaveButtonsImplicityBoundingBox();
    var addPadding = _gui.isToAddPadding                     ();


    //Set the PSDCutterCore options.
    _cutterCore.outputPath = outpath;

    _cutterCore.saveScenesOnFolders  = scenesOnFolders;
    _cutterCore.savePrefabsOnFolders = prefabsOnFolders;

    _cutterCore.respectBoundingBoxLayers      = respectBB;
    _cutterCore.implicityButtonsBoundingBoxes = buttonsBB;
    _cutterCore.addPadding                    = addPadding;

//~     _cutterCore.processingCallback   = onProcessingCallback;


    //Run the PSDCutterCore.
    var retVal = _cutterCore.run();

    //Show the completion dialog.
    if(retVal == PSDCutterCore.kScriptWasCompleted)
        showSuccessDialog();
    else
        showStopDialog();


    _gui.close();
}



///@brief Callback for when Exit Button gets pressed.
///@returns None
function onExitButtonPressed()
{
    _gui.disableButtonsForExit();
    _cutterCore.stop();
    _gui.close();
}

//Starts the script.
main();
