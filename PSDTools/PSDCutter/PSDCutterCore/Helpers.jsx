//----------------------------------------------------------------------------//
//               █      █                                                     //
//               ████████                                                     //
//             ██        ██                                                   //
//            ███  █  █  ███                                                  //
//            █ █        █ █        Helpers.jsx                               //
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

#include "../../lib/PSDHelpers.jsx"

////////////////////////////////////////////////////////////////////////////////
// Object Type                                                                //
////////////////////////////////////////////////////////////////////////////////
///@brief ObjectType is a handy object that let us have information of what
///kind of object a Photoshop layer is representing.
function ObjectType()
{
    // Empty //
};

// Constants //
ObjectType.Prefabs   = "Prefabs";
ObjectType.Sprite    = "Sprite";
ObjectType.Scene     = "Scene";
ObjectType.Button    = "Button";
ObjectType.Ignorable = "Ignorable";
ObjectType.Unknown   = "Unknown";

///@brief Based on the Photoshop layer name it will determine which type
///of object the layer is representing.
///@param group A Photoshop's group or layer.
///@returns The type of the object or Unknown if can't be
///determined by layer's name.
ObjectType.findObjectType = function(group)
{
    var name = group.name;

    if(name[0] == "_")                        return ObjectType.Ignorable;
    if(name == ObjectType.Prefabs           ) return ObjectType.Prefabs;
    if(name.indexOf(ObjectType.Sprite) != -1) return ObjectType.Sprite;
    if(name.indexOf(ObjectType.Scene ) != -1) return ObjectType.Scene;
    if(name.indexOf(ObjectType.Button) != -1) return ObjectType.Button;

    return ObjectType.Unknown;
};

ObjectType.canonizeName = function(name)
{
    var type = "";
    if     (name == ObjectType.Prefabs) type = ObjectType.Prefabs;
    else if(name.indexOf(ObjectType.Sprite) != -1) type = ObjectType.Sprite;
    else if(name.indexOf(ObjectType.Scene ) != -1) type = ObjectType.Scene;
    else if(name.indexOf(ObjectType.Button) != -1) type = ObjectType.Button;

    var cleanName = name.replace(type, "").replace("_", "");
    return PSDHelpers.String.concat(type, "_", cleanName);
}


////////////////////////////////////////////////////////////////////////////////
// PSDDocument                                                                //
////////////////////////////////////////////////////////////////////////////////
function PSDDocument()
{
    // Empty //
};

///@brief Create a new Photoshop document.
///@param filename The filename of the new document.
///@param width Width of the new document.
///@param height Height of the new document.
///@param documentActiveAfterCreation Which document will be set as the
///       app.activeDocument. If no document is passed, the created one
///       is set to active.
///@returns The new created document.
PSDDocument.create = function(filename, width, height, documentActiveAfterCreation)
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
};

///@brief Duplicates a layer into a document.
///@param layer The layer that will be duplicated.
///@param intoDocument The Document that will receive the layer.
///@param merge If the layer after be duplicated will be merged
///       into a single layer.
///@param documentActiveAfterOperation The document that will
///       be set as active after the duplicate operation be over.
///@returns The duplicated layer.
PSDDocument.duplicateLayer = function(layer,
                                      paddingSize,
                                      respectBoundingBox,
                                      intoDocument,
                                      documentActiveAfterOperation)
{
    //Duplicate the layer into the document and set the current
    //active document to the new document, so the following operations
    //can be performed.
    var duplicatedLayer = layer.duplicate(intoDocument,
                                          ElementPlacement.INSIDE);
    app.activeDocument = intoDocument;


    //If set to not respect boundingBox, set it's layer to null, so all
    //opearations that involve this will not be perfomed. Also make
    //it's (if exists) hidden...
    var boundingBoxLayer = PSDDocument.findBoundingBoxLayer(duplicatedLayer);
    if(respectBoundingBox == false && boundingBoxLayer != null)
    {
        boundingBoxLayer.visible = false;
        boundingBoxLayer         = null;
    }

    //Toogle visibility so revealAll and trim methods can be perfomed right.
    //This is needed because the duplicated layer can be located at any place
    //so the combo of revealAll and trim makes the document of the exact
    //size of the layer and we want include the boundingBox layer into this.
    //This is the exactly the purpose of the boundingBox layer.
    if(boundingBoxLayer != null)
        boundingBoxLayer.visible = true;

    //Makes the document of the exactly size of the dubplicated layer.
    app.activeDocument.revealAll();
    app.activeDocument.trim(TrimType.TRANSPARENT);

    //First grab the size of the first layer of this document,
    //i.e. the duplicated layer. This is the "fallback" option
    //for layers that hasn't the boundingBox layer.
    //Next check if the layer has a boundingBox layer and then
    //grab it's size, because we should respect the boundingBox layer.
    var layerSize = PSDLayer.getSize(duplicatedLayer);

    if(boundingBoxLayer != null)
        PSDLayer.getSize(boundingBoxLayer);


    //Add padding to layer.
    app.activeDocument.resizeCanvas(layerSize[0] + paddingSize[0],
                                    layerSize[1] + paddingSize[1]);

    //Set the boundingBox layer to hidden, so it will not
    //be cut with the real layer contents.
    if(boundingBoxLayer != null)
        boundingBoxLayer.visible = false;


    //If were given that we must set the active document, do it now.
    if(documentActiveAfterOperation != undefined)
        app.activeDocument = documentActiveAfterOperation;


    return duplicatedLayer;
};

PSDDocument.findBoundingBoxLayer = function(layer)
{
    var boundingBoxLayer = null;
    for(var i = 0; i < layer.layers.length; ++i)
    {
        var currLayer = layer.layers[i];
        if(currLayer.name == "*boundingBox")
        {
            boundingBoxLayer = currLayer;
            break;
        }
    }
    return boundingBoxLayer;
}

///@brief Save the document to a file with the extension PSD.
///@param doc The Photoshop document that will be saved.
///@param filename The fullpath of the file that will be created to save the doc.
///@returns Nothing
PSDDocument.save = function(doc, filename)
{
    var file = new File(filename);
    doc.saveAs(file, SaveDocumentType.PHOTOSHOP , true, Extension.LOWERCASE);
};

///@brief Save the document to a file with the extension PNG.
///@param doc The Photoshop document that will be saved.
///@param filename The fullpath of the file that will be created to save the doc.
///@returns Nothing
PSDDocument.export = function(doc, filename)
{
    var file = new File(filename);
    doc.saveAs(file, SaveDocumentType.PNG, true, Extension.LOWERCASE);
};

///@brief Close the document without save.
///@param doc The Photoshop document that will be closed.
///@returns Nothing
PSDDocument.close = function(doc)
{
    doc.close(SaveOptions.DONOTSAVECHANGES);
};
