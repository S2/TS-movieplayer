/// <reference path="AddEvent.ts" />
/// <reference path="BarParts/PlayPauseButton.ts" />
/// <reference path="BarParts/FullscreenButton.ts" />
/// <reference path="BarParts/VolumeButton.ts" />
/// <reference path="BarParts/Times.ts" />
/// <reference path="BarParts/CenterPlayButton.ts" />
/// <reference path="BarParts/TitleString.ts" />
/// <reference path="BarParts/LoadingImage.ts" />
/// <reference path="Bar.ts" />
/// <reference path="TitleBar.ts" />
/// <reference path="TitleBarOption.ts" />
/// <reference path="SeekBar.ts" />
/// <reference path="SeekBarOption.ts" />
/// <reference path="ControlBar.ts" />
/// <reference path="ControlBarOption.ts" />
/// <reference path="CookieManager.ts" />
/// <reference path="DebugConsole.ts" />

// Add the missing definitions: 
interface HTMLElement{
    requestFullscreen();
    webkitRequestFullScreen();
    mozRequestFullScreen();
    attachEvent
    detachEvent
    currentStyle
}

interface HTMLVideoElement{
    webkitEnterFullScreen()
    webkitExitFullScreen()
    exitFullscreen()
    webkitCancelFullScreen()
    webkitExitFullscreen()
    mozCancelFullScreen()
}

interface Document{
    exitFullscreen()
    mozCancelFullScreen()
    webkitCancelFullScreen()
}

class CreateOption{
    width                : number;
    height               : number;
    movieSrcURL          : number;
    imagePath            : string = '../image/';
    controlButtons       : string = "controls.svg"
    centerButton         : string = "largeButton.svg"
    loadingImage         : string = "loading.gif"

    viewControlBar       : Boolean = true
    viewTitleBar         : Boolean = true
    viewSeekBar          : Boolean = true
    displayAlwaysSeekBar : Boolean = true

    separateString     : string = " / "
    displayVolumeFlg   : boolean = true
    displayCurrentTime : boolean = true
    displayDuration    : boolean = true
    displayFullscreen  : boolean = true

    titleString                : string = ""
    fadeInTime                 : number = 100
    fadeOutTime                : number = 100
    playWithFullscreen         : boolean = false
    automaticCloseFullscreen   : boolean = true

    timeFontSize         : number = 10 
    timeMarginTop        : number = 6
}

class BarPair{
    barObject : Bar
    bar : HTMLElement
    constructor(barObject : Bar , bar : HTMLElement){
        this.barObject = barObject
        this.bar = bar
    }
    
    /**
        <br>
        
        @method remove
        @param {} 
        @return void
    */
    public remove():void{
        this.barObject.remove();
    }
}

class TSPlayer extends AddEvent{
    width           : number;
    height          : number;
    setHeight       : number = 0;
    media           : HTMLVideoElement;
    mediaParent     : HTMLDivElement;
    isPlaying       : boolean = false;
    isPaused        : boolean = false;
    isFullscreen    : boolean = false;
    
    isIOSMobile         : boolean = false;
    isIOS               : boolean = false;
    isIPad              : boolean = false;
    isIPod              : boolean = false;
    isIPhone            : boolean = false;
    isAndroid           : boolean = false;
    isAndroid2          : boolean = false;
    isAndroid40         : boolean = false;
    isAndroid44         : boolean = false;
    isCellularPhone     : boolean = false;
    isOldAndroidChrome  : boolean = false;

    isWebkit     : boolean = false;
    isChrome     : boolean = false;
    isFirefox    : boolean = false;
    isPC         : boolean = false;

    canTouch     : boolean = false;
    version      : number;
    majorVersion : number;
    duration     : number;
    volume       : number = 0.5;
    enableSound  : Boolean = true;
    createOption : CreateOption;
    isEnded      = false

    controlBarPair : BarPair
    seekBarPair : BarPair
    titleBarPair : BarPair

    barPartsCenterButton : BarPartsCenterPlayButton

    isInPauseEvent = false
    isInPlayEvent  = false
    isInEndedEvent = false
    
    centerBarPartsSetting     = new BarPartsSetting(new Size(100 , 100) , new BannerPosition(0 , 0)     , new Scale(100 , 100) , new Margin(0 , 0 , 0 , 0));
    playBarPartsSetting       = new BarPartsSetting(new Size(16 , 16)   , new BannerPosition(0 , 0)     , new Scale(100 , 100) , new Margin(7 , 5 , 7 , 5));
    pauseBarPartsSetting      = new BarPartsSetting(new Size(16 , 16)   , new BannerPosition(0 , -16)   , new Scale(100 , 100) , new Margin(7 , 5 , 7 , 5));
    volumeOnBarPartsSetting   = new BarPartsSetting(new Size(16 , 16)   , new BannerPosition(-16 , -16) , new Scale(100 , 100) , new Margin(7 , 5 , 7 , 5));
    volumeOffBarPartsSetting  = new BarPartsSetting(new Size(16 , 16)   , new BannerPosition(-16 , 0)   , new Scale(100 , 100) , new Margin(7 , 5 , 7 , 5));
    fullscreenBarPartsSetting = new BarPartsSetting(new Size(16 , 16)   , new BannerPosition(-32  , 0)  , new Scale(100 , 100) , new Margin(7 , 5 , 7 , 5));
    centerLoadingImageSetting = new BarPartsSetting(new Size(100 , 100) , new BannerPosition(0 , 0)     , new Scale(100 , 100) , new Margin(0 , 0 , 0 , 0));

    loading  : BarPartsLoadingImage;

    constructor(media:HTMLVideoElement ,  
            createOption:CreateOption      = new CreateOption(), 
            controlOption:ControlBarOption = new ControlBarOption() ,
            titleBarOption:TitleBarOption  = new TitleBarOption() ,
            seekBarOption:SeekBarOption    = new SeekBarOption() , callback? : (player : TSPlayer) => void ){
        super();
        this.media = media;
        this.createOption = createOption;
        this.setEnvironment();
        this.getSize();

        this.createParentDiv();

        this.setInitialVolume(this.volume)
        
        var controlBarPair = this.createControlBar(createOption , controlOption)
        var titleBarPair   = this.createTitleBar(createOption , titleBarOption)
        var seekBarPair = null;
        if(titleBarPair){
            seekBarPair    = this.createSeekBar(createOption , seekBarOption , titleBarPair.barObject)
        }
        
        this.controlBarPair = controlBarPair
        this.titleBarPair   = titleBarPair
        this.seekBarPair    = seekBarPair

        this.setBarEvents(controlBarPair , titleBarPair , seekBarPair)
        this.setNoTSPlayerEvents();
        this.setTSPlayerEvents(createOption);

        if(this.createOption.automaticCloseFullscreen){
            this.hookEnded((player:TSPlayer , video:HTMLVideoElement) => {
                if(!this.isOldAndroidChrome){
                    this.exitFullscreen()
                }
            } , "exit full screen if ended:147")
        }
        if(callback){
            callback(this);
        }
    }

    /**
        <br>
        
        @method removeButtons 
        @param {} 
        @return void
    */
    public removeButtons():void{
        this.controlBarPair.remove();
        this.titleBarPair  .remove();
        this.seekBarPair   .remove();
        this.barPartsCenterButton.remove();
    }

    private setBarEvents(controlBarPair : BarPair , titleBarPair  : BarPair , seekBarPair : BarPair){
        var createOption = this.createOption
        var media = this.media

        var displayControl = true;
        var barFadeIn = () => {
            if(this.isPlaying){
                if(titleBarPair){
                    titleBarPair.barObject.fadeIn(0 , createOption.fadeInTime);
                }
                if(controlBarPair){
                    controlBarPair.barObject.fadeIn(0 , createOption.fadeInTime);
                }
                if(seekBarPair){
                    if(!this.createOption.displayAlwaysSeekBar){
                        seekBarPair.barObject.fadeIn(0 , createOption.fadeInTime);
                    }else{
                        if(!displayControl){
                            (<SeekBar>seekBarPair.barObject).moveUpBar();
                        }
                    }
                }
                displayControl  = true;
            }
        }

        media.addEventListener('mouseover' , barFadeIn ,false);
        if(controlBarPair){
            controlBarPair.bar.addEventListener('mouseover' , barFadeIn ,false);
        }
        if(titleBarPair){
            titleBarPair.bar.addEventListener('mouseover' , barFadeIn ,false);
        }
        if(seekBarPair){
            seekBarPair.bar.addEventListener('mouseover' , barFadeIn ,false);
        }
        
        if(this.isIOSMobile){
            this.addDocumentEvent("webkitfullscreenchange" , barFadeIn)
        }

        var barFadeOut = () => {
            if(this.isPlaying){
                if(titleBarPair){
                    titleBarPair.barObject.fadeOut(0 , createOption.fadeOutTime);
                }
                if(controlBarPair){
                    controlBarPair.barObject.fadeOut(0 , createOption.fadeOutTime);
                }
                if(seekBarPair){
                    if(!this.createOption.displayAlwaysSeekBar){
                        seekBarPair.barObject.fadeOut(0 , createOption.fadeOutTime);
                    }else{
                        if(displayControl){
                            controlBarPair.barObject.setFadeOutHookOnce( () => {
                                (<SeekBar>seekBarPair.barObject).moveDownBar();
                            })
                        }
                    }
                }
                displayControl  = false;
            }
        }
        media.addEventListener('mouseout' , barFadeOut)
        
        if(this.isAndroid){
            this.hookAfterPlay(barFadeOut , "set fade out :221 ")
        }

        if(controlBarPair){
            controlBarPair.bar.addEventListener('mouseout' , barFadeOut ,false);
        }
        if(titleBarPair){
            titleBarPair.bar.addEventListener('mouseout' , barFadeOut ,false);
        }
        if(seekBarPair){
            seekBarPair.bar.addEventListener('mouseout' , barFadeOut,false);
        }

        this.hookEnded((player:TSPlayer , video:HTMLVideoElement) => {
            if(titleBarPair){
                titleBarPair.barObject.fadeIn(0 , createOption.fadeInTime);
            }
            if(controlBarPair){
                controlBarPair.barObject.fadeIn(0 , createOption.fadeInTime);
            }
            if(seekBarPair){
                if(!this.createOption.displayAlwaysSeekBar){
                    seekBarPair.barObject.fadeIn(0 , createOption.fadeInTime);
                }else{
                    if(!displayControl){
                        (<SeekBar>seekBarPair.barObject).moveUpBar();
                    }
                }
            }
            displayControl  = true;
        });
    }

    private setTSPlayerEvents(createOption:CreateOption){
        var media = this.media
        if(this.createOption.playWithFullscreen){
            this.hookFullscreenExit(() => {this.pause() , "exit fullscreen on pause if play with fullscreen"});
        }

        if(CookieManager.get("muted") == "true"){
            this.setVolumeOff();
        }

        /* add events */ 
        this.addEvent(media ,'click' , () => {
            this.togglePauseRestart();
        },false);

        this.addEvent(media , 'touch' , () => {
            this.togglePauseRestart();
        },false);
        
        this.addEvent(media ,'timeupdate' , () => {
            this.doMethodArray(this.timeUpdate)
        },false);

        this.addEvent(media , 'loadedmetadata' , () => {
            this.doMethodArray(this.loadedmetadata);
        },false);

        this.addEvent(media , 'ended' , () => {
            this.doMethodArray(this.ended)
            this.isPlaying = false
            this.isPaused = false
            this.isEnded = true
        },false);
        
        this.addEvent(media , 'volumechange' , () => {
            this.doMethodArray(this.volumeChange)
        },false);
 
        this.addDocumentEvent("webkitfullscreenchange" , ()=> {

            if(this.isFullscreen == true){
                this.doMethodArray(this.fullscreenExit);
                if (this.createOption.playWithFullscreen) {
                    this.pause();
                }
                setTimeout(() => {
                    this.isFullscreen = false;
                }, 1000);
            } else {
                if (this.createOption.playWithFullscreen) {
                    this.play();
                }
                setTimeout(() => {
                    this.isFullscreen = true;
                }, 1000);
            }
        });

        this.addEvent(media , "webkitendfullscreen" , ()=> {
            this.pause()
            this.doMethodArray(this.fullscreenExit);
        });
    }
    
    private createControlBar(createOption : CreateOption , controlOption : ControlBarOption) : BarPair{
        if(!createOption.viewControlBar){
            return null
        }
        var controlBarObject = new ControlBar(controlOption , this.width);
        var controlBar = this.setLowerBar(controlBarObject);
        var controlImage = this.createOption.imagePath + this.createOption.controlButtons

        this.centerBarPartsSetting.setSrc(this.createOption.imagePath + this.createOption.centerButton);
        this.playBarPartsSetting.setSrc(controlImage);
        this.pauseBarPartsSetting.setSrc(controlImage);
        this.volumeOnBarPartsSetting.setSrc(controlImage);
        this.volumeOffBarPartsSetting.setSrc(controlImage);
        this.fullscreenBarPartsSetting.setSrc(controlImage);
        this.centerLoadingImageSetting.setSrc(this.createOption.imagePath + this.createOption.loadingImage);

        this.barPartsCenterButton = new BarPartsCenterPlayButton(this , controlBarObject , this.centerBarPartsSetting);

        new BarPartsPlayPauseButton(this , controlBarObject , this.playBarPartsSetting , this.pauseBarPartsSetting );
        
        if(!this.isCellularPhone){
            new BarPartsVolumeButton(this , controlBarObject , this.volumeOnBarPartsSetting , this.volumeOffBarPartsSetting);
        }

        var timeParts = new BarPartsTimes(this , controlBarObject , 
                this.createOption.separateString , this.createOption.timeFontSize , this.createOption.timeMarginTop);

        if(this.createOption.displayCurrentTime){
            timeParts.setCurrentTime()
        }

        if(this.createOption.displayDuration){
            timeParts.setDuration(this.getDuration())
        
            if(this.isAndroid){
                // if Android , we can get duration after play start
                this.hookTimeupdate(()=>{
                    timeParts.setDuration(this.getDuration());
                } , "get duration for android");
            }else{
                this.hookLoadedmetadata(()=>{
                    timeParts.setDuration(this.getDuration());
                } , "get duration");
            }
        }

        if(this.createOption.displayFullscreen){
            new BarPartsFullscreenButton(this , controlBarObject , this.fullscreenBarPartsSetting);
        }

        if(this.isAndroid){
            var loading = new BarPartsLoadingImage(this , controlBarObject , this.centerLoadingImageSetting);
            this.loading = loading;
            this.hookBeforePlay(()=>{
                loading.visible();
            } , "display android loading image");
            this.hookTimeupdate(()=>{
                if(this.getCurrentTime() > 0){
                    loading.invisible();
                }
            } , "hide android loading image");
            this.hookBeforePause(()=>{
                loading.invisible();
            } , "hide android loading image");
        }
        return new BarPair(controlBarObject , controlBar)
    }

    private createSeekBar(createOption : CreateOption , seekBarOption : SeekBarOption , controlBarObject = null) : BarPair{
        if(!createOption.viewSeekBar){
            return null
        }
        var seekBarObject = new SeekBar(seekBarOption , this.width);
        var seekBar = this.setLowerBar(seekBarObject);

        if(controlBarObject){
            seekBarObject.setMoveDownHeight(controlBarObject.getHeight());
        }

        return new BarPair(seekBarObject , seekBar)
    }
    
    private createTitleBar(createOption : CreateOption , titleBarOption : TitleBarOption) : BarPair{
        if(!createOption.viewTitleBar){
            return null
        }
        var titleBarObject = new TitleBar(titleBarOption , this.width);
        var titleBar = this.setUpperBar(titleBarObject);

        new BarPartsTitleString(this , titleBarObject , createOption.titleString);
        return new BarPair(titleBarObject , titleBar)
    }

    /**
        TSPlayer以外のplay/pauseイベントにフックを書く<br>
        @method setNoTSPlayerEvents
        @return void
    */
    private setNoTSPlayerEvents(){
        var media = this.media;
        this.addEvent(media , 'play' , () => {
            if(!this.isInPlayEvent){
                this.doMethodArrayOnce(this.beforePlayOnce)
                this.doMethodArray(this.beforePlay)
                this.doMethodArray(this.afterPlay)
            }
        })
        this.addEvent(media , 'pause' , () => {
            if(!this.isInPauseEvent){
                this.doMethodArray(this.beforePause)
                this.doMethodArray(this.afterPause)
            }
        })
    }

    public setCurrentTime(moveToSec:number){
        var media = this.media;
        media.currentTime = moveToSec;
    }

    public getCurrentTime() : number{
        var media = this.media;
        return media.currentTime;
    }

    public getDuration():number{
        var duration : number = this.media.duration
        if(isNaN(duration)){
            duration = 0
        }
        return duration
    }

    private setEnvironment(){
        var userAgent = navigator.userAgent;
        var matches;
        if(matches = /Android (\d+\.\d+)\.\d+/.exec(userAgent)){
            this.isAndroid = true;
            this.version = matches[1];
        }

        if(matches = /Android (2\.\d+)\.\d+/.exec(userAgent)){
            this.isAndroid2 = true;
            this.version = matches[1];
        }

        if(matches = /Android (4\.0)\.\d+/.exec(userAgent)){
            this.isAndroid40 = true;
            this.version = matches[1];
        }

        if(matches = /Android (4\.4)\.\d+/.exec(userAgent)){
            this.isAndroid44 = true;
            this.version = matches[1];
        }

        if(matches = /Android.*?Chrome\/(\d+)/.exec(userAgent)){
            this.isChrome = true
            var version = matches[1]
            if(parseInt(version) <= 34){
                this.isOldAndroidChrome = true
            }
        }

        if(userAgent.match('iPad')){
            this.isIOSMobile  = false;
            this.isIOS  = true ;
            this.isIPad = true;
        }
        if(userAgent.match('iPod')){
            this.isIOSMobile  = true ;
            this.isIOS  = true ;
            this.isIPod = true;
        }
        if(userAgent.match('iPhone')){
            this.isIOSMobile  = true ;
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

        this.isCellularPhone = this.isIOSMobile || this.isAndroid

    }

    private getSize(){
        var media:HTMLVideoElement = this.media;
        this.width = parseInt(media.style.width.replace('px',''));
        if(!this.width){
            this.width = parseInt(this.getComputedStyle( media ).width.replace('px', ''));
        }
        
        this.height = parseInt(media.style.height.replace('px',''));
        if(!this.height){
            this.height = parseInt(this.getComputedStyle( media ).height.replace('px', ''));
        }
    }

    private getComputedStyle(element : HTMLElement) {
        return getComputedStyle( element , '');
    }
    
    private createParentDiv(){
        if(this.isIOSMobile){
            return;
        }
        var media:HTMLVideoElement = this.media;

        media.style.position = 'relative';
        
        var parentNode = media.parentNode;
        var mediaParent:HTMLDivElement = document.createElement('div');
        mediaParent.style.position = "relative";
        mediaParent.appendChild(media);
        parentNode.appendChild(mediaParent);
        var style = getComputedStyle((<HTMLElement>parentNode), '');
        var parentWidth = parseInt(style.width);
        var thisWidth = this.width;
        var marginLeft = (parentWidth - thisWidth) / 2
        mediaParent.style.left = marginLeft + "px";
        this.mediaParent = mediaParent;

        media.style.top = "0";
        this.media = media;
    }
    
    private setFullscreenCenterElementPosition(element:HTMLElement , ratio:number){
        var mediaParent:HTMLElement = this.mediaParent;
        if(mediaParent == null){
            return;
        }
        var width = parseInt(mediaParent.style.width.replace('px',''));
        if(!width){
            width = parseInt(this.getComputedStyle( mediaParent ).width.replace('px', ''));
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

    public toggleFullscreen(){
        if(!this.isFullscreen){
            this.enterFullscreen()
            setTimeout(()=>{
                this.isFullscreen = false;
            } , 1000)
        }else{
            this.exitFullscreen()
            setTimeout(()=>{
                this.isFullscreen = true;
            } , 1000)
        }
    }
    
    /**
        <br>
        
        @method enterFullscreen 
        @param {} 
        @return void
    */
    public enterFullscreen():void{
        if(this.isAndroid2){
            return
        }
        var mediaParent:HTMLDivElement = this.mediaParent
        var media:HTMLVideoElement = this.media
        if (media.requestFullscreen) {
            media.requestFullscreen();
        } else if (media.mozRequestFullScreen) {
            media.mozRequestFullScreen();
        } else if (media.webkitEnterFullScreen) {
            if(this.isFullscreen && this.isAndroid40){
                media.webkitExitFullScreen();
            }
            media.webkitEnterFullScreen();
        } else if (media.webkitRequestFullScreen) {
            media.webkitRequestFullScreen();
        }
        setTimeout(()=> { 
            if (window.screenTop || window.screenY){
                this.isFullscreen = false
            } else {
                this.isFullscreen = true
            }
        } , 1000)
        this.doMethodArray(this.fullscreenEnter);
    }

    /**
        <br>
        
        @method exitFullscreen 
        @param {} 
        @return void
    */
    public exitFullscreen():void{
        // Xperia Z3 , we can not exit fullscreen
        if(!this.isOldAndroidChrome){
            var media:HTMLVideoElement = this.media
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (media.webkitExitFullScreen) {
                media.webkitExitFullScreen()
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen()
            }

            setTimeout(() => {
                this.isFullscreen = false;
            } , 1000)
        }
    }

    hookComments = [];
    /**
        <br>
        
        @method getHookComments 
        @param hookName {string}
        @return Array
    */
    public getHookComments(hookName : string):Array<string>{
        var returnArray = [];
        for( var i = 0 , arrayLength = this.hookComments.length ; i < arrayLength ; i++){
            var row = this.hookComments[i]
            if(row.name == hookName){
                returnArray.push(row)
            }
        }
        return returnArray
    }

    private beforePlay : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookBeforePlay(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.beforePlay.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "beforePlay" ,
        });
    }

    private beforePlayOnce : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookBeforePlayOnce(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.beforePlayOnce.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "beforePlayOnce" ,
        });
    }


    private afterPlay : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookAfterPlay(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.afterPlay.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "afterPlay" ,
        });
    }

    private beforePause : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookBeforePause(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.beforePause.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "beforePause" ,
        });
    }

    private afterPause : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookAfterPause(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.afterPause.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "afterPause" ,
        });
    }

    private beforeRestart : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookBeforeRestart(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.beforeRestart.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "beforeRestart" ,
        });
    }

    private afterRestart : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookAfterRestart(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.afterRestart.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "afterRestart" ,
        });
    }

    private timeUpdate: Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookTimeupdate(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.timeUpdate.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "timeUpdate" ,
        });
    }

    public ended : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookEnded(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.ended.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "ended" ,
        });
    }
    
    private fullscreenEnter : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookFullscreenEnter(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.fullscreenEnter.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "fullscreenEnter" ,
        });
    }

    private fullscreenExit : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookFullscreenExit(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.fullscreenExit.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "fullscreenExit" ,
        });
    }

    private volumeChange : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookVolumeChange(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.volumeChange.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "volumeChange" ,
        });
    }

    private volumeOn : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookVolumeOn(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.volumeOn.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "volumeOn" ,
        });
    }

    private volumeOff : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookVolumeOff(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.volumeOff.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "volumeOff" ,
        });
    }

    private loadedmetadata : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
    public hookLoadedmetadata(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void , comment? : string){
        this.loadedmetadata.push(hookMethod);
        this.hookComments.push({
            method : hookMethod ,
            comment : comment || "" , 
            name : "loadedmetadata" ,
        });
    }

    /**
        <br>
        
        @method setVolumeOn 
        @param {} 
        @return void
    */
    public setVolumeOn():void{
        this.volume = this.media.volume;
        this.media.muted = false;
        CookieManager.set("muted" , "false");
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
        this.media.muted = true ;
        CookieManager.set("muted" , "true");
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
        this.media.volume = newVolume ;
    }

    private doMethodArray(methods:Array<(player:TSPlayer , video:HTMLVideoElement)=>void>){
        for(var i = 0 ; i < methods.length ; i++){
            methods[i](this, this.media);
        }
    }
 
    private doMethodArrayOnce(methods:Array<(player:TSPlayer , video:HTMLVideoElement)=>void>){
        while (methods.length > 0) {
            var method = methods.shift();
            method(this, this.media);
        }
    }
 
    /**
        <br>
        
        @method getPoster 
        @param {} 
        @return string
    */
    public getPoster():string{
        return this.media.poster;
    }

    public togglePlayPause(){
        if(this.isPlaying){
            this.pause();
        }else{
            this.play();
        }
    }

    /**
        <br>
        
        @method play 
        @param {} 
        @return void
    */
    public play():void{
        // Android 4.1 some devices , XperiaZ , SH-02
        // They are not fired webkitendfullscreen 
        if(this.isFullscreen){
            if (window.screenTop || window.screenY) {
                this.isFullscreen = false 
                this.exitFullscreen()
                if(this.loading){
                    this.loading.visible();
                }
                setTimeout(()=>{
                    this.play()
                } , 300)
                return;
            }
        }

        this.media.poster = "";
        if(this.isEnded){
            this.setCurrentTime(0)
            this.isEnded = false
        }
        var media:HTMLVideoElement = this.media;
        if(this.isPaused){
            this.doMethodArray(this.beforeRestart)
        }
        this.doMethodArrayOnce(this.beforePlayOnce)
        this.doMethodArray(this.beforePlay)
        if(this.createOption.playWithFullscreen){
            this.enterFullscreen();
        }
        this.isInPlayEvent = true;
        media.play()
        if(this.createOption.playWithFullscreen){
            this.isPlaying =false 
            this.isPaused = true
        }else{
            this.isPlaying = true 
            this.isPaused = false
        }
        this.doMethodArray(this.afterPlay)
        if(this.isPaused){
            this.doMethodArray(this.afterRestart)
        }
        setTimeout(() => {
            this.isInPlayEvent = false;
        } , 100);
        
        // Android4.0 , some device ,cannot fire beginfullscreen
        if(this.isAndroid40){
            setTimeout(()=> {
                var intervalID = setInterval(() => {
                    if (this.isFullscreen) {
                        if (window.screenTop || window.screenY) {
                            this.isFullscreen = false;
                            this.exitFullscreen();
                            this.pause();
                            clearInterval(intervalID);
                        }
                    }else{
                        clearInterval(intervalID);
                    }
                } , 100);
            }, 3000);
        }
    }

    /**
        <br>
        
        @method pause 
        @param {} 
        @return void
    */
    public pause():void{
        var media:HTMLVideoElement = this.media;
        this.doMethodArray(this.beforePause)
        this.isInPauseEvent = true;
        media.pause()
        this.isPaused = true;
        this.doMethodArray(this.afterPause)
        this.isPlaying = false

        setTimeout(() => {
            this.isInPauseEvent = false;
        } , 100);
    }

    public togglePauseRestart(){
        var media:HTMLVideoElement = this.media;
        if(!this.isPlaying && this.isPaused){
            if(this.isEnded){
                this.setCurrentTime(0)
                this.isEnded = false
            }
            this.doMethodArray(this.beforePlay)
            this.doMethodArray(this.beforeRestart)
            if(this.createOption.playWithFullscreen && this.isFullscreen == false){
                this.enterFullscreen();
            }
            this.isInPlayEvent = true;
            media.play()
            this.doMethodArray(this.afterPlay)
            this.doMethodArray(this.afterRestart)
            if(this.createOption.playWithFullscreen){
                this.isPlaying = false 
                this.isPaused = true
            }else{
                this.isPlaying = true 
                this.isPaused = false
            }
            setTimeout(() => {
                this.isInPlayEvent = false;
            } , 100);
        }else if(this.isPlaying){
            this.doMethodArray(this.beforePause)
            if(this.createOption.playWithFullscreen && this.isFullscreen == true){
                this.exitFullscreen();
            }
            this.isInPauseEvent = true;
            media.pause()
            this.isPaused = true;
            this.doMethodArray(this.afterPause)
            this.isPlaying = false
            setTimeout(() => {
                this.isInPauseEvent = false;
            } , 100);
        }
    }

    private toggleElement(element:HTMLElement){
        element.style.display = element.style.display == 'none' 
            ? 'block' 
            : 'none';
    }

    private setLowerBar(barObject:Bar) : HTMLElement{
        var bar:HTMLElement = barObject.getElement();
        if(bar == null){
            bar = barObject.createElement(this);
        }

        var height = parseInt(bar.style.height.replace('px',''));
        var setHeight = this.setHeight;
        if(!height){
            height = parseInt(this.getComputedStyle( bar ).height.replace('px', ''));
        }
        
        bar.style.top  = (this.height - height - setHeight) + "px";
        this.setHeight += (height);

        var media:HTMLVideoElement = this.media;
        var parentNode = media.parentNode;
        parentNode.appendChild(bar);
        return bar;
    }

    private clearLowerBar(barObject:Bar) : void {
        var bar:HTMLElement = barObject.getElement();
        var media:HTMLVideoElement = this.media;
        var parentNode = media.parentNode;
        parentNode.removeChild(bar);
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
            height = parseInt(this.getComputedStyle( bar ).height.replace('px', ''));
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
        if(this.mediaParent){
            return this.mediaParent
        }else{
            throw "not yet set parent . ios will not set parent"
        }
    }

    /**
        <br>
        
        @method  resize
        @param {} 
        @return void
    */
    public resize(width : number , height : number):void{
        this.media.style.width = width + "px"
        this.media.style.height = height + "px"
        if(this.isIOSMobile){
            return;
        }
        this.mediaParent.style.width = width + "px"
        this.mediaParent.style.height = height + "px"

        if(this.titleBarPair){
            this.titleBarPair.barObject.resize(width , height )
        }

        this.setHeight = 0
        this.width = width 
        this.height = height 
        
        if(this.controlBarPair){
            this.controlBarPair.barObject.resize(width , height )
            this.clearLowerBar(this.controlBarPair.barObject);
            this.setLowerBar(this.controlBarPair.barObject);
        }

        if(this.seekBarPair){
            this.seekBarPair.barObject.resize(width , height )
            this.clearLowerBar(this.seekBarPair.barObject);
            this.setLowerBar(this.seekBarPair.barObject);
        }
        
        if(this.barPartsCenterButton){
            this.barPartsCenterButton.resize(width , height)
        }
    }
}
