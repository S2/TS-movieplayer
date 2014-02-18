/// <reference path="jquery.d.ts" />
/// <reference path="Player.ts" />

interface ControlsOption{
}

class Controls{
    player : Player;
    constructor(player : Player){
        this.player = player;
    }
    
    /**
        <br>
        
        @method setCenterPlayButton 
        @param {} 
        @return void
    */
    public setCenterPlayButton(src : string , top : number , left : number):void{
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
