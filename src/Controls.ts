/// <reference path="jquery.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="Bar.ts" />

class ButtonOption{
    src         :  string;
    width       :  number;
    height      :  number;
    top         :  number;
    left        :  number;
    scaleWidth  :  number;
    scaleHeight :  number;
    constructor(src , width , height , top , left , scaleWidth , scaleHeight){
        this.src         = src
        this.width       = width
        this.height      = height
        this.top         = top
        this.left        = left
        this.scaleWidth  = scaleWidth
        this.scaleHeight = scaleHeight
    }
}

class Controls{
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
    
    private createButton(buttonOption : ButtonOption):HTMLDivElement{
        var button: HTMLDivElement = document.createElement('div');
        var style = button.style;
        style.width               = buttonOption.width + "px";
        style.height              = buttonOption.height + "px";
        style.backgroundImage     = "url('" + buttonOption.src + "')";
        style.backgroundRepeat    =  "no-repeat";
        style.backgroundPosition  = buttonOption.top + "px " + buttonOption.left + "px";
        style.backgroundSize      = buttonOption.scaleWidth + "% " + buttonOption.scaleHeight + "%";
        style.zIndex              = (<ControlBar>this.controlBar).getZIndex() + 1 + "";
        return button;
    }

    /**
        <br>
        
        @method setCenterPlayButton 
        @param width        {number} image element Width
        @param height       {number} image element Height
        @param top          {number} image element view area start top  for CSS Sprite
        @param left         {number} image element view area start left for CSS Sprite
        @param scaleWidth   {number} background image view ratio
        @param scaleHeight  {number} background image view ratio
        @return void
    */
    public setCenterPlayButton(buttonOption : ButtonOption):void{
        var centerPlayButton : HTMLDivElement = this.createButton(buttonOption)
        centerPlayButton.className = 'centerPlayButton';
        var style = centerPlayButton.style;
        style.position = 'absolute';
        style.left = (this.player.width  - buttonOption.width) / 2 + "px";
        style.top  = (this.player.height - buttonOption.height) / 2 + "px";
        
        var targetParent:HTMLDivElement = this.player.targetParent;
        targetParent.appendChild(centerPlayButton);

        this.centerPlayButton = centerPlayButton;
        
        centerPlayButton.addEventListener('click' , () => {
            this.player.togglePlayPause();
        },false);

        centerPlayButton.addEventListener('touch' , () => {
            this.player.togglePlayPause();
        },false);

        // hide
        this.player.hookAfterRestart(() => {
            style.visibility = "hidden";
            style.display    = "none";
        });
        this.player.hookAfterPlay(() => {
            style.visibility = "hidden";
            style.display    = "none";
        });

        // view 
        this.player.hookAfterPause(() => {
            style.visibility = "visible";
            style.display    = "block";
        });
        this.player.hookEnded(() => {
            style.visibility = "visible";
            style.display    = "block";
        });
    }
 
    private modifyButton(button:HTMLDivElement , buttonOption : ButtonOption):void{
        var style = button.style;
        style.width               = buttonOption.width + "px";
        style.height              = buttonOption.height + "px";
        style.backgroundImage     = "url('" + buttonOption.src + "')";
        style.backgroundRepeat    =  "no-repeat";
        style.backgroundPosition  = buttonOption.top + "px " + buttonOption.left + "px";
        style.backgroundSize      = buttonOption.scaleWidth + "% " + buttonOption.scaleHeight + "%";
    }

    /**
        <br>
        
        @method setPlayButton 
        @param {} 
        @return void
    */
    public setPlayButton(playButtonOption : ButtonOption , pauseButtonOption : ButtonOption){
        var playPauseButton  : HTMLDivElement = this.createButton(pauseButtonOption)
        playPauseButton.className = 'controllButtonLeft playPauseButton';
        this.controlBar.getElement().appendChild(playPauseButton);
        
        // play
        this.player.hookAfterRestart(() => {
            this.modifyButton(playPauseButton , pauseButtonOption)
        });
        this.player.hookAfterPlay(() => {
            this.modifyButton(playPauseButton , pauseButtonOption)
        });

        // pause/end 
        this.player.hookAfterPause(() => {
            this.modifyButton(playPauseButton , playButtonOption)
        });
        this.player.hookEnded(() => {
            this.modifyButton(playPauseButton , playButtonOption)
        });

        playPauseButton.addEventListener('click' , () => {
            this.player.togglePlayPause();
        },false);
        playPauseButton.addEventListener('touch' , () => {
            this.player.togglePlayPause();
        },false);
    }

    /**
        <br>
        
        @method setFullscreenButton 
        @param {} 
        @return void
    */
    public setFullscreenButton(buttonOption : ButtonOption):void{
        var fullscreenButton  : HTMLDivElement = this.createButton(buttonOption)
        fullscreenButton.className = 'controllButtonRight playPauseButton';
        this.controlBar.getElement().appendChild(fullscreenButton);
    }
    
    /**
        <br>
        
        @method setVolumeButton 
        @param {} 
        @return void
    */
    public setVolumeButton(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
    }

    /**
        <br>
        
        @method setVolumeBar 
        @param {} 
        @return void
    */
    public setVolumeBar(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
    }

    /**
        <br>
        
        @method setVolumeBackground 
        @param {} 
        @return void
    */
    public setVolumeBackground(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
    }
    
    /**
        <br>
        
        @method setSeparator 
        @param {string} 
        @return void
    */
    public setSeparator(separateString : string):void{
        this.separateString = separateString;
    }

    /**
        <br>
        
        @method setCurrentTime 
        @param {} 
        @return void
    */
    public setCurrentTime():void{
        this.hasSetCurrentTime = true;
        var barHeight : number = this.controlBar.getHeight();
        var area : HTMLDivElement = document.createElement('div');
        area.style.height = barHeight + "px";
        area.innerHTML = "00:00";
        area.className = 'controllButtonLeft currentTime';
        this.controlBar.getElement().appendChild(area);

        this.player.hookTimeUpdate((player:Player , video:HTMLVideoElement)=>{
            var currentTime = player.getCurrentTime();
            var currentTimeString = this.getTime(currentTime);
            area.innerHTML = currentTimeString;
        });
    }

    /**
        <br>
        
        @method setDuration 
        @param {} 
        @return void
    */
    public setDuration(durationSeconds : number):void{
        var barHeight : number = this.controlBar.getHeight();
        var area : HTMLDivElement = document.createElement('div');
        area.style.height = barHeight + "px";
        
        var durationString : string = this.getTime(durationSeconds)

        area.innerHTML = durationString;
        area.className = 'controllButtonLeft duration';

        if(this.hasSetCurrentTime && this.separateString){
            // display separator
            var separator : HTMLDivElement = document.createElement('div');
            separator.style.height = barHeight + "px";
            separator.innerHTML = this.separateString;
            separator.className = 'controllButtonLeft';
            this.controlBar.getElement().appendChild(separator);
        }
        this.controlBar.getElement().appendChild(area);
    }

    private getTime(time : number) : string{
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
