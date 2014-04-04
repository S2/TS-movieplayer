/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />

class BarPartsPlayPauseButton extends BarParts{
    /**
        <br>
        
        @method setPlayButton 
        @param {} 
        @return void
    */
    constructor(player : TSPlayer , controlBar : Bar , playBarPartsSetting : BarPartsSetting , pauseBarPartsSetting : BarPartsSetting){
        super(player , controlBar);

        var playPauseButton  : HTMLDivElement = this.createButton(playBarPartsSetting)
        playPauseButton.className = 'controllButtonLeft playPauseButton';
        this.controlBar.getElement().appendChild(playPauseButton);
        
        // play
        this.player.hookAfterRestart(() => {
            this.modifyButton(playPauseButton , pauseBarPartsSetting)
        });
        this.player.hookAfterPlay(() => {
            this.modifyButton(playPauseButton , pauseBarPartsSetting)
        });

        // pause/end 
        this.player.hookAfterPause(() => {
            this.modifyButton(playPauseButton , playBarPartsSetting)
        });
        this.player.hookEnded(() => {
            this.modifyButton(playPauseButton , playBarPartsSetting)
        });

        this.addEvent(playPauseButton , 'click' , () => {
            this.player.togglePlayPause();
        },false);
        this.addEvent(playPauseButton , 'touch' , () => {
            this.player.togglePlayPause();
        },false);
    }
}
