interface MSEventAttachmentTarget{
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
        document.addEventListener(eventName , eventHandler, useCapture)
    }

    /**
        <br>
        
        @method removeDocumentEvent
        @param eventName {string} 
        @param eventHandler {function} 
        @return void
    */
    public removeDocumentEvent(eventName : string , eventHandler  , useCapture : boolean = false) : void{
        document.removeEventListener(eventName , eventHandler, useCapture)
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
        element.addEventListener(eventName , eventHandler, useCapture)
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
        element.removeEventListener(eventName , eventHandler, useCapture)
    }
}

