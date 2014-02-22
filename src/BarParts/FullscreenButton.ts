/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../Player.ts" />
/// <reference path="../Bar.ts" />

class BarPartsFullscreenButton extends BarParts{
    constructor(player : Player , controlBar : Bar , imageSetting : BarPartsSetting){
        super(player , controlBar);

        var fullscreenButton  : HTMLDivElement = this.createButton(imageSetting)
        fullscreenButton.className = 'controllButtonRight playPauseButton';
        fullscreenButton.addEventListener('click' , ()=>{
            this.player.toggleFullscreen()
        } , false);
        this.controlBar.getElement().appendChild(fullscreenButton);
    }
}
