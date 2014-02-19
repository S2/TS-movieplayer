/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="ControlBarOption.ts" />
/// <reference path="Player.ts" />

class ControlBar extends Bar{
    options : ControlBarOption;
    width: number;
    appendMethods : {} = {};
    barElement : HTMLDivElement;
    constructor(options:ControlBarOption, width:number){
        super();
        this.options = options;
        if(this.options == null){
            this.options = new ControlBarOption;
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

        var options : ControlBarOption = this.options;

        this.createdElement = newElement;

        return newElement;
    }
    
    public appendCreateButtonMethods(buttonName : string , buttonCreateFunction : ()=> HTMLElement) : void{
        this.appendMethods[buttonName] = buttonCreateFunction;
    }

    public getZIndex():number{
        return this.options.zIndex;
    }

}
