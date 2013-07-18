/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="ControlBarOption.ts" />
/// <reference path="Player.ts" />

class ControlBar extends Bar{
    options : ControlBarOption;
    width: number;
    appendMethods : {} = {};
    constructor(options:ControlBarOption, width:number){
        super();
        this.options = options;
        if(this.options == null){
            this.options = new ControlBarOption;
        }
        this.width = width;
        this.thisObject = this;
    }
    
    public createElement(player:Player):HTMLElement{
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";

        var options : ControlBarOption = this.options;
        
        var buttonFunctions = this.getCreateButtonMethods(player);
        for(var i = 0 ; i < options.displayLeftButtons.length ; i++){
            var functionName = options.displayLeftButtons[i];
            if(buttonFunctions[functionName]){
                var functionName = options.displayLeftButtons[i];
                var buttonElement = buttonFunctions[functionName]();
                buttonElement.className = buttonElement.className + " controllButtonLeft";
                newElement.appendChild(buttonElement);
            }else{
                var stringObject = document.createElement('div')
                stringObject.innerHTML = functionName
                stringObject.className = buttonElement.className + " controllButtonLeft";
                newElement.appendChild(stringObject);
            }
        }
        
        for(var i = 0 ; i < options.displayRightButtons.length ; i++){
            var functionName = options.displayRightButtons[i];
            var buttonElement = buttonFunctions[functionName]();
            buttonElement.className = buttonElement.className + " controllButtonRight";
            newElement.appendChild(buttonElement);
        }
        
        this.createdElement = newElement;
        var thisObject:ControlBar = <ControlBar>this.thisObject;

        player.hookAfterPlay(function(){thisObject.feedOut(1000 , 50)});
        player.hookAfterPause(function(){thisObject.feedIn(0 , 50)});

        return newElement;
    }
    
    public appendCreateButtonMethods(buttonName : string , buttonCreateFunction : ()=> HTMLElement) : void{
        this.appendMethods[buttonName] = buttonCreateFunction;
    }

    public getCreateButtonMethods(player:Player):{}{
        var thisObject:ControlBar = <ControlBar>this.thisObject;
        var createMethods = {
            'play'        : function() : HTMLElement{
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                thisObject.setEvent(element , "click" , player.togglePlayPause);
                return element;
            },
            'volume'      : function() : HTMLElement{
                var element = document.createElement("img");
                element.className = "volume";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'duration'    : function() : HTMLElement{
                var element = document.createElement("div");
                element.className = "duration";
                element.style.height = thisObject.options.height + "px";
                var duration = player.getDuration();
                duration = Math.floor(duration * 100) / 100;
                element.innerHTML = duration + '';
                return element;
            },
            'current'     : function() : HTMLElement{
                var element = document.createElement("div");
                element.className = "current";
                element.innerHTML = '00:00';
                player.hookTimeUpdate(function(player:Player , video:HTMLVideoElement){
                    var current:number = video.currentTime;
                    current = Math.floor(current * 100) / 100;
                    element.innerHTML = current + '';
                });
                return element;
            },
            'seekbar'     : function() : HTMLElement{
                var element = document.createElement("img");
                element.className = "seekbar";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'fullscreen'  : function() : HTMLElement{
                var element = document.createElement("img");
                element.className = "fullscreen";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                thisObject.setEvent(element , "click" , player.toggleFullScreen);
                return element;
            },
        }
        for(var key in this.appendMethods){
            createMethods[key] = this.appendMethods[key];
        }
        return createMethods;
    }
}
