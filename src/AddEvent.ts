interface Element{
    attachEvent(eventName : string , eventHandler)
    detachEvent(eventName : string , eventHandler)
}

class AddEvent{
    /**
        <br>
        
        @method addDocumentEvent
        @param eventName {string} 
        @param eventHandler {function} 
        @return void
    */
    public addDocumentEvent(eventName : string , eventHandler  , useCapture : boolean = false) : void {
        if(document.addEventListener){
            document.addEventListener(eventName , eventHandler, useCapture)
        }else{
            document.attachEvent("on" + eventName, eventHandler)
        }
    }

    /**
        <br>
        
        @method removeDocumentEvent
        @param eventName {string} 
        @param eventHandler {function} 
        @return void
    */
    public removeDocumentEvent(eventName : string , eventHandler  , useCapture : boolean = false) : void{
        if(document.removeEventListener){
            document.removeEventListener(eventName , eventHandler, useCapture)
        }else{
            document.detachEvent("on" + eventName, eventHandler)
        }
    }

    /**
        <br>
        
        @method addEvent 
        @param element {HTMLElement} 
        @param eventName {string} 
        @param eventHandler {function} 
        @return void
    */
    public addEvent(element : HTMLElement , eventName : string , eventHandler  , useCapture : boolean = false) : void {
        if(element.addEventListener){
            element.addEventListener(eventName , eventHandler, useCapture)
        }else{
            element.attachEvent("on" + eventName, eventHandler)
        }
    }

    /**
        <br>
        
        @method removeEvent 
        @param element {HTMLElement} 
        @param eventName {string} 
        @param eventHandler {function} 
        @return void
    */
    public removeEvent(element : HTMLElement , eventName : string , eventHandler  , useCapture : boolean = false) : void{
        if(element.removeEventListener){
            element.removeEventListener(eventName , eventHandler, useCapture)
        }else{
            element.detachEvent("on" + eventName, eventHandler)
        }
    }
}

