/// <reference path="BarOption.ts" />

enum TitlePosition {
    Left,
    Center,
    Right,
}
class TitleBarOption extends BarOption{
    displayTitleString    : string ;
    displayTitlePosition  : TitlePosition = TitlePosition.Center;
    height                : number = 30;
    zIndex                : number = 100;
    align                 : string = "center"
}

