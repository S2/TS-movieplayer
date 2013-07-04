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

    isIOS       : bool = false;
    isIPad      : bool = false;
    isIPod      : bool = false;
    isIPhone    : bool = false;
    isAndroid   : bool = false;

    isWebkit    : bool = false;
    isChorome   : bool = false;
    isFirefox   : bool = false;

    isPC        : bool = false;
    canTouch    : bool = false;
    version     : number ;
    
    constructor(target:HTMLVideoElement ,  createOption:CreateOption , controlOption:ControlesOption ,titleBarOption:TitleBarOption ){
        this.target = target;
        this.getEnvironment();
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

    private getEnvironment(){
        var userAgent = navigator.userAgent;
        var matches;
        if(matches = /Android (\d+\.\d+\.\d+)/.exec(userAgent)){
            this.isAndroid = true;
            this.version = matches[0];
        }
        if(userAgent.match('iPad')){
            this.isIOS  = true ;
            this.isIPad = true;
        }
        if(userAgent.match('iPod')){
            this.isIOS  = true ;
            this.isIPod = true;
        }
        if(userAgent.match('iPhone')){
            this.isIOS    = true ;
            this.isIPhone = true;
        }
        if(this.isIOS == false && this.isAndroid == false){
            // Windows Phone and others , not implemented
            this.isPC = true;
        }
        if(document.ontouchstart !== undefined){
            this.canTouch = true;
        }
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
