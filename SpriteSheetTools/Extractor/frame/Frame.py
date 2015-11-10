import os;
import os.path;

class FrameInfo:
    def __init__(self):
        self.x       = None;
        self.y       = None;
        self.width   = None;
        self.height  = None;

        self.rotated = None;
        self.name    = None;
        self.path    = None;

    def set_name_path(self, value):
        value = value.lstrip(" ").rstrip(" ");

        self.name = os.path.basename(value);
        self.path = os.path.dirname(value);

    def set_rect(self, value):
        self.x      = int(value[0]);
        self.y      = int(value[1]);
        self.width  = int(value[2]);
        self.height = int(value[3]);

    def get_rect(self):
        if(self.rotated):
            self.width, self.height = self.height, self.width;

        rect = self.x, self.y, self.width, self.height;
        return rect;

    def set_rotated(self, value):
        self.rotated = value;

    def __repr__(self):
        return "\n".join((
            "Name    : {}".format(self.name),
            "Path    : {}".format(self.path),
            "Rotated : {}".format(self.rotated),
            "X       : {}".format(self.x),
            "Y       : {}".format(self.y),
            "Width   : {}".format(self.width),
            "Height  : {}".format(self.height)));
