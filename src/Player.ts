/// <reference path="jquery.d.ts" />
/// <reference path="TitleBar.ts" />
/// <reference path="Controles.ts" />

// Add the missing definitions: 
interface HTMLElement{
    requestFullscreen();
    webkitRequestFullScreen();
    mozRequestFullScreen();
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
    targetParent :HTMLDivElement;
    isPlaying    :bool = false;
    isFullScreen :bool = false;
    
    constructor(target:HTMLVideoElement ,  createOption:CreateOption , controlOption:ControlesOption ,titleBarOption:TitleBarOption ){
        this.target = target;
        this.createParentDiv();
        this.getSize();

        this.title = new TitleBar(titleBarOption , this.width);
        this.controles = new Controles(controlOption , this.width);

        var thisObject = this;
        
        target.addEventListener('click' , function(){
            thisObject.toggleFullScreen();
            thisObject.togglePlayPause();
        },false);

        target.addEventListener('touch' , function(){
            thisObject.toggleFullScreen();
            thisObject.togglePlayPause();
        },false);

        this.setInitialVolume(0);
    }

    private getSize(){
        var target:HTMLVideoElement = this.target;
        this.width = parseInt(target.style.width.replace('px',''));
        if(!this.width){
            this.width = parseInt(getComputedStyle( target , '').width.replace('px', ''));
        }
        
        this.height = parseInt(target.style.height.replace('px',''));
        if(!this.height){
            this.height = parseInt(getComputedStyle( target , '').height.replace('px', ''));
        }
    }
    
    private createParentDiv(){
        var target:HTMLVideoElement = this.target;
        
        var parentNode = target.parentNode;
        var targetParent:HTMLDivElement = document.createElement('div');
        targetParent.appendChild(target);
        parentNode.appendChild(targetParent);
        this.targetParent = targetParent;
        this.target = target;
    }

    private setInitialVolume(volume:number){
        var target:HTMLVideoElement = this.target;
        target.volume = volume ;
    }

    private toggleFullScreen(){
        var targetParent:HTMLElement = this.targetParent
        var target:HTMLVideoElement = this.target
        if(this.isFullScreen){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            target.style.width  = this.width + "px";
            target.style.height = this.height + "px";
            this.isFullScreen = false;
        }else{
            if (targetParent.requestFullscreen) {
                targetParent.requestFullscreen();
            } else if (targetParent.mozRequestFullScreen) {
                targetParent.mozRequestFullScreen();
            } else if (targetParent.webkitRequestFullScreen) {
                targetParent.webkitRequestFullScreen();
            }
            target.style.width  = '100%';
            target.style.height = '100%';
            this.isFullScreen = true;
        }
    }

    private togglePlayPause(){
        var target:HTMLVideoElement = this.target
        if(this.isPlaying){
            target.pause()
            this.isPlaying = false
        }else{
            target.play()
            this.isPlaying = true 
        }
    }

}
