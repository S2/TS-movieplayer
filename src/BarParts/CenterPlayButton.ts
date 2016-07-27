/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />

class BarPartsCenterPlayButton extends BarParts{
    /**
        <br>
        
        @method setPlayButton 
        @param {} 
        @return void
    */
    centerPlayButton : HTMLDivElement
    backgroundImageSetting : BarPartsSetting
    removed = false
    constructor(player : TSPlayer , controlBar : Bar , backgroundImageSetting : BarPartsSetting){
        super(player , controlBar);

        var centerPlayButton : HTMLDivElement = this.createButton(backgroundImageSetting)
        centerPlayButton.className = 'centerPlayButton';
        var style = centerPlayButton.style;
        style.position = 'absolute';
        style.left = (this.player.width  - backgroundImageSetting.width) / 2 + "px";
        style.top  = (this.player.height - backgroundImageSetting.height) / 2 + "px";
        
        if(player.createOption.iosInitDisplayCenterButton == false && player.isIOSMobile){
            this.player.hookAfterPlay(()=>{
                if(this.removed == false){
                    var targetParent:HTMLDivElement = <HTMLDivElement>this.player.media.parentNode;
                    targetParent.appendChild(centerPlayButton)
                }
            })
        }else{
            if(player.isIOSMobile){
                var targetParent:HTMLDivElement = <HTMLDivElement>this.player.media.parentNode;
                targetParent.appendChild(centerPlayButton)
            }else{
                var targetParent:HTMLDivElement = this.player.getMediaParent();
                targetParent.appendChild(centerPlayButton);
            }
        }

        this.centerPlayButton = centerPlayButton;
        
        this.addEvent(centerPlayButton ,'click' , () => {
            this.player.togglePlayPause();
        },false);

        this.addEvent(centerPlayButton , 'touch' , () => {
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
        this.centerPlayButton = centerPlayButton
        this.backgroundImageSetting = backgroundImageSetting
    }

    resize(width :number , height : number){
        var style = this.centerPlayButton.style;
        style.left = (width  - this.backgroundImageSetting.width) / 2 + "px";
        style.top  = (height - this.backgroundImageSetting.height) / 2 + "px";
 
    }
    
    /**
        <br>
        
        @method remove 
        @param {} 
        @return void
    */
    public remove():void{
        this.removed = true;
        var targetParent:HTMLDivElement = <HTMLDivElement>this.player.media.parentNode;
        if(targetParent){
            try{
                targetParent.removeChild(this.centerPlayButton)
            }catch(e){}
        }
    }
}
