/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../Player.ts" />
/// <reference path="../Bar.ts" />

class BarPartsCenterPlayButton extends BarParts{
    /**
        <br>
        
        @method setPlayButton 
        @param {} 
        @return void
    */
    constructor(player : Player , controlBar : Bar , backgroundImageSetting : BarPartsSetting){
        super(player , controlBar);

        var centerPlayButton : HTMLDivElement = this.createButton(backgroundImageSetting)
        centerPlayButton.className = 'centerPlayButton';
        var style = centerPlayButton.style;
        style.position = 'absolute';
        style.left = (this.player.width  - backgroundImageSetting.width) / 2 + "px";
        style.top  = (this.player.height - backgroundImageSetting.height) / 2 + "px";
        
        var targetParent:HTMLDivElement = this.player.getMediaParent();
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
}
