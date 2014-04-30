/// <reference path="jquery.d.ts" />
/// <reference path="TSPlayer.ts" />
/// <reference path="Bar.ts" />

class Size{
    width : number
    height : number
    constructor(width : number = 0 , height : number = 0){
        this.width = width
        this.height = height
    }
}

class BannerPosition{
    top   : number
    left : number
    constructor(top : number = 0 , left : number = 0){
        this.top = top
        this.left = left
    }
}

class Scale{
    scaleWidthPercent  : number
    scaleHeightPercent : number
    constructor(scaleWidthPercent : number = 0 , scaleHeightPercent : number = 0){
        if(scaleWidthPercent > 100){
            throw("scaleWidthPercent must be < 100")
        }
        if(scaleHeightPercent > 100){
            throw("scaleHeightPercent must be < 100")
        }
        this.scaleWidthPercent = scaleWidthPercent;
        this.scaleHeightPercent = scaleHeightPercent;
    }
}

class BarPartsSetting{
    src         :  string;
    width       :  number;
    height      :  number;
    top         :  number;
    left        :  number;
    scaleWidth  :  number;
    scaleHeight :  number;
    margin      :  Margin;
    constructor(size : Size = new Size() , position : BannerPosition = new BannerPosition() , scale : Scale = new Scale() , margin : Margin = new Margin(0 , 0)){
        this.width       = size.width
        this.height      = size.height
        this.top         = position.top
        this.left        = position.left
        this.scaleWidth  = scale.scaleWidthPercent
        this.scaleHeight = scale.scaleHeightPercent
        this.margin      = margin;
    }

    /**
        <br>
        
        @method setSrc 
        @param {} 
        @return void
    */
    public setSrc(src):void{
        this.src         = src
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
        var returnArray = [this.top + "" , this.right + "" , this.bottom + "" , this.left + ""]
        
        for( var i = 0 , arrayLength = returnArray.length ; i < arrayLength ; i++){
            returnArray[i] = returnArray[i] 
                ? returnArray[i] + "px" 
                : "0";
        }
        return returnArray.join(" ");
    }
}

class BarParts extends AddEvent{
    player : TSPlayer;
    controlBar : Bar;
    centerPlayButton     :HTMLDivElement
    separateString : string
    hasSetDuration      : Boolean = false
    hasSetCurrentTime   : Boolean = false
    constructor(player : TSPlayer , controlBar : Bar ){
        super()
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
