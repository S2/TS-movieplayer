/// <reference path="Bar.ts" />
/// <reference path="ControlBarOption.ts" />
/// <reference path="TSPlayer.ts" />

class ControlBar extends Bar{
    options : ControlBarOption;
    width: number;
    appendMethods : {} = {};
    barElement : HTMLDivElement;
    constructor(options:ControlBarOption , width:number){
        super();
        this.options = options;
        this.width = width;
        this.className = "bar controlBar";
    }
    
    public createElement(player:TSPlayer):HTMLElement{
        var newElement = super.createElement(player);
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.position = "absolute";

        var options : ControlBarOption = this.options;

        this.createdElement = newElement;
        return newElement;
    }
    
    public appendCreateButtonMethods(buttonName : string , buttonCreateFunction : ()=> HTMLElement) : void{
        this.appendMethods[buttonName] = buttonCreateFunction;
    }

    public resize(width : number , height : number){
        this.display()
    }
}
