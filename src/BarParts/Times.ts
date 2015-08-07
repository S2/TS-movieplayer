/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />

class BarPartsTimes extends BarParts{
    timeStringPx : number 
    timeStringMarginTop : number
    constructor(player : TSPlayer , controlBar : Bar , separateString : string = "/" , timeStringPx : number = null, timeStringMarginTop : number = 0){
        super(player , controlBar);

        this.timeStringPx = timeStringPx
        this.timeStringMarginTop = timeStringMarginTop

        this.separateString = separateString;

        this.hasSetCurrentTime = true;
    }

    public setCurrentTime():void{
        var barHeight : number = this.controlBar.getHeight();
        var area : HTMLDivElement = document.createElement('div');
        area.style.height = barHeight + "px";
        area.innerHTML = "00:00";
        if(this.timeStringPx){
            area.style.fontSize = this.timeStringPx + "px";
        }
        area.style.marginTop = this.timeStringMarginTop + "px";
        area.className = 'controllButtonLeft currentTime';
        this.controlBar.getElement().appendChild(area);

        this.player.hookTimeupdate((player:TSPlayer , video:HTMLVideoElement)=>{
            var currentTime = player.getCurrentTime();
            var currentTimeString = this.getTime(currentTime);
            area.innerHTML = currentTimeString;
        });
    }

    public setDuration(durationSeconds : number):void{
        var className = 'controllButtonLeft duration';
        var area : HTMLDivElement;
        var areaExists = false;
        var controllElements = (<Node>this.controlBar.getElement()).childNodes;
        for( var i = 0 , arrayLength = controllElements.length ; i < arrayLength ; i++){
            var element = <HTMLDivElement>controllElements[i];
            if(element.className == className){
                area = element
                areaExists = true;
                break
            }
        }
        
        var barHeight : number = this.controlBar.getHeight();
        area = area || document.createElement('div');
        area.style.height = barHeight + "px";
        if(this.timeStringPx){
            area.style.fontSize = this.timeStringPx + "px";
        }
        area.style.marginTop = this.timeStringMarginTop + "px";
        
        var durationString : string = this.getTime(durationSeconds)

        area.innerHTML = durationString;
        area.className = className;

        if(!areaExists && this.hasSetCurrentTime && this.separateString){
            // display separator
            var separator : HTMLDivElement = document.createElement('div');
            separator.style.height = barHeight + "px";
            separator.innerHTML = this.separateString;
            if(this.timeStringPx){
                separator.style.fontSize = this.timeStringPx + "px";
            }
            separator.style.marginTop = this.timeStringMarginTop + "px";
            separator.className = 'controllButtonLeft separator';
            this.controlBar.getElement().appendChild(separator);
        }
        if(!areaExists){
            this.controlBar.getElement().appendChild(area);
        }
    }
}
