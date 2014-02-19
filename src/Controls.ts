/// <reference path="jquery.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="Bar.ts" />

class Controls{
    player : Player;
    controlBar : Bar;
    centerPlayButton     :HTMLDivElement
    constructor(player : Player , controlBar : Bar){
        this.player = player;
        this.controlBar = controlBar;
    }
    
    private createButton(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):HTMLDivElement{
        var button: HTMLDivElement = document.createElement('div');
        var style = button.style;
        style.width               = width + "px";
        style.height              = height + "px";
        style.backgroundImage     = "url('" + src + "')";
        style.backgroundRepeat    =  "no-repeat";
        style.backgroundPosition  = top + "px " + left + "px";
        style.backgroundSize      = scaleWidth + "% " + scaleHeight + "%";
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
    public setCenterPlayButton(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
        var centerPlayButton : HTMLDivElement = this.createButton(src , width , height , top , left , scaleWidth , scaleHeight )
        centerPlayButton.className = 'centerPlayButton';
        var style = centerPlayButton.style;
        style.position = 'absolute';
        style.left = (this.player.width  - width) / 2 + "px";
        style.top  = (this.player.height - height) / 2 + "px";
        
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
    
    /**
        <br>
        
        @method setPlayButton 
        @param {} 
        @return void
    */
    public setPlayButton(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
        var playButton : HTMLDivElement = this.createButton(src , width , height , top , left , scaleWidth , scaleHeight )
        playButton .className = 'playButton';
        var style = playButton.style;
        this.controlBar.getElement().appendChild(playButton);
    }

    /**
        <br>
        
        @method setPauseButton 
        @param {} 
        @return void
    */
    public setPauseButton(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
        var pauseButton : HTMLDivElement = this.createButton(src , width , height , top , left , scaleWidth , scaleHeight )
        pauseButton .className = 'pauseButton';
        var style = pauseButton.style;
        this.controlBar.getElement().appendChild(pauseButton);
    }

    /**
        <br>
        
        @method setFullscreenButton 
        @param {} 
        @return void
    */
    public setFullscreenButton(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
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
        
        @method setControlBackground 
        @param {} 
        @return void
    */
    public setControlBackground(src : string , width : number , height : number , top : number , left : number , scaleWidth : number , scaleHeight : number):void{
    }
}
