/// <reference path="TSPlayer.ts" />
/// <reference path="BarOption.ts" />

class Bar extends AddEvent{
    constructor(){
        super()
    }
    
    options : BarOption;
    public createdElement:HTMLElement;
    public maxAlpha:number = 1;
    private eventEnable:boolean = true;
    public className : string = "bar";
    public displayed = true;
    public createElement(player:TSPlayer):HTMLElement{
        var element = document.createElement("div");
        element.className = this.className;
        this.createdElement = element;
        return element;
    }
    
    private inFadeOut : boolean = false;
    public fadeOut(waitSeconds:number , fadeOutSeconds:number){
        if(this.createdElement){
            var element:HTMLElement = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var unitGradAlpha = currentAlpha / fadeOutSeconds;
            var setGradAlpha = () => {
                if(!this.inFadeOut){return;}
                currentAlpha -= unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if(currentAlpha > 0){
                    setTimeout(setGradAlpha , 1);
                }else{
                    element.style.opacity = "0";
                    this.inFadeOut = false;
                    this.eventEnable = false;
                    element.style.opacity = "0";
                    for( var i = 0 , arrayLength = this.fadeOutHook.length ; i < arrayLength ; i++){
                        var method = this.fadeOutHook[i];
                        method();
                    }
                    for( var i = 0 , arrayLength = this.fadeOutHookOnce.length ; i < arrayLength ; i++){
                        var method = this.fadeOutHookOnce[i];
                        method();
                    }
                    this.fadeOutHookOnce = [];
                }
            };
            this.inFadeOut = true;
            this.inFadeIn = false;
            setTimeout(() => {
                setGradAlpha()
            } , waitSeconds);
        }
    }

    private inFadeIn : boolean = false;
    public fadeIn(waitSeconds:number , fadeOutSeconds:number){
        if(this.createdElement){
            var element:HTMLElement = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var maxAlpha = this.maxAlpha;
            if(currentAlpha > maxAlpha ){
                return;
            }
            var unitGradAlpha = maxAlpha - currentAlpha / fadeOutSeconds;
            var setGradAlpha = () => {
                currentAlpha += unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if(!this.inFadeIn){return}
                if(currentAlpha < maxAlpha){
                    setTimeout(setGradAlpha , 1);
                }else{
                    element.style.opacity = maxAlpha + "";
                    for( var i = 0 , arrayLength = this.fadeInHook.length ; i < arrayLength ; i++){
                        var method = this.fadeInHook[i];
                        method();
                    }
                    for( var i = 0 , arrayLength = this.fadeInHookOnce.length ; i < arrayLength ; i++){
                        var method = this.fadeInHookOnce[i];
                        method();
                    }
                }
            };
            this.inFadeOut = false;
            this.inFadeIn = true;
            this.eventEnable = true;

            setTimeout(() => {
                setGradAlpha()
            } , waitSeconds);
        }
    }

    /**
        <br>
        
        @method setFadeInHook 
        @param {} 
        @return void
    */
    private fadeInHook : Array<()=>void> = []
    public setFadeInHook(hookMethod:()=>void):void{
        this.fadeInHook.push(hookMethod)
    }

    private fadeInHookOnce : Array<()=>void> = []
    public setFadeInHookOnce(hookMethod:()=>void):void{
        this.fadeInHookOnce.push(hookMethod)
    }

    /**
        <br>
        
        @method setFadeOutHook 
        @param {} 
        @return void
    */
    private fadeOutHook : Array<()=>void> = []
    public setFadeOutHook(hookMethod:()=>void):void{
        this.fadeOutHook.push(hookMethod)
    }

    private fadeOutHookOnce : Array<()=>void> = [];
    public setFadeOutHookOnce(hookMethod:()=>void):void{
        this.fadeOutHookOnce.push(hookMethod)
    }

    public display(){
        var element:HTMLElement = this.createdElement;
        var currentAlpha = Number(element.style.opacity);
        element.style.opacity = "1";
    }

    public hide(){
        var element:HTMLElement = this.createdElement;
        var currentAlpha = Number(element.style.opacity);
        element.style.opacity = "0";
    }

    public setEvent(element:HTMLElement , eventName:string , eventFunction ){
        this.addEvent(element , eventName , () => {
            if(this.eventEnable){
                eventFunction();
            }
        } , false);
    }

    /**
        <br>
        
        @method getHeight 
        @param {} 
        @return number
    */
    public getHeight():number{
        var element:HTMLElement = this.createdElement;
        return parseInt(element.style.height.replace("px" , ""))
    }

    public getElement():HTMLElement{
        return this.createdElement;
    }
    /**
        <br>
        
        @method toggle 
        @param {} 
        @return void
    */
    public toggle():void{
        if(this.createdElement){
            var style = this.createdElement.style;
            if(this.displayed){
                style.display    = "none";
                style.visibility = "hidden";
                this.displayed   = false;
            }else{
                style.display    = "visible"
                style.visibility = "block"
                this.displayed   = true;
            }
        }
    }

    /**
        <br>
        
        @method remove
        @param {} 
        @return void
    */
    public remove():void{
        this.createdElement.parentNode.removeChild(this.createdElement);
    }

    public getZIndex():number{
        return this.options.zIndex;
    }

    public resize(width : number , height : number){
        this.createdElement.style.width = width + "px"
    }
}
