module Debug{
    export class Console{
        private static instance : Console 
        /**
            <br>
            
            @method  
            @param {} 
            @return 
        */
        private static getInstance() : Console{
            if(!this.instance){
                this.instance = new Console()
            }
            return this.instance;
        }

        static console : HTMLDivElement;
        constructor(){
        }
        private static create(){
            if(!this.console){
                this.console = <HTMLDivElement>document.createElement("Div")
                var style = this.console.style 
                style.width  = "200px";
                style.height = "200px";
                style.top    = "20px";
                style.left   = "20px";
                style.zIndex = "1000000";
                style.border = "solid 1px black";
                style.position = "fixed"
            }
            document.body.appendChild(this.console);
        }

        public static d(message : string){
            this.getInstance();
            this.create();
            if(this.console.innerHTML){
                this.console.innerHTML = "<span style='color:blue'>" + message + "</span><br>" + this.console.innerHTML;
            }else{
                this.console.innerHTML = "<span style='color:blue'>" + message + "</span>";
            }
        }

        public static e(message : string){
            this.getInstance();
            this.create();
            if(this.console.innerHTML){
                this.console.innerHTML = "<span style='color:red'>" + message + "</span><br>" + this.console.innerHTML;
            }else{
                this.console.innerHTML = "<span style='color:red'>" + message + "</span>";
            }
        }

        public static clear(){
            this.getInstance();
            this.console.innerHTML = "";
        }
    }
}
