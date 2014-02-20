/// <reference path="jquery.d.ts" />
/// <reference path="Controls.ts" />
/// <reference path="Bar.ts" />
/// <reference path="TitleBar.ts" />
/// <reference path="TitleBarOption.ts" />
/// <reference path="SeekBar.ts" />
/// <reference path="SeekBarOption.ts" />
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
    width                :  number;
    height               :  number;
    movieSrcURL          :  number;
    imagePath            :  string = '../image/';
    viewControllBar      :  Boolean = true;
    viewTitleBar         :  Boolean = true;
    viewSeekBar          :  Boolean = true;
    displayAlwaysSeekBar :  Boolean = true;
}

class Player{
    title               :TitleBar;
    control             :ControlBar;
    seekbar             :SeekBar;
    controls            :Controls;
    width               :number;
    height              :number;
    setHeight           :number = 0;
    target              :HTMLVideoElement;
    targetParent        :HTMLDivElement;
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

    constructor(target:HTMLVideoElement ,  
            createOption:CreateOption = new CreateOption(), 
            controlOption:ControlBarOption = new ControlBarOption() ,
            titleBarOption:TitleBarOption = new TitleBarOption() ,
            seekBarOption:SeekBarOption = new SeekBarOption()){
        this.target = target;
        this.createOption = createOption;
        this.getEnvironment();
        this.getSize();

        this.createParentDiv();

        this.title = new TitleBar(titleBarOption , this.width);
        this.control = new ControlBar(controlOption , this.width);
        this.seekbar = new SeekBar(seekBarOption , this.width);
        
       if(createOption.viewControllBar){
            this.setLowerBar(this.control);
        }
        if(createOption.viewTitleBar){
            this.setUpperBar(this.title);
        }
        var seekbar
        if(createOption.viewSeekBar){
            seekbar = this.setLowerBar(this.seekbar);
        }
        this.controls = new Controls(this , this.control);

        var centerBackgroundImageSetting = new BackgroundImageSetting('../image/largeButton.svg' , 240 , 240 , 30 , 30 , 80 , 80 , new Margin(0 , 0 , 0 , 0));
        this.controls.setCenterPlayButton(centerBackgroundImageSetting);

        var playBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg'      , 16 , 16 , 0 , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        var pauseBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg' , 16 , 16 , 0 , -16  , 100 , 100 , new Margin(7 , 5 , 7 , 5));

        this.controls.setPlayButton(playBackgroundImageSetting , pauseBackgroundImageSetting );

        this.controls.setCurrentTime();
        this.controls.setSeparator(" / ");
        this.controls.setDuration(this.duration);

        var fullscreenBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg' , 16 , 16 , -32  , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        this.controls.setFullscreenButton(fullscreenBackgroundImageSetting);

        target.addEventListener('click' , () => {
            this.togglePauseRestart();
        },false);
        target.addEventListener('touch' , () => {
            this.togglePauseRestart();
        },false);
        
        target.addEventListener('timeupdate' , () => {
            this.doMethodArray(this.timeUpdate)
        },false);

        target.addEventListener('ended' , () => {
            this.doMethodArray(this.ended)
            this.isPlaying = false;
            this.isPaused = false
        },false);
        
        var displayControll = true;
        target.addEventListener('mouseover' , () => {
            if(this.isPlaying){
                this.title.feedIn(0 , 50);
                this.control.feedIn(0 , 50);
                if(!this.createOption.displayAlwaysSeekBar){
                    this.seekbar.feedIn(0 , 50);
                }else{
                    if(!displayControll){
                        seekbar.style.top = parseInt(seekbar.style.top.replace("px" , "")) - this.control.getHeight() + "px";
                    }
                }
                displayControll  = true;
            }
        },false);
        target.addEventListener('mouseout' , () => {
            if(this.isPlaying){
                this.title.feedOut(0 , 50);
                this.control.feedOut(0 , 50);
                if(!this.createOption.displayAlwaysSeekBar){
                    this.seekbar.feedOut(0 , 50);
                }else{
                    if(displayControll){
                        this.control.setFeedOutHookOnce( () => {
                            seekbar.style.top = parseInt(seekbar.style.top.replace("px" , "")) + this.control.getHeight() + "px";
                        })
                    }
                }
                displayControll  = false;
            }
        },false);

        this.hookEnded((player:Player , video:HTMLVideoElement) => {
            this.title.feedIn(0 , 50);
            this.control.feedIn(0 , 50);
            if(!this.createOption.displayAlwaysSeekBar){
                this.seekbar.feedIn(0 , 50);
            }else{
                if(!displayControll){
                    seekbar.style.top = parseInt(seekbar.style.top.replace("px" , "")) - this.control.getHeight() + "px";
                }
            }
            displayControll  = true;
        });
        this.setInitialVolume(0);
    }
    
    public setCurrentTime(moveToSec:number){
        var target = this.target;
        target.currentTime = moveToSec;
        target.play();
    }

    public getCurrentTime() : number{
        var target = this.target;
        return target.currentTime ;
    }

    public getDuration():number{
        if(!this.duration){
            this.duration = this.target.duration;
        }
        return this.duration;
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

        this.duration = target.duration;
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

    private beforePlay : Array = [];
    public hookBeforePlay(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.beforePlay.push(hookMethod);
    }

    private afterPlay : Array = [];
    public hookAfterPlay(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.afterPlay.push(hookMethod);
    }

    private beforePause : Array = [];
    public hookBeforePause(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.beforePause.push(hookMethod);
    }

    private afterPause : Array = [];
    public hookAfterPause(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.afterPause.push(hookMethod);
    }

    private beforeRestart : Array = [];
    public hookBeforeRestart(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.beforeRestart.push(hookMethod);
    }

    private afterRestart : Array = [];
    public hookAfterRestart(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.afterRestart.push(hookMethod);
    }

    private timeUpdate: Array = [];
    public hookTimeUpdate(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.timeUpdate.push(hookMethod);
    }

    private ended : Array = [];
    public hookEnded(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.ended.push(hookMethod);
    }

    private fullscreenEnter : Array = [];
    public hookFullscreenEnter(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.fullscreenEnter.push(hookMethod);
    }

    private fullscreenExit : Array = [];
    public hookFullscreenExit(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.fullscreenExit.push(hookMethod);
    }

    private doMethodArray(methods:Array){
        for(var i = 0 ; i < methods.length ; i++){
            methods[i](this, this.target);
        }
    }
    
    public togglePlayPause(){
        var target:HTMLVideoElement = this.target;
        if(this.isPlaying){
            this.doMethodArray(this.beforePause)
            target.pause()
            this.isPaused = true;
            this.doMethodArray(this.afterPause)
            this.isPlaying = false
        }else{
            if(this.isPaused){
                this.doMethodArray(this.beforeRestart)
            }
            this.doMethodArray(this.beforePlay)
            target.play()
            this.doMethodArray(this.afterPlay)
            if(this.isPaused){
                this.doMethodArray(this.afterRestart)
            }
            this.isPlaying = true 
            this.isPaused = false
        }
    }

    public togglePauseRestart(){
        var target:HTMLVideoElement = this.target;
        if(!this.isPlaying && this.isPaused){
            this.doMethodArray(this.beforePlay)
            this.doMethodArray(this.beforeRestart)
            target.play()
            this.doMethodArray(this.afterPlay)
            this.doMethodArray(this.afterRestart)
            this.isPlaying = true 
            this.isPaused = false
        }else if(this.isPlaying){
            this.doMethodArray(this.beforePause)
            target.pause()
            this.isPaused = true;
            this.doMethodArray(this.afterPause)
            this.isPlaying = false
        }
    }

    private toggleElement(element:HTMLElement){
        element.style.display = element.style.display == 'none' 
            ? 'block' 
            : 'none';
    }

    private setLowerBar(barObject:Bar) : HTMLElement{
        var bar:HTMLElement = barObject.createElement(this);

        var height = parseInt(bar.style.height.replace('px',''));
        var setHeight = this.setHeight;
        if(!height){
            height = parseInt(getComputedStyle( bar , '').height.replace('px', ''));
        }
        
        bar.style.top  = (this.height - height - setHeight) + "px";
        this.setHeight += (height);

        var target:HTMLVideoElement = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
        return bar;
    }

    private setUpperBar(barObject:Bar) : HTMLElement{
        var bar:HTMLElement = barObject.createElement(this);
        bar.style.top  = "0px";

        var target:HTMLVideoElement = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
        return bar;
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
