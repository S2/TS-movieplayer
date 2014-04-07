/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="TitleBarOption.ts" />
/// <reference path="TSPlayer.ts" />

class TitleBar extends Bar{
    options : TitleBarOption;
    width: number;
    constructor(options:TitleBarOption , width:number){
        super();
        this.options = options;
        this.width = width;
        this.className = "bar titleBar";
        this.options = options;
    }

    public createElement(player:TSPlayer):HTMLElement{
        var newElement = super.createElement(player);
        newElement.className          = "bar titleBarString"
        newElement.style.width        = this.width + "px"
        newElement.style.height       = this.options.height + "px"
        if(this.options.zIndex){
            newElement.style.zIndex = this.options.zIndex + "";
        }
        newElement.style.textAlign    = this.options.align;
        newElement.style.position     = "absolute";

        newElement.style.textOverflow = "ellipsis"

        this.createdElement = newElement;
        
        newElement.innerHTML = this.options.displayTitleString;
        return newElement;
    }
}
