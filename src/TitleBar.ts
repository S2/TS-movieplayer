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
        this.thisObject = this;
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

        var thisObject:TitleBar = <TitleBar>this.thisObject;

        player.hookAfterPlay(function(){thisObject.feedOut(1000 , 50)});
        player.hookAfterPause(function(){thisObject.feedIn(0 , 50)});

        newElement.addEventListener('mouseenter' , function(){
            if(player.isPlaying){
                player.title.feedIn(0 , 50);
                player.control.feedIn(0 , 50);
            }
        },false);
        newElement.addEventListener('mouseout' , function(){
            if(player.isPlaying){
                player.title.feedOut(0 , 50);
                player.control.feedOut(0 , 50);
            }
        },false);

        return newElement;
    }
}
