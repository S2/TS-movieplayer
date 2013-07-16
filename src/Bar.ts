/// <reference path="jquery.d.ts" />
/// <reference path="Player.ts" />

class Bar{
    public thisObject:Bar;
    public createdElement:HTMLElement;
    public maxAlpha:number = 0.5;
    private eventEnable:boolean = true;
    public createElement(player:Player):HTMLElement{
        return document.createElement("div");
    }
    
    private inFeedOut : boolean = false;
    public feedOut(waitSeconds:number , feedOutSeconds:number){
        var thisObject:Bar = this;
        if(this.createdElement){
            var element:HTMLElement = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var unitGradAlpha = currentAlpha / feedOutSeconds;
            var setGradAlpha = function(){
                currentAlpha -= unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if(!thisObject.inFeedOut){return;}
                if(currentAlpha > 0){
                    setTimeout(setGradAlpha , 1);
                }else{
                    element.style.opacity = "0";
                    thisObject.inFeedOut = false;
                }
            };
            this.inFeedOut = true;
            this.inFeedIn = false;
            setTimeout(function(){
                setGradAlpha()
            } , waitSeconds);
        }
    }

    private inFeedIn : boolean = false;
    public feedIn(waitSeconds:number , feedOutSeconds:number){
        var thisObject:Bar = this;
        if(this.createdElement){
            var element:HTMLElement = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var maxAlpha = this.maxAlpha;
            if(currentAlpha > maxAlpha ){
                return;
            }
            var unitGradAlpha = maxAlpha - currentAlpha / feedOutSeconds;
            var setGradAlpha = function(){
                currentAlpha += unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if(!thisObject.inFeedIn){return}
                if(currentAlpha < maxAlpha){
                    setTimeout(setGradAlpha , 1);
                }else{
                    element.style.opacity = maxAlpha + "";
                    thisObject.inFeedOut = true;
                    thisObject.eventEnable = false;
                }
            };
            this.inFeedOut = false;
            this.inFeedIn = true;
            this.eventEnable = true;
            setTimeout(function(){
                setGradAlpha()
            } , waitSeconds);
        }
    }
    
    public setEvent(element:HTMLElement , eventName:string , eventFunction ){
        var thisObject:Bar = this;
        element.addEventListener(eventName , function(){
            if(thisObject.eventEnable){
                eventFunction();
            }
        } , false);
    }
}
