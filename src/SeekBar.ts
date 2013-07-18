/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="SeekBarOption.ts" />
/// <reference path="Player.ts" />

class SeekBar extends Bar{
    options : SeekBarOption;
    width: number;
    appendMethods : {} = {};
    constructor(options:SeekBarOption, width:number){
        super();
        this.options = options;
        if(this.options == null){
            this.options = new SeekBarOption;
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

        var options : SeekBarOption = this.options;

        this.createdElement = newElement;
        var thisObject:SeekBar = <SeekBar>this.thisObject;

        player.hookAfterPlay(function(){thisObject.feedOut(1000 , 50)});
        player.hookAfterPause(function(){thisObject.feedIn(0 , 50)});

        newElement.addEventListener('mouseenter' , function(){
            if(player.isPlaying){
                player.title.feedIn(0 , 50);
                player.control.feedIn(0 , 50);
                player.seekbar.feedIn(0 , 50);
            }
        },false);
        newElement.addEventListener('mouseout' , function(){
            if(player.isPlaying){
                player.title.feedOut(0 , 50);
                player.control.feedOut(0 , 50);
                player.seekbar.feedOut(0 , 50);
            }
        },false);

        var seekbar =  document.createElement("canvas");
        var width = this.width;
        seekbar.style.height = this.options.height + "px";
        seekbar.style.width = width + "px";
        var ctx = seekbar.getContext('2d');

        ctx.fillStyle = "rgb(200, 0, 0)";
        player.hookTimeUpdate(function(player:Player , video:HTMLVideoElement){
            var current:number = video.currentTime;
            var duration:number = player.getDuration();
            var percent = current / duration;

            var filledWidth = width * percent;
            ctx.fillRect(0 , 0 , filledWidth , 1000);
        });
        newElement.appendChild(seekbar);
        return newElement;
    }
    
}
