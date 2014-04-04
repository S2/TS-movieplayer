/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />

class BarPartsVolumeButton extends BarParts{
    constructor(player : TSPlayer , controlBar : Bar ,
            volumeOnImageSetting : BarPartsSetting , 
            volumeOffImageSetting : BarPartsSetting
            ){
        super(player , controlBar);

        var volumeButton  : HTMLDivElement = this.createButton(volumeOnImageSetting)
        volumeButton.className = 'controllButtonLeft volumeButton';
        volumeButton.style.position = "relative"
        this.controlBar.getElement().appendChild(volumeButton);
        
        this.addEvent(volumeButton , "click" , () => {this.player.toggleVolume()});
        this.addEvent(volumeButton , "touch" , () => {this.player.toggleVolume()});
        //  volume on
        this.player.hookVolumeOn(() => {
            this.modifyButton(volumeButton , volumeOnImageSetting)
        });
        // volume off
        this.player.hookVolumeOff(() => {
            this.modifyButton(volumeButton , volumeOffImageSetting)
        });
    
        var volume = this.player.getVolume();

        var volumeArea = document.createElement("div");
        volumeArea.style.position = "absolute";
        volumeArea.style.top = "-123px";
        volumeArea.style.left = "-" + ((30 - volumeOnImageSetting.width) / 2) + "px";
        volumeArea.className = "volumeArea";

        var volumeSlider = document.createElement("div");
        volumeSlider.className = "volumeSlider";
        volumeSlider.style.top = 10 + 100 * volume + "px";
        
        var volumeBarTotal = document.createElement("div");
        volumeBarTotal.className = "volumeBarTotal";

        var volumeBarCurrent = document.createElement("div");
        volumeBarCurrent.className = "volumeBarCurrent";
        
        volumeBarTotal.style.height = 100 * volume + "px";
        volumeBarTotal.style.top = "10px";
        volumeBarCurrent.style.height = (100 - 100 * volume) + "px";
        volumeBarCurrent.style.top = 10 + (100 - 100 * volume) + "px";
        
        volumeArea.appendChild(volumeSlider);
        volumeArea.appendChild(volumeBarTotal);
        volumeArea.appendChild(volumeBarCurrent);

        volumeButton.appendChild(volumeArea);
        this.addEvent(volumeButton , 'mouseover' , () => {
            volumeArea.style.visibility = "visible";
            volumeArea.style.display    = "block";
        }, false);
        this.addEvent(volumeArea ,'mouseover' , () => {
            volumeArea.style.visibility = "visible";
            volumeArea.style.display    = "block";
        }, false);
        this.addEvent(volumeButton , 'mouseout' , () => {
            volumeArea.style.visibility = "hidden";
            volumeArea.style.display    = "none";
        }, false);

        this.addEvent(volumeArea , 'click', (e) => {
            var barTop = volumeSlider.getBoundingClientRect().top
            var dy = e.pageY - barTop
            var changeToBarTop = parseInt(volumeSlider.style.top.replace("px" , "")) + dy
            if(changeToBarTop < 10){
                changeToBarTop = 10;
            }
            if(changeToBarTop > 110){
                changeToBarTop = 110;
            }
            volumeSlider.style.top = changeToBarTop + "px"
            this.player.setVolume(-1 * dy / 100)
        }, false);
        
        var moveStart = false;
        this.addEvent(volumeSlider , 'mousedown', (e) => {
            moveStart = true;
        }, false);

        this.addEvent(volumeArea , 'mousemove', (e) => {
            if(!moveStart){
                return;
            }
            var barTop = volumeSlider.getBoundingClientRect().top
            var dy = e.pageY - barTop
            var changeToBarTop = parseInt(volumeSlider.style.top.replace("px" , "")) + dy
            if(changeToBarTop < 10){
                changeToBarTop = 10;
            }
            if(changeToBarTop > 110){
                changeToBarTop = 110;
            }
            volumeSlider.style.top = changeToBarTop + "px"
            this.player.setVolume(-1 * dy / 100)
        }, false);

        this.addDocumentEvent( 'mouseup', (e) => {
            moveStart = false;
        }, false);
    }
}
