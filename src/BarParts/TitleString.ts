/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../Player.ts" />
/// <reference path="../Bar.ts" />

class BarPartsTitleString extends BarParts{
    constructor(player : Player , titleBar : Bar , titleString : string){
        super(player , titleBar);

        this.hasSetCurrentTime = true;
        var barHeight : number = this.controlBar.getHeight();
        var area : HTMLDivElement = document.createElement('div');
        area.style.height = barHeight + "px";
        area.innerHTML = titleString;
        area.className = 'controllButtonCenter';
        this.controlBar.getElement().appendChild(area);
    }
}
