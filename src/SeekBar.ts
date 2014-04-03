/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="SeekBarOption.ts" />
/// <reference path="TSPlayer.ts" />

class SeekBar extends Bar{
    options : SeekBarOption;
    seekbar : HTMLElement;
    width: number;
    appendMethods : {} = {};
    initTop : number;
    moveDownHeight : number;
    constructor(options:SeekBarOption, width:number){
        super();
        this.options = options;
        this.width = width;
        this.className = "bar seekBar";
    }
    
    public createElement(player:TSPlayer):HTMLElement{
        var newElement = super.createElement(player);
        newElement.style.width = this.width + "px";
        if(this.options.height){
            newElement.style.height = this.options.height + "px";
        }
        if(this.options.zIndex){
            newElement.style.zIndex = this.options.zIndex + "";
        }
        if(this.options.railColor){
            newElement.style.backgroundColor = this.options.railColor
        }

        var options : SeekBarOption = this.options;

        this.createdElement = newElement;

        var width = this.width;

        var seekbar =  document.createElement("div");
        if(this.options.height){
            seekbar.style.height = this.options.height + "px";
        }
        seekbar.style.width = width + "px";

        var seekbarInner =  document.createElement("div");
        if(this.options.height){
            seekbarInner.style.height = this.options.height + "px";
        }
        seekbarInner.style.width = "0px";
        seekbarInner.style.position = "absolute";
        if(this.options.filledColor){
            seekbarInner.style.backgroundColor= this.options.filledColor;
        }

        seekbar.appendChild(seekbarInner);

        seekbar.addEventListener("click" , (e) => {
            var clickedX = e.pageX;
            var moveToSec = player.getDuration() * clickedX / width;
            player.setCurrentTime(moveToSec);
        } , false);

        player.hookTimeupdate((player:TSPlayer , video:HTMLVideoElement) => {
            var current:number = video.currentTime;
            var duration:number = player.getDuration();
            var percent = current / duration;
            var filledWidth = width * percent;
            seekbarInner.style.width = filledWidth + "px";
        });
        newElement.appendChild(seekbar);
        this.seekbar = seekbar;
        return newElement;
    }
    
    /**
        <br>
        
        @method setMoveDownHeight 
        @param moveDownHeight {number} 
        @return void
    */
    public setMoveDownHeight(moveDownHeight : number):void{
        this.moveDownHeight = moveDownHeight;
    }

    /**
        <br>
        
        @method moveUpBar
        @param {} 
        @return void
    */
    public moveDownBar():void{
        if(this.initTop == null){
            this.initTop = parseInt(this.createdElement.style.top.replace("px" ,""));
        }
        this.createdElement.style.top = this.initTop + this.moveDownHeight + "px";
    }

    /**
        <br>
        
        @method moveDownBar
        @param {} 
        @return void
    */
    public moveUpBar():void{
        if(this.initTop == null){
            this.initTop = parseInt(this.createdElement.style.top.replace("px" ,""));
        }
        this.createdElement.style.top = this.initTop + "px";
    }
}
