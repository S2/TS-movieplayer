/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../Player.ts" />
/// <reference path="../Bar.ts" />

class BarPartsTimes extends BarParts{
    constructor(player : Player , controlBar : Bar , separateString? : string){
        super(player , controlBar);

        this.separateString = separateString;

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
}
