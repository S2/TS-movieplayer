
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

interface HTMLDocument{
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
}

class TSPlayer{
    title               :TitleBar;
    control             :ControlBar;
    seekbar             :SeekBar;
    controls            :BarParts;
    width               :number;
    height              :number;
    setHeight           :number = 0;
    media              :HTMLVideoElement;
    mediaParent        :HTMLDivElement;
    isPlaying           :bool = false;
    isPaused            :bool = false;
    isFullscreen        :bool = false;
    
    isIOSMobile : bool = false;
    isIOS         : bool = false;
    isIPad        : bool = false;
    isIPod        : bool = false;
    isIPhone      : bool = false;
    isAndroid     : bool = false;

    isWebkit    : bool = false;
    isChorome   : bool = false;
    isFirefox   : bool = false;

    isPC         : bool = false;
    canTouch     : bool = false;
    version      : number;
    majorVersion : number;
    duration     : number;
    volume       : number = 0.5;
    enableSound  : Boolean = true;
    createOption : CreateOption;
    console      = new Debug.Console();
    
    constructor(media:HTMLVideoElement ,  
            createOption:CreateOption      = new CreateOption(), 
            controlOption:ControlBarOption = new ControlBarOption() ,
            titleBarOption:TitleBarOption  = new TitleBarOption() ,
            seekBarOption:SeekBarOption    = new SeekBarOption()){
        this.media = media;
        this.createOption = createOption;
        this.setEnvironment();
        this.getSize();

        this.createParentDiv();

        this.setInitialVolume(this.volume)

        this.title = new TitleBar(titleBarOption , this.width);
        this.control = new ControlBar(controlOption , this.width);
        this.seekbar = new SeekBar(seekBarOption , this.width);
        
        /* add bars */ 
        var controlBar = null
        var titleBar   = null
        var seekBar    = null
        if(createOption.viewControllBar){
            controlBar = this.setLowerBar(this.control);
        }
        if(createOption.viewTitleBar){
            titleBar = this.setUpperBar(this.title);
        }
        if(createOption.viewSeekBar){
            seekBar = this.setLowerBar(this.seekbar);
            if(this.title){
                this.seekbar.setMoveDownHeight(this.control.getHeight());
            }
        }
        /* add bars end */ 

        /* add buttons */ 
        var centerBarPartsSetting = new BarPartsSetting(this.createOption.imagePath + this.createOption.centerButton  , 240 , 240 , 30 , 30 , 80 , 80 , new Margin(0 , 0 , 0 , 0));

        if(!this.isIOSMobile){
            new BarPartsCenterPlayButton(this , this.control , centerBarPartsSetting);
        }
        var controlImage = this.createOption.imagePath + this.createOption.controlButtons

        var playBarPartsSetting = new BarPartsSetting(controlImage  , 16 , 16 , 0 , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        var pauseBarPartsSetting = new BarPartsSetting(controlImage , 16 , 16 , 0 , -16  , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        new BarPartsPlayPauseButton(this , this.control , playBarPartsSetting , pauseBarPartsSetting );

        var volumeOnBarPartsSetting  = new BarPartsSetting(controlImage , 16 , 16 , -16 , -16  , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        var volumeOffBarPartsSetting = new BarPartsSetting(controlImage , 16 , 16 , -16 , 0    , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        new BarPartsVolumeButton(this , this.control , volumeOnBarPartsSetting , volumeOffBarPartsSetting);

        var timeParts = new BarPartsTimes(this , this.control , this.createOption.separateString);
        timeParts.setDuration(this.getDuration());
        
        if(this.isAndroid){
            // if Android , we can get duration after play start
            this.hookTimeupdate(()=>{
                timeParts.setDuration(this.getDuration());
            });
        }else{
            this.hookLoadedmetadata(()=>{
                timeParts.setDuration(this.getDuration());
            });
        }
        
        var fullscreenBarPartsSetting = new BarPartsSetting(controlImage , 16 , 16 , -32  , 0 , 100 , 100 , new Margin(7 , 5 , 7 , 5));
        new BarPartsFullscreenButton(this , this.control , fullscreenBarPartsSetting);

        new BarPartsTitleString(this , this.title , createOption.titleString);

        if(this.createOption.playWithFullscreen){
            this.hookFullscreenExit(() => {this.pause()});
        }

        var centerLoadingImageSetting = new BarPartsSetting(this.createOption.imagePath + this.createOption.loadingImage , 100 , 100 , 0 , 0 , 100 , 100 , new Margin(0 , 0 , 0 , 0));

        if(this.isAndroid){
            var loading = new BarPartsLoadingImage(this , this.control , centerLoadingImageSetting);
            this.hookBeforePlay(()=>{
                loading.visible();
            });
            this.hookTimeupdate(()=>{
                loading.invisible();
            });
        }

        /* add buttons end */ 

        if(CookieManager.get("muted") == "true"){
            this.setVolumeOff();
        }

        /* add events */ 
        media.addEventListener('click' , () => {
            this.togglePauseRestart();
        },false);
        media.addEventListener('touch' , () => {
            this.togglePauseRestart();
        },false);
        
        media.addEventListener('timeupdate' , () => {
            this.doMethodArray(this.timeUpdate)
        },false);
        media.addEventListener('loadedmetadata' , () => {
            this.doMethodArray(this.loadedmetadata);
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
                this.title.feedIn(0 , createOption.feedInTime);
                this.control.feedIn(0 , createOption.feedInTime);
                if(!this.createOption.displayAlwaysSeekBar){
                    this.seekbar.feedIn(0 , createOption.feedInTime);
                }else{
                    if(!displayControll){
                        this.seekbar.moveUpBar();
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
                this.title.feedOut(0 , createOption.feedOutTime);
                this.control.feedOut(0 , createOption.feedOutTime);
                if(!this.createOption.displayAlwaysSeekBar){
                    this.seekbar.feedOut(0 , createOption.feedOutTime);
                }else{
                    if(displayControll){
                        this.control.setFeedOutHookOnce( () => {
                            this.seekbar.moveDownBar();
                        })
                    }
                }
                displayControll  = false;
            }
        },false);

        document.addEventListener("webkitfullscreenchange" , ()=> {
            if(this.isFullscreen == true){
                this.doMethodArray(this.fullscreenExit);
                this.isFullscreen = false
            }
            if(this.createOption.playWithFullscreen){
                this.togglePauseRestart();
            }
        });

        document.addEventListener("webkitendfullscreen" , ()=> {
            this.doMethodArray(this.fullscreenExit);
            this.isFullscreen = false
        });

        this.hookEnded((player:TSPlayer , video:HTMLVideoElement) => {
            this.title.feedIn(0 , createOption.feedInTime);
            this.control.feedIn(0 , createOption.feedInTime);
            if(!this.createOption.displayAlwaysSeekBar){
                this.seekbar.feedIn(0 , createOption.feedInTime);
            }else{
                if(!displayControll){
                    this.seekbar.moveUpBar();
                }
            }
            displayControll  = true;
        });
        media.load();
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
        if(this.title){
            this.title.toggle();
        }
        if(this.control){
            this.control.toggle();
        }
        if(this.seekbar){
            this.seekbar.toggle();
        }
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
        if(this.title){
            this.title.toggle();
        }
        if(this.control){
            this.control.toggle();
        }
        if(this.seekbar){
            this.seekbar.toggle();
        }
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

    private beforePlay : Array = [];
    public hookBeforePlay(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.beforePlay.push(hookMethod);
    }

    private afterPlay : Array = [];
    public hookAfterPlay(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.afterPlay.push(hookMethod);
    }

    private beforePause : Array = [];
    public hookBeforePause(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.beforePause.push(hookMethod);
    }

    private afterPause : Array = [];
    public hookAfterPause(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.afterPause.push(hookMethod);
    }

    private beforeRestart : Array = [];
    public hookBeforeRestart(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.beforeRestart.push(hookMethod);
    }

    private afterRestart : Array = [];
    public hookAfterRestart(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.afterRestart.push(hookMethod);
    }

    private timeUpdate: Array = [];
    public hookTimeupdate(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.timeUpdate.push(hookMethod);
    }

    private ended : Array = [];
    public hookEnded(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.ended.push(hookMethod);
    }
    
    private fullscreenEnter : Array = [];
    public hookFullscreenEnter(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.fullscreenEnter.push(hookMethod);
    }

    private fullscreenExit : Array = [];
    public hookFullscreenExit(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.fullscreenExit.push(hookMethod);
    }

    private volumeChange : Array = [];
    public hookVolumeChange(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.volumeChange.push(hookMethod);
    }

    private volumeOn : Array = [];
    public hookVolumeOn(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.volumeOn.push(hookMethod);
    }

    private volumeOff : Array = [];
    public hookVolumeOff(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.volumeOff.push(hookMethod);
    }

    private loadedmetadata : Array = [];
    public hookLoadedmetadata(hookMethod:(player:TSPlayer , video:HTMLVideoElement)=>void){
        this.loadedmetadata.push(hookMethod);
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
    private doMethodArray(methods:Array){
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
        var media:HTMLVideoElement = this.media;
        if(this.isPaused){
            this.doMethodArray(this.beforeRestart)
        }
        this.doMethodArray(this.beforePlay)
        if(this.createOption.playWithFullscreen){
            this.enterFullscreen();
        }
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
        media.pause()
        this.isPaused = true;
        this.doMethodArray(this.afterPause)
        this.isPlaying = false
    }

    public togglePauseRestart(){
        var media:HTMLVideoElement = this.media;
        if(!this.isPlaying && this.isPaused){
            this.doMethodArray(this.beforePlay)
            this.doMethodArray(this.beforeRestart)
            if(this.createOption.playWithFullscreen){
                this.exitFullscreen();
                this.enterFullscreen();
            }
            this.console.d("680")
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
        }else if(this.isPlaying){
            this.doMethodArray(this.beforePause)
            if(this.createOption.playWithFullscreen){
                this.exitFullscreen();
            }
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
        if(this.mediaParent){
            return this.mediaParent
        }else{
            throw "not yet set parent . ios will not set parent"
        }
    }
}
