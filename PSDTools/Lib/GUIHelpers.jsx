//----------------------------------------------------------------------------//
//               █      █                                                     //
//               ████████                                                     //
//             ██        ██                                                   //
//            ███  █  █  ███                                                  //
//            █ █        █ █        GUIHelpers.jsx                            //
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

function GUIHelpers()
{

}

GUIHelpers.addPanel = function(parent, name, title, alignment)
{
    parent[name] = parent.add("panel", undefined, title);
    if(alignment != undefined)
        parent[name].alignChildren = alignment;
}

////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
GUIHelpers.addGroup = function(parent, name)
{
    parent[name] = parent.add("group");
}
GUIHelpers.addGroups = function(parent, namesArr)
{
    for(var i = 0; i < namesArr.length; ++i)
        GUIHelpers.addGroup(parent, namesArr[i]);
}

////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
GUIHelpers.addLabel = function(parent, name, title)
{
    parent[name] = parent.add("statictext", undefined, title);
}

////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
GUIHelpers.addTextField = function(parent, name, contents, size)
{
    parent[name] = parent.add("edittext", undefined, contents);

    if(size != undefined)
        parent[name].preferredSize = size;
}

////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
GUIHelpers.addButton = function(parent, name, title, callback, size)
{
    parent[name] = parent.add("button", undefined, title);

    if(callback != undefined)
        parent[name].onClick = callback;

    if(size != undefined)
        parent[name].preferredSize = size;
}

////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
GUIHelpers.addCheckbox = function(parent, name, title, checked)
{
    parent[name] = parent.add("checkbox", undefined, title);

    if(checked != undefined)
        parent[name].value = checked;
}
