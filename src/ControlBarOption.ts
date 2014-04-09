/// <reference path="BarOption.ts" />

class ControlBarOption extends BarOption{
    displayLeftButtons    : Array<string> = ['play' , 'volume' , 'duration' , '::' , 'current'];
    displayRightButtons   : Array<string> = ['fullscreen'];
    height            : number = 30;
    zIndex            : number = null;
}

