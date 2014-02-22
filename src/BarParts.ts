/// <reference path="jquery.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="Bar.ts" />

class BarPartsSetting{
    src         :  string;
    width       :  number;
    height      :  number;
    top         :  number;
    left        :  number;
    scaleWidth  :  number;
    scaleHeight :  number;
    margin      :  Margin;
    constructor(src , width , height , top = 0 , left = 0, scaleWidth = 100 , scaleHeight = 100 , margin : Margin = new Margin(0 , 0)){
        this.src         = src
        this.width       = width
        this.height      = height
        this.top         = top
        this.left        = left
        this.scaleWidth  = scaleWidth
        this.scaleHeight = scaleHeight
        this.margin      = margin;
    }
}

class Margin{
    top    : number;
    right  : number;
    bottom : number;
    left   : number;
    constructor(top , right , bottom = null , left = null){
        if(bottom == null && left == null){
            this.top    = top;
            this.right  = right;
            this.bottom = top;
            this.left   = right;
        }else{
            this.top    = top;
            this.right  = right;
            this.bottom = top;
            this.left   = right;
        }
    }
    public getMarginString():string{
        return [this.top , this.right , this.bottom , this.left].map(function(value){
            return value ? value + "px" : "0" ;
        }).join(" ");
    }
}

class BarParts{
    player : Player;
    controlBar : Bar;
    centerPlayButton     :HTMLDivElement
    separateString : string
    hasSetDuration      : Boolean = false
    hasSetCurrentTime   : Boolean = false
    constructor(player : Player , controlBar : Bar ){
        this.player = player;
        this.controlBar = controlBar;
    }
    
    public createButton(backgroundImageSetting : BarPartsSetting):HTMLDivElement{
        var button: HTMLDivElement = document.createElement('div');
        var style = button.style;
        style.width               = backgroundImageSetting.width + "px";
        style.height              = backgroundImageSetting.height + "px";
        style.backgroundImage     = "url('" + backgroundImageSetting.src + "')";
        style.backgroundRepeat    =  "no-repeat";
        style.backgroundPosition  = backgroundImageSetting.top + "px " + backgroundImageSetting.left + "px";
        style.margin              = backgroundImageSetting.margin.getMarginString();
        if(backgroundImageSetting.scaleWidth != 100 || backgroundImageSetting.scaleHeight != 100){
            style.backgroundSize      = backgroundImageSetting.scaleWidth + "% " + backgroundImageSetting.scaleHeight + "%";
        }
        style.zIndex              = this.controlBar.getZIndex() + 1 + "";
        return button;
    }

    public modifyButton(button:HTMLDivElement , backgroundImageSetting : BarPartsSetting):void{
        var style = button.style;
        style.width               = backgroundImageSetting.width + "px";
        style.height              = backgroundImageSetting.height + "px";
        style.backgroundImage     = "url('" + backgroundImageSetting.src + "')";
        style.backgroundRepeat    =  "no-repeat";
        style.backgroundPosition  = backgroundImageSetting.top + "px " + backgroundImageSetting.left + "px";
        if(backgroundImageSetting.scaleWidth != 100 || backgroundImageSetting.scaleHeight != 100){
            style.backgroundSize      = backgroundImageSetting.scaleWidth + "% " + backgroundImageSetting.scaleHeight + "%";
        }
    }

    public getTime(time : number) : string{
        var hour   = 0 ;
        var minute = 0 ;
        var second = 0 ;

        while(time > 3600){
            time -= 3600;
            hour ++
        }
        while(time> 60){
            time -= 60;
            minute ++
        }
        second = parseInt(time.toString());
        var timeString = "";
        if(hour > 0){
            timeString += hour < 10 ? "0" + hour : hour.toString();
            timeString += ":"
        }
        timeString += minute < 10 ? "0" + minute : minute.toString();
        timeString += ":"
        timeString += second < 10 ? "0" + second : second.toString();
        
        return timeString
    }
}
