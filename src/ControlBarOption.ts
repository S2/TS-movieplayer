/// <reference path="BarOption.ts" />

class ControlBarOption extends BarOption{
    displayLeftButtons    : Array = ['play' , 'volume' , 'duration' , '::' , 'current'];
    displayRightButtons   : Array = ['fullscreen'];
    height            : number = 30;
    zIndex            : number = null;
}

