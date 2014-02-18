/// <reference path="jquery.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="Bar.ts" />

class Controls{
    player : Player;
    controlBar : Bar;
    centerPlayButton     :HTMLImageElement
    constructor(player : Player , controlBar : Bar){
        this.player = player;
        this.controlBar = controlBar;
    }
    
    private setButtonImage(src : string , top : number , left : number){
    }

    private setCenterElementPosition(element:HTMLElement , ratio:number){
        element.style.width = this.player.width * ratio + "px";
        element.style.height = element.style.width;
        element.style.left = (this.player.width  - this.player.width * ratio) / 2 + "px";
        element.style.top  = (this.player.height - this.player.width * ratio) / 2 + "px";
        element.style.zIndex = "10000";
    }

    /**
        <br>
        
        @method setCenterPlayButton 
        @param {} 
        @return void
    */
    public setCenterPlayButton(src : string , top : number , left : number):void{
        var centerPlayButton = document.createElement('img');
        centerPlayButton.style.position = 'absolute';
        centerPlayButton.className = 'centerPlayButton';
        centerPlayButton.src = src;
        
        this.setCenterElementPosition(centerPlayButton , 0.5);
        var targetParent:HTMLDivElement = this.player.targetParent;
        targetParent.appendChild(centerPlayButton);

        this.centerPlayButton = centerPlayButton;
        
        centerPlayButton.addEventListener('click' , () => {
            this.player.togglePlayPause();
        },false);

        centerPlayButton.addEventListener('touch' , () => {
            this.player.togglePlayPause();
        },false);

        this.player.hookFullscreenEnter(() => {
            this.setCenterElementPosition(centerPlayButton , 0.5);
        });

        this.player.hookFullscreenExit(() => {
            this.setCenterElementPosition(centerPlayButton , 0.5);
        });
        
        var style= this.centerPlayButton.style;
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
    public setPlayButton(src : string , top : number , left : number):void{
    }

    /**
        <br>
        
        @method setPauseButton 
        @param {} 
        @return void
    */
    public setPauseButton(src : string , top : number , left : number):void{
    }

    /**
        <br>
        
        @method setFullscreenButton 
        @param {} 
        @return void
    */
    public setFullscreenButton(src : string , top : number , left : number):void{
    }
    
    /**
        <br>
        
        @method setVolumeButton 
        @param {} 
        @return void
    */
    public setVolumeButton(src : string , top : number , left : number):void{
    }

    /**
        <br>
        
        @method setVolumeBar 
        @param {} 
        @return void
    */
    public setVolumeBar(src : string , top : number , left : number):void{
    }

    /**
        <br>
        
        @method setVolumeBackground 
        @param {} 
        @return void
    */
    public setVolumeBackground(src : string , top : number , left : number):void{
    }

    /**
        <br>
        
        @method setControlBackground 
        @param {} 
        @return void
    */
    public setControlBackground(src : string , top : number , left : number):void{
    }
}
