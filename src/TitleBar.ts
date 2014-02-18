/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="TitleBarOption.ts" />
/// <reference path="Player.ts" />

class TitleBar extends Bar{
    options : TitleBarOption;
    width: number;
    constructor(options:TitleBarOption , width:number){
        super();
        this.options = options;
        if(this.options == null){
            this.options = new TitleBarOption;
        }
        this.width = width;
    }

    public createElement(player:Player):HTMLElement{
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";

        this.createdElement = newElement;

        return newElement;
    }
}
