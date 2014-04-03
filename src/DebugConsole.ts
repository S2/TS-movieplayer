module Debug{
    export class Console{
        console : HTMLDivElement;
        constructor(){
        }
        private create(){
            if(!this.console){
                this.console = <HTMLDivElement>document.createElement("Div")
                var style = this.console.style 
                style.width  = "200px";
                style.height = "200px";
                style.top    = "20px";
                style.left   = "20px";
                style.zIndex = "1000000";
                style.border = "solid 1px black";
                style.position = "absolute"
            }
            document.body.appendChild(this.console);
        }

        public d(message : string){
            this.create();
            if(this.console.innerHTML){
                this.console.innerHTML = "<span style='color:blue'>" + message + "</span><br>" + this.console.innerHTML;
            }else{
                this.console.innerHTML = "<span style='color:blue'>" + message + "</span>";
            }
        }

        public e(message : string){
            this.create();
            if(this.console.innerHTML){
                this.console.innerHTML = "<span style='color:red'>" + message + "</span><br>" + this.console.innerHTML;
            }else{
                this.console.innerHTML = "<span style='color:red'>" + message + "</span>";
            }
        }

        public clear(){
            this.console.innerHTML = "";
        }
    }
}
