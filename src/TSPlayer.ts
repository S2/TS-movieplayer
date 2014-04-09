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
    ontouchstart()
    onwebkitfullscreenchange
}

class CreateOption{
    width                : number;
    height               : number;
    movieSrcURL          : number;
    imagePath            : string = '../image/';
    controlButtons       : string = "controls.svg"
    centerButton         : string = "largeButton.svg"
    loadingImage         : string = "loading.gif"

    viewControllBar      : Boolean = true;
    viewTitleBar         : Boolean = true;
    viewSeekBar          : Boolean = true;
    displayAlwaysSeekBar : Boolean = true;

    titleString          : string = "";
    feedInTime           : number = 100;
    feedOutTime          : number = 100;
    separateString       : string = " / ";
    playWithFullscreen   : boolean = false;
    timeFontSize         : number = 10 
    timeMarginTop        : number = 6
}

class TSPlayer extends AddEvent{
    title           : TitleBar;
    control         : ControlBar;
    seekbar         : SeekBar;
    controls        : BarParts;
    width           : number;
    height          : number;
    setHeight       : number = 0;
    media           : HTMLVideoElement;
    mediaParent     : HTMLDivElement;
    isPlaying       : boolean = false;
    isPaused        : boolean = false;
    isFullscreen    : boolean = false;
    
    isIOSMobile     : boolean = false;
    isIOS           : boolean = false;
    isIPad          : boolean = false;
    isIPod          : boolean = false;
    isIPhone        : boolean = false;
    isAndroid       : boolean = false;
    isCellularPhone : boolean = false;

    isWebkit     : boolean = false;
    isChorome    : boolean = false;
    isFirefox    : boolean = false;

    isPC         : boolean = false;
    canTouch     : boolean = false;
    version      : number;
    majorVersion : number;
    duration     : number;
    volume       : number = 0.5;
    enableSound  : Boolean = true;
    createOption : CreateOption;
    console      = new Debug.Console();
    isEnded      = false

    isInPauseEvent = false
    isInPlayEvent  = false
    isInEndedEvent = false
    
    constructor(media:HTMLVideoElement ,  
            createOption:CreateOption      = new CreateOption(), 
            controlOption:ControlBarOption = new ControlBarOption() ,
            titleBarOption:TitleBarOption  = new TitleBarOption() ,
            seekBarOption:SeekBarOption    = new SeekBarOption()){
        super();
        this.media = media;
        this.createOption = createOption;
        this.setEnvironment();
        this.getSize();

        this.createParentDiv();

        this.setInitialVolume(this.volume)

        /* add buttons */ 
        if(this.createOption.playWithFullscreen){
            this.hookFullscreenExit(() => {this.pause() , "exit fullscreen on pause if play with fullscreen"});
        }

        /* add buttons end */ 
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
                this.isFullscreen = false
            }
            if(this.createOption.playWithFullscreen){
                this.togglePauseRestart();
            }
        });

        this.addDocumentEvent("webkitendfullscreen" , ()=> {
            this.doMethodArray(this.fullscreenExit);
            this.isFullscreen = false
        });

        this.setNoTSPlayerEvents();
        media.load();
    }

    private createControlBar(createOption : CreateOption , controlOption : ControlBarOption){
        var controlBarObject = new ControlBar(controlOption , this.width);
        var controlBar = this.setLowerBar(controlBarObject);

        var barFeedIn = () => {
            if(this.isPlaying){
                controlBarObject.feedIn(0 , createOption.feedInTime);
            }
        }
        var barFeedOut = () => {
            if(this.isPlaying){
                controlBarObject.feedOut(0 , createOption.feedOutTime);
            }
        };

        this.hookEnded((player:TSPlayer , video:HTMLVideoElement) => {
            controlBarObject.feedIn(0 , createOption.feedInTime);
        } , "display bar if ended");

        this.addEvent(this.media , 'mouseover' , barFeedIn ,false);
        this.addEvent(controlBar , 'mouseover' , barFeedIn ,false);
        this.addEvent(this.media , 'mouseout' , barFeedOut , false);

        if(this.isAndroid){
            // if Android , we can get duration after play start
            this.hookTimeupdate(barFeedOut , "hide bar if playing");
            this.hookAfterPause(barFeedIn  , "display bar on pause");
        }

        var centerBarPartsSetting = new BarPartsSetting(this.createOption.imagePath + this.createOption.centerButton  , 100 , 100 , 0 , 0 , 100 , 100 , new Margin(0 , 0 , 0 , 0));

        if(!this.isIOSMobile){
            new BarPartsCenterPlayButton(this , controlBarObject , centerBarPartsSetting);
        }
        var controlImage = this.createOption.imagePath + this.createOption.controlButtons

        var playBarPartsSetting = new BarPartsSetting(controlImage  , 16 , 16 , 0 , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        var pauseBarPartsSetting = new BarPartsSetting(controlImage , 16 , 16 , 0 , -16  , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        new BarPartsPlayPauseButton(this , controlBarObject , playBarPartsSetting , pauseBarPartsSetting );
        
        if(!this.isCellularPhone){
            var volumeOnBarPartsSetting  = new BarPartsSetting(controlImage , 16 , 16 , -16 , -16  , 100 , 100 , new Margin(7 , 5 , 7 , 5));
            var volumeOffBarPartsSetting = new BarPartsSetting(controlImage , 16 , 16 , -16 , 0    , 100 , 100 , new Margin(7 , 5 , 7 , 5));
            new BarPartsVolumeButton(this , controlBarObject , volumeOnBarPartsSetting , volumeOffBarPartsSetting);
        }

        var timeParts = new BarPartsTimes(this , controlBarObject , 
                this.createOption.separateString , this.createOption.timeFontSize , this.createOption.timeMarginTop);
        timeParts.setDuration(this.getDuration());
        
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
        
        var fullscreenBarPartsSetting = new BarPartsSetting(controlImage , 16 , 16 , -32  , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        new BarPartsFullscreenButton(this , controlBarObject , fullscreenBarPartsSetting);

        if(this.isAndroid){
            var centerLoadingImageSetting = new BarPartsSetting(this.createOption.imagePath + this.createOption.loadingImage , 100 , 100 , 0 , 0 , 100 , 100 , new Margin(0 , 0 , 0 , 0));

            var loading = new BarPartsLoadingImage(this , controlBarObject , centerLoadingImageSetting);
            this.hookBeforePlay(()=>{
                loading.visible();
            } , "display android loading image");
            this.hookTimeupdate(()=>{
                loading.invisible();
            } , "hide android loading image");
        }
    }

    private createsSeekBar(createOption : CreateOption , seekBarOption : SeekBarOption , controlBarObject = null){
        var seekBarObject = new SeekBar(seekBarOption , this.width);
        var seekBar    = null
        if(createOption.viewSeekBar){
            seekBar = this.setLowerBar(seekBarObject);

            if(controlBarObject){
                seekBarObject.setMoveDownHeight(controlBarObject.getHeight());
            }
        }

        var displayControl = true;
        var barFeedIn = () => {
            if(this.isPlaying){
                if(!this.createOption.displayAlwaysSeekBar){
                    seekBarObject.feedIn(0 , createOption.feedInTime);
                }else{
                    if(!displayControl){
                        seekBarObject.moveUpBar();
                    }
                }
                displayControl  = true;
            }
        }
        var barFeedOut = () => {
            if(this.isPlaying){
                if(!this.createOption.displayAlwaysSeekBar){
                    seekBarObject.feedOut(0 , createOption.feedOutTime);
                }else{
                    if(displayControl){
                        controlBarObject.setFeedOutHookOnce( () => {
                            seekBarObject.moveDownBar();
                        })
                    }
                }
                displayControl  = false;
            }
        };
        this.hookEnded((player:TSPlayer , video:HTMLVideoElement) => {
            if(!this.createOption.displayAlwaysSeekBar){
                seekBarObject.feedIn(0 , createOption.feedInTime);
            }else{
                if(!displayControl){
                    seekBarObject.moveUpBar();
                }
            }
            displayControl  = true;
        } , "display bar if ended");

        this.addEvent(this.media , 'mouseover' , barFeedIn ,false);
        this.addEvent(seekBar , 'mouseover' , barFeedIn ,false);
        this.addEvent(this.media , 'mouseout' , barFeedOut , false);

        if(this.isAndroid){
            // if Android , we can get duration after play start
            this.hookTimeupdate(barFeedOut , "hide bar if playing");
            this.hookAfterPause(barFeedIn  , "display bar on pause");
        }
    }
    


    private createTitleBar(createOption : CreateOption , titleBarOption : TitleBarOption){
        var titleBarObject = new TitleBar(titleBarOption , this.width);
        var titleBar = this.setUpperBar(titleBarObject);

        var barFeedIn = () => {
            if(this.isPlaying){
                titleBarObject.feedIn(0 , createOption.feedInTime);
            }
        }
        var barFeedOut = () => {
            if(this.isPlaying){
                titleBarObject.feedOut(0 , createOption.feedOutTime);
            }
        };
        this.hookEnded((player:TSPlayer , video:HTMLVideoElement) => {
            titleBarObject.feedIn(0 , createOption.feedInTime);
        } , "display bar if ended");

        this.addEvent(this.media , 'mouseover' , barFeedIn ,false);
        this.addEvent(titleBar , 'mouseover' , barFeedIn ,false);
        this.addEvent(this.media , 'mouseout' , barFeedOut , false);

        if(this.isAndroid){
            // if Android , we can get duration after play start
            this.hookTimeupdate(barFeedOut , "hide bar if playing");
            this.hookAfterPause(barFeedIn  , "display bar on pause");
        }

        new BarPartsTitleString(this , titleBarObject , createOption.titleString);
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
        if(window.getComputedStyle){
            return getComputedStyle( element , '');
        }else{
            return element.currentStyle
        }
    }
    
    private createParentDiv(){
        if(this.isIOSMobile){
            return;
        }
        var media:HTMLVideoElement = this.media;

        media.style.position = 'absolute';
        
        var parentNode = media.parentNode;
        var mediaParent:HTMLDivElement = document.createElement('div');
        mediaParent.appendChild(media);
        parentNode.appendChild(mediaParent);
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
            this.isFullscreen = false;
        }else{
            this.exitFullscreen()
            this.isFullscreen = true;
        }
    }
    
    /**
        <br>
        
        @method enterFullscreen 
        @param {} 
        @return void
    */
    public enterFullscreen():void{
        var mediaParent:HTMLDivElement = this.mediaParent
        var media:HTMLVideoElement = this.media
        if (media.requestFullscreen) {
            media.requestFullscreen();
        } else if (media.mozRequestFullScreen) {
            media.mozRequestFullScreen();
        } else if (media.webkitRequestFullScreen) {
            media.webkitRequestFullScreen();
        } else if (media.webkitEnterFullScreen) {
            media.webkitEnterFullScreen();
        }
        this.isFullscreen = true;
        this.doMethodArray(this.fullscreenEnter);
    }

    /**
        <br>
        
        @method exitFullscreen 
        @param {} 
        @return void
    */
    public exitFullscreen():void{
        var media:HTMLVideoElement = this.media
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
        } else if (media.webkitExitFullScreen) {
            media.webkitExitFullScreen()
        }
        this.isFullscreen = false;
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

    private ended : Array<(player:TSPlayer , video:HTMLVideoElement)=>void> = [];
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
        this.media.volume + newVolume ;
    }

    private doMethodArray(methods:Array<(player:TSPlayer , video:HTMLVideoElement)=>void>){
        for(var i = 0 ; i < methods.length ; i++){
            methods[i](this, this.media);
        }
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
        if(this.isEnded){
            this.setCurrentTime(0)
            this.isEnded = false
        }
        var media:HTMLVideoElement = this.media;
        if(this.isPaused){
            this.doMethodArray(this.beforeRestart)
        }
        this.doMethodArray(this.beforePlay)
        if(this.createOption.playWithFullscreen){
            this.enterFullscreen();
        }
        this.isInPlayEvent = true;
        media.play()
        this.doMethodArray(this.afterPlay)
        if(this.isPaused){
            this.doMethodArray(this.afterRestart)
        }
        if(this.createOption.playWithFullscreen){
            this.isPlaying =false 
            this.isPaused = true
        }else{
            this.isPlaying = true 
            this.isPaused = false
        }

        setTimeout(() => {
            this.isInPlayEvent = false;
        } , 100);
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
        if(this.createOption.playWithFullscreen){
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

    public togglePauseRestart(){
        var media:HTMLVideoElement = this.media;
        if(!this.isPlaying && this.isPaused){
            if(this.isEnded){
                this.setCurrentTime(0)
                this.isEnded = false
            }
            this.doMethodArray(this.beforePlay)
            this.doMethodArray(this.beforeRestart)
            if(this.createOption.playWithFullscreen){
                this.exitFullscreen();
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
            if(this.createOption.playWithFullscreen){
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
        var bar:HTMLElement = barObject.createElement(this);

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

}
