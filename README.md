# Amazing Build

## About
## TODO


### PSDCutter
#### Intro:
PSDCutter is a small script to automate the process of cut images in a Photoshop file.
It works visiting every "layerset" (aka group) in a PSD document and selecting its type
based on its name.
Currently we have 6 types of objects:
* Prefabs   : A smart object, the script will process its contents as a "new file".
* Sprite    : Will cut all its contents into a single image.
* Scene     : A "logical" group for Sprites and Buttons.
* Button    : Will cut its contents in different images.
* Ignorable : Will skip the layer.
* Unknown   : An object that was not recognizable.

Some of object types can appear in anywhere, but others must be placed in the
correct places  (Bellow in the description of each object this will be better explained).

##### Warning:
**ALL OBJECTS** assumes that its content is into a **SINGLE GROUP**, all kind
of strange thing occurs if this rule was not respected. Inside of this single
group, we can have all stuff that we want.

#### Example:
There is a example PSD file into examples folder. Play a little with it
to see how things are organized. :)

#### Usage:
1. Open a PSD File that will be processed in Photoshop.
2. Open the PSDCutter.jsx in Extendscript Toolkit.
3. Link the Extendscript Toolkit with Photoshop.
4. Press the play button. (May be a good idea get a cup of coffee if your
computer is not so fast :) ).
5. Your images will be saved into a folder named Output in the same directory
of your PSD file.

#### PSD Layer Structure:
The script requires a specific structure to work correctly.
In the Top Level of the file we can have Scenes | Ignorables | Prefabs.
In each Scene we can have Sprites | Buttons | Ignorables.
In Sprite we **MUST** have a single group (its name isn't important and will be
renamed by the script). Inside this group we can have anything that we want.
In Button we **MUST** have 2 required groups (Normal | Pressed) and 1 optional
(Disabled). The names **ARE IMPORTANT**, but the order isn't.
In Prefabs we can have **ONLY SMARTOBJECTS**, it will be processed as being new
files. The name **IS NOT IMPORTANT**, but **MUST NOT START** with "_".
The Ignorable object is not processed at all, its name **IS IMPORTANT** and
start with the ```"_"``` (underscore) character. Any layerset with leading
```"_"``` is treated as an Ignorable.

```
PSD
|--Ignorable
|  |--Anything
|--Scene
|  |-- Sprite
|  |   |--Contents //A **SINGLE GROUP** - The name isn't important.
|  |      |--Anything
|  |---Button
|      |--Normal //A Group - The name IS important.
|      |  |--Anything
|      |--Pressed //A Group - The name IS important.
|      |  |--Anything
|      |--Disabled //A Group - The name IS important. (Optional)
|         |--Anything
|--Prefabs
   |-- SmartObject // Name isn't important but cannot start with '_'
```

#### Object Types:
##### Ignorable:
##### Sprite:
##### Button:
##### Prefabs:
