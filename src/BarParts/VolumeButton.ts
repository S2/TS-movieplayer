/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../Player.ts" />
/// <reference path="../Bar.ts" />

class BarPartsVolumeButton extends BarParts{
    constructor(player : Player , controlBar : Bar ,
            volumeOnImageSetting : BarPartsSetting , 
            volumeOffImageSetting : BarPartsSetting
            ){
        super(player , controlBar);

        var volumeButton  : HTMLDivElement = this.createButton(volumeOnImageSetting)
        volumeButton.className = 'controllButtonLeft volumeButton';
        volumeButton.style.position = "relative"
        this.controlBar.getElement().appendChild(volumeButton);
        
        volumeButton.addEventListener("click" , () => {this.player.toggleVolume()});
        volumeButton.addEventListener("touch" , () => {this.player.toggleVolume()});
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
        volumeButton.addEventListener('mouseover' , () => {
            volumeArea.style.visibility = "visible";
            volumeArea.style.display    = "block";
        }, false);
        volumeArea.addEventListener('mouseover' , () => {
            volumeArea.style.visibility = "visible";
            volumeArea.style.display    = "block";
        }, false);
        volumeButton.addEventListener('mouseout' , () => {
            volumeArea.style.visibility = "hidden";
            volumeArea.style.display    = "none";
        }, false);

        volumeArea.addEventListener('click', (e) => {
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
        volumeSlider.addEventListener('mousedown', (e) => {
            moveStart = true;
        }, false);

        volumeArea.addEventListener('mousemove', (e) => {
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

        document.addEventListener('mouseup', (e) => {
            moveStart = false;
        }, false);
    }
}
