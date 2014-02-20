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
    media              :HTMLVideoElement;
    mediaParent        :HTMLDivElement;
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
    volume      : number;
    enableSound : Boolean = true;
    createOption:CreateOption;

    constructor(media:HTMLVideoElement ,  
            createOption:CreateOption = new CreateOption(), 
            controlOption:ControlBarOption = new ControlBarOption() ,
            titleBarOption:TitleBarOption = new TitleBarOption() ,
            seekBarOption:SeekBarOption = new SeekBarOption()){
        this.media = media;
        this.createOption = createOption;
        this.getEnvironment();
        this.getSize();

        this.createParentDiv();

        this.title = new TitleBar(titleBarOption , this.width);
        this.control = new ControlBar(controlOption , this.width);
        this.seekbar = new SeekBar(seekBarOption , this.width);
        
        var controlBar = null
        var titleBar = null
        var seekBar = null
        if(createOption.viewControllBar){
            controlBar = this.setLowerBar(this.control);
        }
        if(createOption.viewTitleBar){
            titleBar = this.setUpperBar(this.title);
        }
        if(createOption.viewSeekBar){
            seekBar = this.setLowerBar(this.seekbar);
        }
        this.controls = new Controls(this , this.control);

        var centerBackgroundImageSetting = new BackgroundImageSetting('../image/largeButton.svg' , 240 , 240 , 30 , 30 , 80 , 80 , new Margin(0 , 0 , 0 , 0));
        this.controls.setCenterPlayButton(centerBackgroundImageSetting);

        var playBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg'  , 16 , 16 , 0 , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        var pauseBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg' , 16 , 16 , 0 , -16  , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        this.controls.setPlayButton(playBackgroundImageSetting , pauseBackgroundImageSetting );

        var volumeOnBackgroundImageSetting  = new BackgroundImageSetting('../image/controls.svg' , 16 , 16 , -16 , -16  , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        var volumeOffBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg' , 16 , 16 , -16 , 0    , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        this.controls.setVolumeButton(volumeOnBackgroundImageSetting , volumeOffBackgroundImageSetting);

        this.controls.setCurrentTime();
        this.controls.setSeparator(" / ");
        this.controls.setDuration(this.duration);

        var fullscreenBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg' , 16 , 16 , -32  , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        this.controls.setFullscreenButton(fullscreenBackgroundImageSetting);

        media.addEventListener('click' , () => {
            this.togglePauseRestart();
        },false);
        media.addEventListener('touch' , () => {
            this.togglePauseRestart();
        },false);
        
        media.addEventListener('timeupdate' , () => {
            this.doMethodArray(this.timeUpdate)
        },false);

        media.addEventListener('ended' , () => {
            this.doMethodArray(this.ended)
            this.isPlaying = false;
            this.isPaused = false
        },false);
        
        media.addEventListener('volumechange' , () => {
            this.doMethodArray(this.volumeChange)
        },false);
 
        var displayControll = true;
        var barFeedIn = () => {
            if(this.isPlaying){
                this.title.feedIn(0 , 50);
                this.control.feedIn(0 , 50);
                if(!this.createOption.displayAlwaysSeekBar){
                    this.seekbar.feedIn(0 , 50);
                }else{
                    if(!displayControll){
                        seekBar.style.top = parseInt(seekBar.style.top.replace("px" , "")) - this.control.getHeight() + "px";
                    }
                }
                displayControll  = true;
            }
        }

        media.addEventListener('mouseover' , barFeedIn ,false);
        if(controlBar){
            controlBar.addEventListener('mouseover' , barFeedIn ,false);
        }
        if(titleBar){
            titleBar.addEventListener('mouseover' , barFeedIn ,false);
        }
        if(seekBar){
            seekBar.addEventListener('mouseover' , barFeedIn ,false);
        }

        media.addEventListener('mouseout' , () => {
            if(this.isPlaying){
                this.title.feedOut(0 , 50);
                this.control.feedOut(0 , 50);
                if(!this.createOption.displayAlwaysSeekBar){
                    this.seekbar.feedOut(0 , 50);
                }else{
                    if(displayControll){
                        this.control.setFeedOutHookOnce( () => {
                            seekBar.style.top = parseInt(seekBar.style.top.replace("px" , "")) + this.control.getHeight() + "px";
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
                    seekBar.style.top = parseInt(seekBar.style.top.replace("px" , "")) - this.control.getHeight() + "px";
                }
            }
            displayControll  = true;
        });
        this.setInitialVolume(0);
    }
    
    public setCurrentTime(moveToSec:number){
        var media = this.media;
        media.currentTime = moveToSec;
        media.play();
    }

    public getCurrentTime() : number{
        var media = this.media;
        return media.currentTime ;
    }

    public getDuration():number{
        if(!this.duration){
            this.duration = this.media.duration;
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
        var media:HTMLVideoElement = this.media;
        this.width = parseInt(media.style.width.replace('px',''));
        if(!this.width){
            this.width = parseInt(getComputedStyle( media , '').width.replace('px', ''));
        }
        
        this.height = parseInt(media.style.height.replace('px',''));
        if(!this.height){
            this.height = parseInt(getComputedStyle( media , '').height.replace('px', ''));
        }
    }
    
    private createParentDiv(){
        var media:HTMLVideoElement = this.media;

        media.style.position = 'absolute';
        
        var parentNode = media.parentNode;
        var mediaParent:HTMLDivElement = document.createElement('div');
        mediaParent.appendChild(media);
        parentNode.appendChild(mediaParent);
        this.mediaParent = mediaParent;

        media.style.top = "0";
        this.media = media;

        this.duration = media.duration;
    }
    
    private setFullscreenCenterElementPosition(element:HTMLElement , ratio:number){
        var mediaParent:HTMLElement = this.mediaParent;
        var width = parseInt(mediaParent.style.width.replace('px',''));
        if(!width){
            width = parseInt(getComputedStyle( mediaParent , '').width.replace('px', ''));
        }
        
        var height = screen.height;

        element.style.width = width * ratio + "px";
        element.style.height = element.style.width;
        element.style.left = (width  - width * ratio) / 2 + "px";
        element.style.top  = (height - width * ratio) / 2 + "px";
    }

    private setInitialVolume(volume:number){
        var media:HTMLVideoElement = this.media;
        media.volume = volume ;
    }
    
    /**
        <br>
        
        @method getVolume 
        @param {} 
        @return number
    */
    public getVolume():number{
        var media:HTMLVideoElement = this.media;
        return media.volume ;
    }

    public toggleFullScreen(){
        var mediaParent:HTMLElement = this.mediaParent
        var media:HTMLVideoElement = this.media
        if(this.isFullScreen){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            media.style.width  = this.width + "px";
            media.style.height = this.height + "px";
            this.isFullScreen = false;
        }else{
            if (mediaParent.requestFullscreen) {
                mediaParent.requestFullscreen();
            } else if (mediaParent.mozRequestFullScreen) {
                mediaParent.mozRequestFullScreen();
            } else if (mediaParent.webkitRequestFullScreen) {
                mediaParent.webkitRequestFullScreen();
            }
            media.style.width  = '100%';
            media.style.height = '100%';
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

    private volumeChange : Array = [];
    public hookVolumeChange(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.volumeChange.push(hookMethod);
    }

    private volumeOn : Array = [];
    public hookVolumeOn(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.volumeOn.push(hookMethod);
    }

    private volumeOff : Array = [];
    public hookVolumeOff(hookMethod:(player:Player , video:HTMLVideoElement)=>void){
        this.volumeOff.push(hookMethod);
        this.doMethodArray(this.volumeOff)
    }

    /**
        <br>
        
        @method setVolumeOn 
        @param {} 
        @return void
    */
    public setVolumeOn():void{
        this.volume = this.media.volume;
        this.media.muted = true;
        this.enableSound = true;
        this.doMethodArray(this.volumeOn)
    }
    
    /**
        <br>
        
        @method setVolumeOff 
        @param {} 
        @return void
    */
    public setVolumeOff():void{
        this.media.muted = false;
        this.enableSound = false;
        this.doMethodArray(this.volumeOff)
    }

    /**
        <br>
        
        @method toggleVolume
        @param {} 
        @return void
    */
    public toggleVolume():void{
        this.enableSound ? 
            this.setVolumeOff() : 
            this.setVolumeOn() ;
    }
    
    /**
        <br>
        
        @method setVolume 
        @param {} 
        @return void
    */
    public setVolume(dVolume : number):void{
        var newVolume = this.media.volume + dVolume ;
        if(newVolume < 0){
            newVolume = 0;
        }
        if(newVolume > 1){
            newVolume = 1;
        }
        this.media.volume + newVolume ;
    }
    private doMethodArray(methods:Array){
        for(var i = 0 ; i < methods.length ; i++){
            methods[i](this, this.media);
        }
    }
    
    public togglePlayPause(){
        var media:HTMLVideoElement = this.media;
        if(this.isPlaying){
            this.doMethodArray(this.beforePause)
            media.pause()
            this.isPaused = true;
            this.doMethodArray(this.afterPause)
            this.isPlaying = false
        }else{
            if(this.isPaused){
                this.doMethodArray(this.beforeRestart)
            }
            this.doMethodArray(this.beforePlay)
            media.play()
            this.doMethodArray(this.afterPlay)
            if(this.isPaused){
                this.doMethodArray(this.afterRestart)
            }
            this.isPlaying = true 
            this.isPaused = false
        }
    }

    public togglePauseRestart(){
        var media:HTMLVideoElement = this.media;
        if(!this.isPlaying && this.isPaused){
            this.doMethodArray(this.beforePlay)
            this.doMethodArray(this.beforeRestart)
            media.play()
            this.doMethodArray(this.afterPlay)
            this.doMethodArray(this.afterRestart)
            this.isPlaying = true 
            this.isPaused = false
        }else if(this.isPlaying){
            this.doMethodArray(this.beforePause)
            media.pause()
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

        var media:HTMLVideoElement = this.media;
        var parentNode = media.parentNode;
        parentNode.appendChild(bar);
        return bar;
    }

    private setUpperBar(barObject:Bar) : HTMLElement{
        var bar:HTMLElement = barObject.createElement(this);
        bar.style.top  = "0px";

        var media:HTMLVideoElement = this.media;
        var parentNode = media.parentNode;
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

    /**
        <br>
        
        @method getMedia 
        @param {} 
        @return HTMLVideoElement
    */
    public getMedia():HTMLVideoElement{
        return this.media
    }

    /**
        <br>
        
        @method getMediaParent 
        @param {} 
        @return HTMLDivElement
    */
    public getMediaParent():HTMLDivElement{
        return this.mediaParent;
    }
}
