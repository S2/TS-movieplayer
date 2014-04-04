/// <reference path="jquery.d.ts" />

class CookieManager{
    static get(keyName : string){
        var cookieValue = document.cookie;
        var cookieStart = cookieValue.indexOf(" " + keyName + "=");
        if (cookieStart == -1){
            cookieStart = cookieValue.indexOf(keyName + "=");
        }
    
        if (cookieStart == -1){
            cookieValue = null;
        } else {
            cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
            var cookieEnd = cookieValue.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = cookieValue.length;
            }
            cookieValue = unescape(cookieValue.substring(cookieStart , cookieEnd));
        }
        return cookieValue;
    }
    
    static remove(keyName : string) {
        var cookieString = keyName + "=; max-age=0; path=/; domain=" +  document.domain + ';';
        if (navigator.appName == 'Microsoft Internet Explorer') {
            cookieString += " expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        }
        document.cookie = cookieString;
    }
    
    static set(keyName : string , cookieValue : string , expireTime? : number) {
        var cookieString =
            keyName + '=' + cookieValue +
            ( ( expireTime ) ? '; max-age=' + expireTime : '' ) +
            "; path=/; domain=" + document.domain + ";";
        if (expireTime && navigator.appName == 'Microsoft Internet Explorer') {
            var expireTimeMillseconds = expireTime * 1000; //in milliseconds
            var today = new Date();
            var expireDate = new Date( today.getTime() + (expireTimeMillseconds) );
            cookieString += " expires=" + expireDate.toGMTString() + ";";
        }
        document.cookie = cookieString; 
    }
}
