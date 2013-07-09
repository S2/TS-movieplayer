/// <reference path="jquery.d.ts" />
/// <reference path="ControlBarOption.ts" />

class ControlBar extends Bar{
    options : ControlBarOption;
    width: number;
    constructor(options:ControlBarOption, width:number){
        super();
        this.options = options;
        if(this.options == null){
            this.options = new ControlBarOption;
        }
        this.width = width;
    }

    public createElement():HTMLElement{
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";
        return newElement;
    }
}
