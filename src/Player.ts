/// <reference path="jquery.d.ts" />
/// <reference path="TitleBar.ts" />
/// <reference path="Controles.ts" />


// Add the missing definitions: 
interface HTMLVideoElement{
    requestFullscreen();
    webkitRequestFullScreen();
    mozRequestFullScreen();
    exitFullscreen();
    mozCancelFullScreen();
    webkitCancelFullScreen();
}

interface HTMLDocument{
    exitFullscreen();
    mozCancelFullScreen();
    webkitCancelFullScreen();
}

class CreateOption{
    width       : number;
    height      : number;
    movieSrcURL : number;
}

class Player{
    title        :TitleBar;
    controles    :Controles;
    width        :number;
    height       :number;
    target       :HTMLVideoElement;
    isPlaying    :bool = false;
    isFullScreen :bool = false;
    
    constructor(target:HTMLVideoElement ,  createOption:CreateOption , controlOption:ControlesOption ,titleBarOption:TitleBarOption ){
        this.target = target;
        this.getSize();

        this.title = new TitleBar(titleBarOption , this.width);
        this.controles = new Controles(controlOption , this.width);
        
        var thisObject = this;
        target.addEventListener('click', function(){
//                thisObject.togglePlayPause();
                thisObject.toggleFullScreen();
        } , false);

        this.setInitialVolume(0);
    }

    private getSize(){
        var target:HTMLVideoElement = this.target;
        this.width = parseInt(target.style.width.replace('px',''));
        if(this.width== 0){
            this.width = parseInt(getComputedStyle( target , '').width.replace('px', ''));
        }

        this.height = parseInt(target.style.height.replace('px',''));
        if(this.height == 0){
            this.height = parseInt(getComputedStyle( target , '').height.replace('px', ''));
        }
    }

    private setInitialVolume(volume:number){
        var target:HTMLVideoElement = this.target;
        target.volume = volume ;
    }

    private toggleFullScreen(){
        var target:HTMLVideoElement = this.target
        if(this.isFullScreen){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }

            this.isFullScreen = false;
        }else{
            if (target.requestFullscreen) {
                target.requestFullscreen();
            } else if (target.mozRequestFullScreen) {
                target.mozRequestFullScreen();
            } else if (target.webkitRequestFullScreen) {
                target.webkitRequestFullScreen();
            }
            this.isFullScreen = true;
        }
    }

    private togglePlayPause(){
        var target:HTMLVideoElement = this.target
        if(this.isPlaying){
            target.pause()
            this.isPlaying = false
            this.toggleFullScreen();
        }else{
            target.play()
            this.isPlaying = true 
            this.toggleFullScreen();
        }
    }

}
