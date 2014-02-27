/// <reference path="jquery.d.ts" />
/// <reference path="TSPlayer.ts" />
/// <reference path="BarOption.ts" />

class Bar{
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
    
    private inFeedOut : boolean = false;
    public feedOut(waitSeconds:number , feedOutSeconds:number){
        if(this.createdElement){
            var element:HTMLElement = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var unitGradAlpha = currentAlpha / feedOutSeconds;
            var setGradAlpha = () => {
                if(!this.inFeedOut){return;}
                currentAlpha -= unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if(currentAlpha > 0){
                    setTimeout(setGradAlpha , 1);
                }else{
                    element.style.opacity = "0";
                    this.inFeedOut = false;
                    this.eventEnable = false;
                    element.style.opacity = "0";
                    for( var i = 0 , arrayLength = this.feedOutHook.length ; i < arrayLength ; i++){
                        var method = this.feedOutHook[i];
                        method();
                    }
                    for( var i = 0 , arrayLength = this.feedOutHookOnce.length ; i < arrayLength ; i++){
                        var method = this.feedOutHookOnce[i];
                        method();
                    }
                    this.feedOutHookOnce = [];
                }
            };
            this.inFeedOut = true;
            this.inFeedIn = false;
            setTimeout(() => {
                setGradAlpha()
            } , waitSeconds);
        }
    }

    private inFeedIn : boolean = false;
    public feedIn(waitSeconds:number , feedOutSeconds:number){
        if(this.createdElement){
            var element:HTMLElement = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var maxAlpha = this.maxAlpha;
            if(currentAlpha > maxAlpha ){
                return;
            }
            var unitGradAlpha = maxAlpha - currentAlpha / feedOutSeconds;
            var setGradAlpha = () => {
                currentAlpha += unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if(!this.inFeedIn){return}
                if(currentAlpha < maxAlpha){
                    setTimeout(setGradAlpha , 1);
                }else{
                    element.style.opacity = maxAlpha + "";
                    for( var i = 0 , arrayLength = this.feedInHook.length ; i < arrayLength ; i++){
                        var method = this.feedInHook[i];
                        method();
                    }
                    for( var i = 0 , arrayLength = this.feedInHookOnce.length ; i < arrayLength ; i++){
                        var method = this.feedInHookOnce[i];
                        method();
                    }
                }
            };
            this.inFeedOut = false;
            this.inFeedIn = true;
            this.eventEnable = true;

            setTimeout(() => {
                setGradAlpha()
            } , waitSeconds);
        }
    }

    /**
        <br>
        
        @method setFeedInHook 
        @param {} 
        @return void
    */
    private feedInHook : Array = [];
    public setFeedInHook(hookMethod:()=>void):void{
        this.feedInHook.push(hookMethod)
    }

    private feedInHookOnce : Array = [];
    public setFeedInHookOnce(hookMethod:()=>void):void{
        this.feedInHookOnce.push(hookMethod)
    }

    /**
        <br>
        
        @method setFeedOutHook 
        @param {} 
        @return void
    */
    private feedOutHook : Array = [];
    public setFeedOutHook(hookMethod:()=>void):void{
        this.feedOutHook.push(hookMethod)
    }

    private feedOutHookOnce : Array = [];
    public setFeedOutHookOnce(hookMethod:()=>void):void{
        this.feedOutHookOnce.push(hookMethod)
    }
   
    public setEvent(element:HTMLElement , eventName:string , eventFunction ){
        element.addEventListener(eventName , () => {
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

    public getZIndex():number{
        return this.options.zIndex;
    }
}
