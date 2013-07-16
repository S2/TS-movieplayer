/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="TitleBar.ts" />
/// <reference path="TitleBarOption.ts" />
/// <reference path="ControlBar.ts" />
/// <reference path="ControlBarOption.ts" />

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
    ontouchstart();
}

class CreateOption{
    width           : number;
    height          : number;
    movieSrcURL     : number;
    imagePath       : string = '../image/';
    largePlayButton : string = 'largeButton.svg';
}

var thisObject;
class Player{
    title               :TitleBar;
    control             :ControlBar;
    width               :number;
    height              :number;
    target              :HTMLVideoElement;
    targetParent        :HTMLDivElement;
    largePlayButton     :HTMLImageElement
    isPlaying           :bool = false;
    isPaused            :bool = false;
    isFullScreen        :bool = false;

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
    version     : number;
    duration    : number;
    createOption:CreateOption;

    constructor(target:HTMLVideoElement ,  createOption:CreateOption , controlOption:ControlBarOption ,titleBarOption:TitleBarOption ){
        this.target = target;
        this.createOption = createOption;
        this.getEnvironment();
        this.getSize();

        this.createParentDiv();

        this.title = new TitleBar(titleBarOption , this.width);
        this.control = new ControlBar(controlOption , this.width);

        thisObject = this;
        
        var largePlayButton = this.largePlayButton;

        this.setUpperBar(this.title);
        this.setLowerBar(this.control);

        largePlayButton.addEventListener('click' , function(){
//            thisObject.toggleFullScreen();
            thisObject.togglePlayPause();
        },false);

        largePlayButton.addEventListener('touch' , function(){
//            thisObject.toggleFullScreen();
            thisObject.togglePlayPause();
        },false);

        target.addEventListener('click' , function(){
            thisObject.togglePauseRestart();
        },false);

        target.addEventListener('touch' , function(){
            thisObject.togglePauseRestart();
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
        target.style.position = 'absolute';
        
        var parentNode = target.parentNode;
        var targetParent:HTMLDivElement = document.createElement('div');
        targetParent.appendChild(target);
        parentNode.appendChild(targetParent);
        this.targetParent = targetParent;

        target.style.top = "0";
        this.target = target;

        // create large play button
        
        var createOption:CreateOption = this.createOption;
        var largePlayButton = document.createElement('img');
        largePlayButton.style.position = 'absolute';
        largePlayButton.className = 'largePlayButton';
        largePlayButton.src = createOption.imagePath + createOption.largePlayButton;
        
        this.setCenterElementPosition(largePlayButton , 0.5);
        targetParent.appendChild(largePlayButton);

        this.largePlayButton = largePlayButton;
        this.duration = target.duration;
    }
    
    private setCenterElementPosition(element:HTMLElement , ratio:number){
        element.style.width = this.width * ratio + "px";
        element.style.height = element.style.width;
        element.style.left = (this.width  - this.width * ratio) / 2 + "px";
        element.style.top  = (this.height - this.width * ratio) / 2 + "px";
    }

    private setFullscreenCenterElementPosition(element:HTMLElement , ratio:number){
        var targetParent:HTMLElement = this.targetParent;
        var width = parseInt(targetParent.style.width.replace('px',''));
        if(!width){
            width = parseInt(getComputedStyle( targetParent , '').width.replace('px', ''));
        }
        
        var height = screen.height;

        element.style.width = width * ratio + "px";
        element.style.height = element.style.width;
        element.style.left = (width  - width * ratio) / 2 + "px";
        element.style.top  = (height - width * ratio) / 2 + "px";
    }

    private setInitialVolume(volume:number){
        var target:HTMLVideoElement = this.target;
        target.volume = volume ;
    }

    public toggleFullScreen(){
        var targetParent:HTMLElement = thisObject.targetParent
        var target:HTMLVideoElement = thisObject.target
        var largePlayButton = thisObject.largePlayButton;
        if(thisObject.isFullScreen){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            target.style.width  = thisObject.width + "px";
            target.style.height = thisObject.height + "px";
            thisObject.isFullScreen = false;
            thisObject.setCenterElementPosition(largePlayButton , 0.5);
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
            thisObject.isFullScreen = true;
            thisObject.setFullscreenCenterElementPosition(largePlayButton , 0.5);
        }
    }

    beforePlay : Array = [];
    public hookBeforePlay(hookMethod:()=>void){
        this.beforePlay.push(hookMethod);
    }

    afterPlay : Array = [];
    public hookAfterPlay(hookMethod:()=>void){
        this.afterPlay.push(hookMethod);
    }

    beforePause : Array = [];
    public hookBeforePause(hookMethod:()=>void){
        this.beforePause.push(hookMethod);
    }

    afterPause : Array = [];
    public hookAfterPause(hookMethod:()=>void){
        this.afterPause.push(hookMethod);
    }

    beforeRestart : Array = [];
    public hookBeforeRestart(hookMethod:()=>void){
        this.beforeRestart.push(hookMethod);
    }

    afterRestart : Array = [];
    public hookAfterRestart(hookMethod:()=>void){
        this.afterRestart.push(hookMethod);
    }

    private doMethodArray(methods:Array){
        for(var i = 0 ; i < methods.length ; i++){
            methods[i]();
        }
    }

    public togglePlayPause(){
        var target:HTMLVideoElement = thisObject.target;
        if(thisObject.isPlaying){
            thisObject.doMethodArray(thisObject.beforePause)
            target.pause()
            thisObject.isPaused = true;
            thisObject.doMethodArray(thisObject.afterPause)
            thisObject.isPlaying = false
        }else{
            if(thisObject.isPaused){
                thisObject.doMethodArray(thisObject.beforeRestart)
            }
            thisObject.doMethodArray(thisObject.beforePlay)
            target.play()
            thisObject.doMethodArray(thisObject.afterPlay)
            if(thisObject.isPaused){
                thisObject.doMethodArray(thisObject.AfterRestart)
            }
            thisObject.isPlaying = true 
            thisObject.isPaused = false
        }
        thisObject.toggleElement(thisObject.largePlayButton)
    }

    public togglePauseRestart(){
        var target:HTMLVideoElement = thisObject.target;
        if(!thisObject.isPlaying && thisObject.isPaused){
            thisObject.doMethodArray(thisObject.beforePlay)
            thisObject.doMethodArray(thisObject.beforeRestart)
            target.play()
            thisObject.doMethodArray(thisObject.afterPlay)
            thisObject.doMethodArray(thisObject.afterRestart)
            thisObject.isPlaying = true 
            thisObject.isPaused = false
            thisObject.toggleElement(thisObject.largePlayButton)
        }else if(thisObject.isPlaying){
            thisObject.doMethodArray(thisObject.beforePause)
            target.pause()
            thisObject.isPaused = true;
            thisObject.doMethodArray(thisObject.afterPause)
            thisObject.isPlaying = false
            thisObject.toggleElement(thisObject.largePlayButton)
        }
    }

    private toggleElement(element:HTMLElement){
        element.style.display = element.style.display == 'none' 
            ? 'block' 
            : 'none';
    }

    private setLowerBar(barObject:Bar){
        var bar:HTMLElement = barObject.createElement(this);

        var height = parseInt(bar.style.height.replace('px',''));
        if(!height){
            height = parseInt(getComputedStyle( bar , '').height.replace('px', ''));
        }
        
        bar.style.top  = (this.height - height) + "px";

        var target:HTMLVideoElement = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);

    }

    private setUpperBar(barObject:Bar){
        var bar:HTMLElement = barObject.createElement(this);
        bar.style.top  = "0px";

        var target:HTMLVideoElement = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
    }

    private setFullscreenLowerBar(barObject:Bar){
        var bar:HTMLElement = barObject.createElement(this);

        var screenHeight = screen.height;

        var height = parseInt(bar.style.height.replace('px',''));
        if(!height){
            height = parseInt(getComputedStyle( bar , '').height.replace('px', ''));
        }

        bar.style.top  = (screenHeight - height) + "px";
    }
}
