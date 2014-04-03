/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />

class BarPartsLoadingImage extends BarParts{
    loadingImage : HTMLDivElement
    style : HTMLStyle
    constructor(player : TSPlayer , controlBar : Bar , imageSetting : BarPartsSetting){
        super(player , controlBar);

        var loadingImage  : HTMLDivElement = this.createButton(imageSetting)
        loadingImage.className = 'loadingImage';
        var style = loadingImage.style
        style.visibility = "hidden";
        style.display    = "none";
        style.position = 'absolute';
        style.left = (this.player.width  - imageSetting.width) / 2 + "px";
        style.top  = (this.player.height - imageSetting.height) / 2 + "px";

        var targetParent:HTMLDivElement = this.player.getMediaParent();
        targetParent.appendChild(loadingImage);
        this.loadingImage = loadingImage;
        this.style = this.loadingImage.style
    }

    public visible(){
        this.style.visibility = "visible";
        this.style.display    = "block";
    }

    public invisible(){
        this.style.visibility = "hidden"
        this.style.display    = "none"
    }
}
