var AddEvent = (function () {
    function AddEvent() {
    }
    /**
        <br>
        
        @method addDocumentEvent
        @param eventName {string}
        @param eventHandler {function}
        @return void
    */
    AddEvent.prototype.addDocumentEvent = function (eventName, eventHandler, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        if (document.addEventListener) {
            document.addEventListener(eventName, eventHandler, useCapture);
        }
        else {
            document.attachEvent("on" + eventName, eventHandler);
        }
    };
    /**
        <br>
        
        @method removeDocumentEvent
        @param eventName {string}
        @param eventHandler {function}
        @return void
    */
    AddEvent.prototype.removeDocumentEvent = function (eventName, eventHandler, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        if (document.removeEventListener) {
            document.removeEventListener(eventName, eventHandler, useCapture);
        }
        else {
            document.detachEvent("on" + eventName, eventHandler);
        }
    };
    /**
        <br>
        
        @method addEvent
        @param element {HTMLElement}
        @param eventName {string}
        @param eventHandler {function}
        @return void
    */
    AddEvent.prototype.addEvent = function (element, eventName, eventHandler, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        if (element.addEventListener) {
            element.addEventListener(eventName, eventHandler, useCapture);
        }
        else {
            element.attachEvent("on" + eventName, eventHandler);
        }
    };
    /**
        <br>
        
        @method removeEvent
        @param element {HTMLElement}
        @param eventName {string}
        @param eventHandler {function}
        @return void
    */
    AddEvent.prototype.removeEvent = function (element, eventName, eventHandler, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        if (element.removeEventListener) {
            element.removeEventListener(eventName, eventHandler, useCapture);
        }
        else {
            element.detachEvent("on" + eventName, eventHandler);
        }
    };
    return AddEvent;
})();
var BarOption = (function () {
    function BarOption() {
        this.zIndex = 100;
    }
    return BarOption;
})();
/// <reference path="jquery.d.ts" />
/// <reference path="TSPlayer.ts" />
/// <reference path="BarOption.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bar = (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        _super.call(this);
        this.maxAlpha = 1;
        this.eventEnable = true;
        this.className = "bar";
        this.displayed = true;
        this.inFadeOut = false;
        this.inFadeIn = false;
        /**
            <br>
            
            @method setFadeInHook
            @param {}
            @return void
        */
        this.fadeInHook = [];
        this.fadeInHookOnce = [];
        /**
            <br>
            
            @method setFadeOutHook
            @param {}
            @return void
        */
        this.fadeOutHook = [];
        this.fadeOutHookOnce = [];
    }
    Bar.prototype.createElement = function (player) {
        var element = document.createElement("div");
        element.className = this.className;
        this.createdElement = element;
        return element;
    };
    Bar.prototype.fadeOut = function (waitSeconds, fadeOutSeconds) {
        var _this = this;
        if (this.createdElement) {
            var element = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var unitGradAlpha = currentAlpha / fadeOutSeconds;
            var setGradAlpha = function () {
                if (!_this.inFadeOut) {
                    return;
                }
                currentAlpha -= unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if (currentAlpha > 0) {
                    setTimeout(setGradAlpha, 1);
                }
                else {
                    element.style.opacity = "0";
                    _this.inFadeOut = false;
                    _this.eventEnable = false;
                    element.style.opacity = "0";
                    for (var i = 0, arrayLength = _this.fadeOutHook.length; i < arrayLength; i++) {
                        var method = _this.fadeOutHook[i];
                        method();
                    }
                    for (var i = 0, arrayLength = _this.fadeOutHookOnce.length; i < arrayLength; i++) {
                        var method = _this.fadeOutHookOnce[i];
                        method();
                    }
                    _this.fadeOutHookOnce = [];
                }
            };
            this.inFadeOut = true;
            this.inFadeIn = false;
            setTimeout(function () {
                setGradAlpha();
            }, waitSeconds);
        }
    };
    Bar.prototype.fadeIn = function (waitSeconds, fadeOutSeconds) {
        var _this = this;
        if (this.createdElement) {
            var element = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var maxAlpha = this.maxAlpha;
            if (currentAlpha > maxAlpha) {
                return;
            }
            var unitGradAlpha = maxAlpha - currentAlpha / fadeOutSeconds;
            var setGradAlpha = function () {
                currentAlpha += unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if (!_this.inFadeIn) {
                    return;
                }
                if (currentAlpha < maxAlpha) {
                    setTimeout(setGradAlpha, 1);
                }
                else {
                    element.style.opacity = maxAlpha + "";
                    for (var i = 0, arrayLength = _this.fadeInHook.length; i < arrayLength; i++) {
                        var method = _this.fadeInHook[i];
                        method();
                    }
                    for (var i = 0, arrayLength = _this.fadeInHookOnce.length; i < arrayLength; i++) {
                        var method = _this.fadeInHookOnce[i];
                        method();
                    }
                }
            };
            this.inFadeOut = false;
            this.inFadeIn = true;
            this.eventEnable = true;
            setTimeout(function () {
                setGradAlpha();
            }, waitSeconds);
        }
    };
    Bar.prototype.setFadeInHook = function (hookMethod) {
        this.fadeInHook.push(hookMethod);
    };
    Bar.prototype.setFadeInHookOnce = function (hookMethod) {
        this.fadeInHookOnce.push(hookMethod);
    };
    Bar.prototype.setFadeOutHook = function (hookMethod) {
        this.fadeOutHook.push(hookMethod);
    };
    Bar.prototype.setFadeOutHookOnce = function (hookMethod) {
        this.fadeOutHookOnce.push(hookMethod);
    };
    Bar.prototype.display = function () {
        var element = this.createdElement;
        var currentAlpha = Number(element.style.opacity);
        element.style.opacity = "1";
    };
    Bar.prototype.hide = function () {
        var element = this.createdElement;
        var currentAlpha = Number(element.style.opacity);
        element.style.opacity = "0";
    };
    Bar.prototype.setEvent = function (element, eventName, eventFunction) {
        var _this = this;
        this.addEvent(element, eventName, function () {
            if (_this.eventEnable) {
                eventFunction();
            }
        }, false);
    };
    /**
        <br>
        
        @method getHeight
        @param {}
        @return number
    */
    Bar.prototype.getHeight = function () {
        var element = this.createdElement;
        return parseInt(element.style.height.replace("px", ""));
    };
    Bar.prototype.getElement = function () {
        return this.createdElement;
    };
    /**
        <br>
        
        @method toggle
        @param {}
        @return void
    */
    Bar.prototype.toggle = function () {
        if (this.createdElement) {
            var style = this.createdElement.style;
            if (this.displayed) {
                style.display = "none";
                style.visibility = "hidden";
                this.displayed = false;
            }
            else {
                style.display = "visible";
                style.visibility = "block";
                this.displayed = true;
            }
        }
    };
    Bar.prototype.getZIndex = function () {
        return this.options.zIndex;
    };
    Bar.prototype.resize = function (width, height) {
        this.createdElement.style.width = width + "px";
    };
    return Bar;
})(AddEvent);
/// <reference path="jquery.d.ts" />
/// <reference path="TSPlayer.ts" />
/// <reference path="Bar.ts" />
var Size = (function () {
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    return Size;
})();
var BannerPosition = (function () {
    function BannerPosition(top, left) {
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        this.top = top;
        this.left = left;
    }
    return BannerPosition;
})();
var Scale = (function () {
    function Scale(scaleWidthPercent, scaleHeightPercent) {
        if (scaleWidthPercent === void 0) { scaleWidthPercent = 0; }
        if (scaleHeightPercent === void 0) { scaleHeightPercent = 0; }
        if (scaleWidthPercent > 100) {
            throw ("scaleWidthPercent must be < 100");
        }
        if (scaleHeightPercent > 100) {
            throw ("scaleHeightPercent must be < 100");
        }
        this.scaleWidthPercent = scaleWidthPercent;
        this.scaleHeightPercent = scaleHeightPercent;
    }
    return Scale;
})();
var BarPartsSetting = (function () {
    function BarPartsSetting(size, position, scale, margin) {
        if (size === void 0) { size = new Size(); }
        if (position === void 0) { position = new BannerPosition(); }
        if (scale === void 0) { scale = new Scale(); }
        if (margin === void 0) { margin = new Margin(0, 0); }
        this.width = size.width;
        this.height = size.height;
        this.top = position.top;
        this.left = position.left;
        this.scaleWidth = scale.scaleWidthPercent;
        this.scaleHeight = scale.scaleHeightPercent;
        this.margin = margin;
    }
    /**
        <br>
        
        @method setSrc
        @param {}
        @return void
    */
    BarPartsSetting.prototype.setSrc = function (src) {
        this.src = src;
    };
    return BarPartsSetting;
})();
var Margin = (function () {
    function Margin(top, right, bottom, left) {
        if (bottom === void 0) { bottom = null; }
        if (left === void 0) { left = null; }
        if (bottom == null && left == null) {
            this.top = top;
            this.right = right;
            this.bottom = top;
            this.left = right;
        }
        else {
            this.top = top;
            this.right = right;
            this.bottom = top;
            this.left = right;
        }
    }
    Margin.prototype.getMarginString = function () {
        var returnArray = [this.top + "", this.right + "", this.bottom + "", this.left + ""];
        for (var i = 0, arrayLength = returnArray.length; i < arrayLength; i++) {
            returnArray[i] = returnArray[i] ? returnArray[i] + "px" : "0";
        }
        return returnArray.join(" ");
    };
    return Margin;
})();
var BarParts = (function (_super) {
    __extends(BarParts, _super);
    function BarParts(player, controlBar) {
        _super.call(this);
        this.hasSetDuration = false;
        this.hasSetCurrentTime = false;
        this.player = player;
        this.controlBar = controlBar;
    }
    BarParts.prototype.createButton = function (backgroundImageSetting) {
        var button = document.createElement('div');
        var style = button.style;
        style.width = backgroundImageSetting.width + "px";
        style.height = backgroundImageSetting.height + "px";
        style.backgroundImage = "url('" + backgroundImageSetting.src + "')";
        style.backgroundRepeat = "no-repeat";
        style.backgroundPosition = backgroundImageSetting.top + "px " + backgroundImageSetting.left + "px";
        style.margin = backgroundImageSetting.margin.getMarginString();
        if (backgroundImageSetting.scaleWidth != 100 || backgroundImageSetting.scaleHeight != 100) {
            style.backgroundSize = backgroundImageSetting.scaleWidth + "% " + backgroundImageSetting.scaleHeight + "%";
        }
        style.zIndex = this.controlBar.getZIndex() + 1 + "";
        return button;
    };
    BarParts.prototype.modifyButton = function (button, backgroundImageSetting) {
        var style = button.style;
        style.width = backgroundImageSetting.width + "px";
        style.height = backgroundImageSetting.height + "px";
        style.backgroundImage = "url('" + backgroundImageSetting.src + "')";
        style.backgroundRepeat = "no-repeat";
        style.backgroundPosition = backgroundImageSetting.top + "px " + backgroundImageSetting.left + "px";
        if (backgroundImageSetting.scaleWidth != 100 || backgroundImageSetting.scaleHeight != 100) {
            style.backgroundSize = backgroundImageSetting.scaleWidth + "% " + backgroundImageSetting.scaleHeight + "%";
        }
    };
    BarParts.prototype.getTime = function (time) {
        var hour = 0;
        var minute = 0;
        var second = 0;
        while (time > 3600) {
            time -= 3600;
            hour++;
        }
        while (time > 60) {
            time -= 60;
            minute++;
        }
        second = parseInt(time.toString());
        var timeString = "";
        if (hour > 0) {
            timeString += hour < 10 ? "0" + hour : hour.toString();
            timeString += ":";
        }
        timeString += minute < 10 ? "0" + minute : minute.toString();
        timeString += ":";
        timeString += second < 10 ? "0" + second : second.toString();
        return timeString;
    };
    return BarParts;
})(AddEvent);
/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />
var BarPartsPlayPauseButton = (function (_super) {
    __extends(BarPartsPlayPauseButton, _super);
    /**
        <br>
        
        @method setPlayButton
        @param {}
        @return void
    */
    function BarPartsPlayPauseButton(player, controlBar, playBarPartsSetting, pauseBarPartsSetting) {
        var _this = this;
        _super.call(this, player, controlBar);
        var playPauseButton = this.createButton(playBarPartsSetting);
        playPauseButton.className = 'controllButtonLeft playPauseButton';
        this.controlBar.getElement().appendChild(playPauseButton);
        // play
        this.player.hookAfterRestart(function () {
            _this.modifyButton(playPauseButton, pauseBarPartsSetting);
        });
        this.player.hookAfterPlay(function () {
            _this.modifyButton(playPauseButton, pauseBarPartsSetting);
        });
        // pause/end 
        this.player.hookAfterPause(function () {
            _this.modifyButton(playPauseButton, playBarPartsSetting);
        });
        this.player.hookEnded(function () {
            _this.modifyButton(playPauseButton, playBarPartsSetting);
        });
        this.addEvent(playPauseButton, 'click', function () {
            _this.player.togglePlayPause();
        }, false);
        this.addEvent(playPauseButton, 'touch', function () {
            _this.player.togglePlayPause();
        }, false);
    }
    return BarPartsPlayPauseButton;
})(BarParts);
/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />
var BarPartsFullscreenButton = (function (_super) {
    __extends(BarPartsFullscreenButton, _super);
    function BarPartsFullscreenButton(player, controlBar, imageSetting) {
        var _this = this;
        _super.call(this, player, controlBar);
        var fullscreenButton = this.createButton(imageSetting);
        fullscreenButton.className = 'controllButtonRight playPauseButton';
        this.addEvent(fullscreenButton, 'click', function () {
            _this.player.toggleFullscreen();
        }, false);
        this.controlBar.getElement().appendChild(fullscreenButton);
    }
    return BarPartsFullscreenButton;
})(BarParts);
/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />
var BarPartsVolumeButton = (function (_super) {
    __extends(BarPartsVolumeButton, _super);
    function BarPartsVolumeButton(player, controlBar, volumeOnImageSetting, volumeOffImageSetting) {
        var _this = this;
        _super.call(this, player, controlBar);
        var volumeButton = this.createButton(volumeOnImageSetting);
        volumeButton.className = 'controllButtonLeft volumeButton';
        volumeButton.style.position = "relative";
        var controlBarElement = this.controlBar.getElement();
        controlBarElement.appendChild(volumeButton);
        this.addEvent(volumeButton, "click", function () {
            _this.player.toggleVolume();
        });
        this.addEvent(volumeButton, "touch", function () {
            _this.player.toggleVolume();
        });
        //  volume on
        this.player.hookVolumeOn(function () {
            _this.modifyButton(volumeButton, volumeOnImageSetting);
        });
        // volume off
        this.player.hookVolumeOff(function () {
            _this.modifyButton(volumeButton, volumeOffImageSetting);
        });
        var volume = this.player.getVolume();
        var volumeArea = document.createElement("div");
        volumeArea.style.position = "absolute";
        volumeArea.style.top = "-123px";
        volumeArea.style.left = "-" + ((30 - volumeOnImageSetting.width) / 2) + "px";
        volumeArea.className = "volumeArea";
        var volumeSlider = document.createElement("div");
        volumeSlider.className = "volumeSlider";
        volumeSlider.style.top = 10 + 100 * volume + "px";
        var volumeBarTotal = document.createElement("div");
        volumeBarTotal.className = "volumeBarTotal";
        var volumeBarCurrent = document.createElement("div");
        volumeBarCurrent.className = "volumeBarCurrent";
        volumeBarTotal.style.height = 100 * volume + "px";
        volumeBarTotal.style.top = "10px";
        volumeBarCurrent.style.height = (100 - 100 * volume) + "px";
        volumeBarCurrent.style.top = 10 + (100 - 100 * volume) + "px";
        volumeArea.appendChild(volumeSlider);
        volumeArea.appendChild(volumeBarTotal);
        volumeArea.appendChild(volumeBarCurrent);
        volumeButton.appendChild(volumeArea);
        var initZIndex = controlBarElement.style.zIndex;
        this.addEvent(volumeButton, 'mouseover', function () {
            volumeArea.style.visibility = "visible";
            volumeArea.style.display = "block";
            controlBarElement.style.zIndex = "2147483647";
        }, false);
        this.addEvent(volumeArea, 'mouseover', function () {
            volumeArea.style.visibility = "visible";
            volumeArea.style.display = "block";
            controlBarElement.style.zIndex = "2147483647";
        }, false);
        this.addEvent(volumeButton, 'mouseout', function () {
            volumeArea.style.visibility = "hidden";
            volumeArea.style.display = "none";
            controlBarElement.style.zIndex = initZIndex;
        }, false);
        this.addEvent(volumeArea, 'click', function (e) {
            var barTop = volumeSlider.getBoundingClientRect().top;
            var dy = e.pageY - barTop;
            var changeToBarTop = parseInt(volumeSlider.style.top.replace("px", "")) + dy;
            if (changeToBarTop < 10) {
                changeToBarTop = 10;
            }
            if (changeToBarTop > 110) {
                changeToBarTop = 110;
            }
            volumeSlider.style.top = changeToBarTop + "px";
            _this.player.setVolume(-1 * dy / 100);
        }, false);
        var moveStart = false;
        this.addEvent(volumeSlider, 'mousedown', function (e) {
            moveStart = true;
        }, false);
        this.addEvent(volumeArea, 'mousemove', function (e) {
            if (!moveStart) {
                return;
            }
            var barTop = volumeSlider.getBoundingClientRect().top;
            var dy = e.pageY - barTop;
            var changeToBarTop = parseInt(volumeSlider.style.top.replace("px", "")) + dy;
            if (changeToBarTop < 10) {
                changeToBarTop = 10;
            }
            if (changeToBarTop > 110) {
                changeToBarTop = 110;
            }
            volumeSlider.style.top = changeToBarTop + "px";
            _this.player.setVolume(-1 * dy / 100);
        }, false);
        this.addDocumentEvent('mouseup', function (e) {
            moveStart = false;
        }, false);
    }
    return BarPartsVolumeButton;
})(BarParts);
/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />
var BarPartsTimes = (function (_super) {
    __extends(BarPartsTimes, _super);
    function BarPartsTimes(player, controlBar, separateString, timeStringPx, timeStringMarginTop) {
        if (separateString === void 0) { separateString = "/"; }
        if (timeStringPx === void 0) { timeStringPx = null; }
        if (timeStringMarginTop === void 0) { timeStringMarginTop = 0; }
        _super.call(this, player, controlBar);
        this.timeStringPx = timeStringPx;
        this.timeStringMarginTop = timeStringMarginTop;
        this.separateString = separateString;
        this.hasSetCurrentTime = true;
    }
    BarPartsTimes.prototype.setCurrentTime = function () {
        var _this = this;
        var barHeight = this.controlBar.getHeight();
        var area = document.createElement('div');
        area.style.height = barHeight + "px";
        area.innerHTML = "00:00";
        if (this.timeStringPx) {
            area.style.fontSize = this.timeStringPx + "px";
        }
        area.style.marginTop = this.timeStringMarginTop + "px";
        area.className = 'controllButtonLeft currentTime';
        this.controlBar.getElement().appendChild(area);
        this.player.hookTimeupdate(function (player, video) {
            var currentTime = player.getCurrentTime();
            var currentTimeString = _this.getTime(currentTime);
            area.innerHTML = currentTimeString;
        });
    };
    BarPartsTimes.prototype.setDuration = function (durationSeconds) {
        var className = 'controllButtonLeft duration';
        var area;
        var areaExists = false;
        var controllElements = this.controlBar.getElement().childNodes;
        for (var i = 0, arrayLength = controllElements.length; i < arrayLength; i++) {
            var element = controllElements[i];
            if (element.className == className) {
                area = element;
                areaExists = true;
                break;
            }
        }
        var barHeight = this.controlBar.getHeight();
        area = area || document.createElement('div');
        area.style.height = barHeight + "px";
        if (this.timeStringPx) {
            area.style.fontSize = this.timeStringPx + "px";
        }
        area.style.marginTop = this.timeStringMarginTop + "px";
        var durationString = this.getTime(durationSeconds);
        area.innerHTML = durationString;
        area.className = className;
        if (!areaExists && this.hasSetCurrentTime && this.separateString) {
            // display separator
            var separator = document.createElement('div');
            separator.style.height = barHeight + "px";
            separator.innerHTML = this.separateString;
            if (this.timeStringPx) {
                separator.style.fontSize = this.timeStringPx + "px";
            }
            separator.style.marginTop = this.timeStringMarginTop + "px";
            separator.className = 'controllButtonLeft separator';
            this.controlBar.getElement().appendChild(separator);
        }
        if (!areaExists) {
            this.controlBar.getElement().appendChild(area);
        }
    };
    return BarPartsTimes;
})(BarParts);
/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />
var BarPartsCenterPlayButton = (function (_super) {
    __extends(BarPartsCenterPlayButton, _super);
    function BarPartsCenterPlayButton(player, controlBar, backgroundImageSetting) {
        var _this = this;
        _super.call(this, player, controlBar);
        var centerPlayButton = this.createButton(backgroundImageSetting);
        centerPlayButton.className = 'centerPlayButton';
        var style = centerPlayButton.style;
        style.position = 'absolute';
        style.left = (this.player.width - backgroundImageSetting.width) / 2 + "px";
        style.top = (this.player.height - backgroundImageSetting.height) / 2 + "px";
        if (player.isIOSMobile) {
            this.player.hookAfterPlay(function () {
                document.body.appendChild(centerPlayButton);
            });
        }
        else {
            var targetParent = this.player.getMediaParent();
            targetParent.appendChild(centerPlayButton);
        }
        this.centerPlayButton = centerPlayButton;
        this.addEvent(centerPlayButton, 'click', function () {
            _this.player.togglePlayPause();
        }, false);
        this.addEvent(centerPlayButton, 'touch', function () {
            _this.player.togglePlayPause();
        }, false);
        // hide
        this.player.hookAfterRestart(function () {
            style.visibility = "hidden";
            style.display = "none";
        });
        this.player.hookAfterPlay(function () {
            style.visibility = "hidden";
            style.display = "none";
        });
        // view 
        this.player.hookAfterPause(function () {
            style.visibility = "visible";
            style.display = "block";
        });
        this.player.hookEnded(function () {
            style.visibility = "visible";
            style.display = "block";
        });
        this.centerPlayButton = centerPlayButton;
        this.backgroundImageSetting = backgroundImageSetting;
    }
    BarPartsCenterPlayButton.prototype.resize = function (width, height) {
        var style = this.centerPlayButton.style;
        style.left = (width - this.backgroundImageSetting.width) / 2 + "px";
        style.top = (height - this.backgroundImageSetting.height) / 2 + "px";
    };
    return BarPartsCenterPlayButton;
})(BarParts);
/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />
var BarPartsTitleString = (function (_super) {
    __extends(BarPartsTitleString, _super);
    function BarPartsTitleString(player, titleBar, titleString) {
        _super.call(this, player, titleBar);
        this.hasSetCurrentTime = true;
        var barHeight = this.controlBar.getHeight();
        var area = document.createElement('div');
        area.style.height = barHeight + "px";
        area.innerHTML = titleString;
        area.className = 'controllButtonCenter';
        this.controlBar.getElement().appendChild(area);
    }
    return BarPartsTitleString;
})(BarParts);
/// <reference path="../jquery.d.ts" />
/// <reference path="../BarParts.ts" />
/// <reference path="../TSPlayer.ts" />
/// <reference path="../Bar.ts" />
var BarPartsLoadingImage = (function (_super) {
    __extends(BarPartsLoadingImage, _super);
    function BarPartsLoadingImage(player, controlBar, imageSetting) {
        _super.call(this, player, controlBar);
        var loadingImage = this.createButton(imageSetting);
        loadingImage.className = 'loadingImage';
        var style = loadingImage.style;
        style.visibility = "hidden";
        style.display = "none";
        style.position = 'absolute';
        style.left = (this.player.width - imageSetting.width) / 2 + "px";
        style.top = (this.player.height - imageSetting.height) / 2 + "px";
        var targetParent = this.player.getMediaParent();
        targetParent.appendChild(loadingImage);
        this.loadingImage = loadingImage;
        this.style = this.loadingImage.style;
    }
    BarPartsLoadingImage.prototype.visible = function () {
        this.style.visibility = "visible";
        this.style.display = "block";
    };
    BarPartsLoadingImage.prototype.invisible = function () {
        this.style.visibility = "hidden";
        this.style.display = "none";
    };
    return BarPartsLoadingImage;
})(BarParts);
/// <reference path="BarOption.ts" />
var TitlePosition;
(function (TitlePosition) {
    TitlePosition[TitlePosition["Left"] = 0] = "Left";
    TitlePosition[TitlePosition["Center"] = 1] = "Center";
    TitlePosition[TitlePosition["Right"] = 2] = "Right";
})(TitlePosition || (TitlePosition = {}));
var TitleBarOption = (function (_super) {
    __extends(TitleBarOption, _super);
    function TitleBarOption() {
        _super.apply(this, arguments);
        this.displayTitlePosition = 1 /* Center */;
        this.height = 30;
        this.zIndex = 100;
        this.align = "center";
    }
    return TitleBarOption;
})(BarOption);
/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="TitleBarOption.ts" />
/// <reference path="TSPlayer.ts" />
var TitleBar = (function (_super) {
    __extends(TitleBar, _super);
    function TitleBar(options, width) {
        _super.call(this);
        this.options = options;
        this.width = width;
        this.className = "bar titleBar";
        this.options = options;
    }
    TitleBar.prototype.createElement = function (player) {
        var newElement = _super.prototype.createElement.call(this, player);
        newElement.className = "bar titleBarString";
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        if (this.options.zIndex) {
            newElement.style.zIndex = this.options.zIndex + "";
        }
        newElement.style.textAlign = this.options.align;
        newElement.style.position = "absolute";
        newElement.style.textOverflow = "ellipsis";
        this.createdElement = newElement;
        newElement.innerHTML = this.options.displayTitleString;
        return newElement;
    };
    return TitleBar;
})(Bar);
/// <reference path="BarOption.ts" />
var SeekBarOption = (function (_super) {
    __extends(SeekBarOption, _super);
    function SeekBarOption() {
        _super.apply(this, arguments);
        this.height = 5;
        this.zIndex = 100;
        this.railColor = "#000000";
        this.filledColor = "#FF0000";
    }
    return SeekBarOption;
})(BarOption);
/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="SeekBarOption.ts" />
/// <reference path="TSPlayer.ts" />
var SeekBar = (function (_super) {
    __extends(SeekBar, _super);
    function SeekBar(options, width) {
        _super.call(this);
        this.appendMethods = {};
        this.options = options;
        this.width = width;
        this.className = "bar seekBar";
    }
    SeekBar.prototype.createElement = function (player) {
        var _this = this;
        var newElement = _super.prototype.createElement.call(this, player);
        newElement.style.width = this.width + "px";
        if (this.options.height) {
            newElement.style.height = this.options.height + "px";
        }
        if (this.options.zIndex) {
            newElement.style.zIndex = this.options.zIndex + "";
        }
        if (this.options.railColor) {
            newElement.style.backgroundColor = this.options.railColor;
        }
        var options = this.options;
        this.createdElement = newElement;
        var width = this.width;
        var seekbar = document.createElement("div");
        if (this.options.height) {
            seekbar.style.height = this.options.height + "px";
        }
        seekbar.style.width = width + "px";
        var seekbarInner = document.createElement("div");
        if (this.options.height) {
            seekbarInner.style.height = this.options.height + "px";
        }
        seekbarInner.style.width = "0px";
        seekbarInner.style.position = "absolute";
        if (this.options.filledColor) {
            seekbarInner.style.backgroundColor = this.options.filledColor;
        }
        seekbar.appendChild(seekbarInner);
        this.addEvent(seekbar, "click", function (e) {
            var clickedX = e.pageX;
            var moveToSec = player.getDuration() * clickedX / _this.width;
            player.setCurrentTime(moveToSec);
        }, false);
        player.hookTimeupdate(function (player, video) {
            var current = video.currentTime;
            var duration = player.getDuration();
            var percent = current / duration;
            var filledWidth = _this.width * percent;
            seekbarInner.style.width = filledWidth + "px";
        });
        newElement.appendChild(seekbar);
        this.seekbar = seekbar;
        return newElement;
    };
    /**
        <br>
        
        @method setMoveDownHeight
        @param moveDownHeight {number}
        @return void
    */
    SeekBar.prototype.setMoveDownHeight = function (moveDownHeight) {
        this.moveDownHeight = moveDownHeight;
    };
    /**
        <br>
        
        @method moveDownBar
        @param {}
        @return void
    */
    SeekBar.prototype.moveDownBar = function () {
        if (this.initTop == null) {
            this.initTop = parseInt(this.createdElement.style.top.replace("px", ""));
        }
        this.createdElement.style.top = this.initTop + this.moveDownHeight + "px";
    };
    /**
        <br>
        
        @method moveDownBar
        @param {}
        @return void
    */
    SeekBar.prototype.moveUpBar = function () {
        if (this.initTop == null) {
            this.initTop = parseInt(this.createdElement.style.top.replace("px", ""));
        }
        this.createdElement.style.top = this.initTop + "px";
    };
    SeekBar.prototype.resize = function (width, height) {
        this.createdElement.style.width = width + "px";
        this.seekbar.style.width = width + "px";
        this.width = width;
        this.initTop = null;
    };
    return SeekBar;
})(Bar);
/// <reference path="BarOption.ts" />
var ControlBarOption = (function (_super) {
    __extends(ControlBarOption, _super);
    function ControlBarOption() {
        _super.apply(this, arguments);
        this.displayLeftButtons = ['play', 'volume', 'duration', '::', 'current'];
        this.displayRightButtons = ['fullscreen'];
        this.height = 30;
        this.zIndex = null;
    }
    return ControlBarOption;
})(BarOption);
/// <reference path="jquery.d.ts" />
/// <reference path="Bar.ts" />
/// <reference path="ControlBarOption.ts" />
/// <reference path="TSPlayer.ts" />
var ControlBar = (function (_super) {
    __extends(ControlBar, _super);
    function ControlBar(options, width) {
        _super.call(this);
        this.appendMethods = {};
        this.options = options;
        this.width = width;
        this.className = "bar controlBar";
    }
    ControlBar.prototype.createElement = function (player) {
        var newElement = _super.prototype.createElement.call(this, player);
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.position = "absolute";
        var options = this.options;
        this.createdElement = newElement;
        return newElement;
    };
    ControlBar.prototype.appendCreateButtonMethods = function (buttonName, buttonCreateFunction) {
        this.appendMethods[buttonName] = buttonCreateFunction;
    };
    ControlBar.prototype.resize = function (width, height) {
        this.display();
    };
    return ControlBar;
})(Bar);
/// <reference path="jquery.d.ts" />
var CookieManager = (function () {
    function CookieManager() {
    }
    CookieManager.get = function (keyName) {
        var cookieValue = document.cookie;
        var cookieStart = cookieValue.indexOf(" " + keyName + "=");
        if (cookieStart == -1) {
            cookieStart = cookieValue.indexOf(keyName + "=");
        }
        if (cookieStart == -1) {
            cookieValue = null;
        }
        else {
            cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
            var cookieEnd = cookieValue.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = cookieValue.length;
            }
            cookieValue = decodeURI(cookieValue.substring(cookieStart, cookieEnd));
        }
        return cookieValue;
    };
    CookieManager.remove = function (keyName) {
        var cookieString = keyName + "=; max-age=0; path=/; domain=" + document.domain + ';';
        if (navigator.appName == 'Microsoft Internet Explorer') {
            cookieString += " expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        }
        document.cookie = cookieString;
    };
    CookieManager.set = function (keyName, cookieValue, expireTime) {
        var cookieString = keyName + '=' + cookieValue + ((expireTime) ? '; max-age=' + expireTime : '') + "; path=/; domain=" + document.domain + ";";
        if (expireTime && navigator.appName == 'Microsoft Internet Explorer') {
            var expireTimeMillseconds = expireTime * 1000; //in milliseconds
            var today = new Date();
            var expireDate = new Date(today.getTime() + (expireTimeMillseconds));
            cookieString += " expires=" + expireDate.toGMTString() + ";";
        }
        document.cookie = cookieString;
    };
    return CookieManager;
})();
var Debug;
(function (Debug) {
    var Console = (function () {
        function Console() {
        }
        /**
            <br>
            
            @method
            @param {}
            @return
        */
        Console.getInstance = function () {
            if (!this.instance) {
                this.instance = new Console();
            }
            return this.instance;
        };
        Console.create = function () {
            if (!this.console) {
                this.console = document.createElement("Div");
                var style = this.console.style;
                style.width = "200px";
                style.height = "200px";
                style.top = "20px";
                style.left = "20px";
                style.zIndex = "1000000";
                style.border = "solid 1px black";
                style.position = "absolute";
            }
            document.body.appendChild(this.console);
        };
        Console.d = function (message) {
            this.getInstance();
            this.create();
            if (this.console.innerHTML) {
                this.console.innerHTML = "<span style='color:blue'>" + message + "</span><br>" + this.console.innerHTML;
            }
            else {
                this.console.innerHTML = "<span style='color:blue'>" + message + "</span>";
            }
        };
        Console.e = function (message) {
            this.getInstance();
            this.create();
            if (this.console.innerHTML) {
                this.console.innerHTML = "<span style='color:red'>" + message + "</span><br>" + this.console.innerHTML;
            }
            else {
                this.console.innerHTML = "<span style='color:red'>" + message + "</span>";
            }
        };
        Console.clear = function () {
            this.getInstance();
            this.console.innerHTML = "";
        };
        return Console;
    })();
    Debug.Console = Console;
})(Debug || (Debug = {}));
/// <reference path="AddEvent.ts" />
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
var CreateOption = (function () {
    function CreateOption() {
        this.imagePath = '../image/';
        this.controlButtons = "controls.svg";
        this.centerButton = "largeButton.svg";
        this.loadingImage = "loading.gif";
        this.viewControlBar = true;
        this.viewTitleBar = true;
        this.viewSeekBar = true;
        this.displayAlwaysSeekBar = true;
        this.separateString = " / ";
        this.displayVolumeFlg = true;
        this.displayCurrentTime = true;
        this.displayDuration = true;
        this.displayFullscreen = true;
        this.titleString = "";
        this.fadeInTime = 100;
        this.fadeOutTime = 100;
        this.playWithFullscreen = false;
        this.automaticCloseFullscreen = true;
        this.timeFontSize = 10;
        this.timeMarginTop = 6;
    }
    return CreateOption;
})();
var BarPair = (function () {
    function BarPair(barObject, bar) {
        this.barObject = barObject;
        this.bar = bar;
    }
    return BarPair;
})();
var TSPlayer = (function (_super) {
    __extends(TSPlayer, _super);
    function TSPlayer(media, createOption, controlOption, titleBarOption, seekBarOption) {
        var _this = this;
        if (createOption === void 0) { createOption = new CreateOption(); }
        if (controlOption === void 0) { controlOption = new ControlBarOption(); }
        if (titleBarOption === void 0) { titleBarOption = new TitleBarOption(); }
        if (seekBarOption === void 0) { seekBarOption = new SeekBarOption(); }
        _super.call(this);
        this.setHeight = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.isFullscreen = false;
        this.isIOSMobile = false;
        this.isIOS = false;
        this.isIPad = false;
        this.isIPod = false;
        this.isIPhone = false;
        this.isAndroid = false;
        this.isAndroid2 = false;
        this.isAndroid40 = false;
        this.isCellularPhone = false;
        this.isOldAndroidChrome = false;
        this.isWebkit = false;
        this.isChrome = false;
        this.isFirefox = false;
        this.isPC = false;
        this.canTouch = false;
        this.volume = 0.5;
        this.enableSound = true;
        this.isEnded = false;
        this.isInPauseEvent = false;
        this.isInPlayEvent = false;
        this.isInEndedEvent = false;
        this.centerBarPartsSetting = new BarPartsSetting(new Size(100, 100), new BannerPosition(0, 0), new Scale(100, 100), new Margin(0, 0, 0, 0));
        this.playBarPartsSetting = new BarPartsSetting(new Size(16, 16), new BannerPosition(0, 0), new Scale(100, 100), new Margin(7, 5, 7, 5));
        this.pauseBarPartsSetting = new BarPartsSetting(new Size(16, 16), new BannerPosition(0, -16), new Scale(100, 100), new Margin(7, 5, 7, 5));
        this.volumeOnBarPartsSetting = new BarPartsSetting(new Size(16, 16), new BannerPosition(-16, -16), new Scale(100, 100), new Margin(7, 5, 7, 5));
        this.volumeOffBarPartsSetting = new BarPartsSetting(new Size(16, 16), new BannerPosition(-16, 0), new Scale(100, 100), new Margin(7, 5, 7, 5));
        this.fullscreenBarPartsSetting = new BarPartsSetting(new Size(16, 16), new BannerPosition(-32, 0), new Scale(100, 100), new Margin(7, 5, 7, 5));
        this.centerLoadingImageSetting = new BarPartsSetting(new Size(100, 100), new BannerPosition(0, 0), new Scale(100, 100), new Margin(0, 0, 0, 0));
        this.hookComments = [];
        this.beforePlay = [];
        this.beforePlayOnce = [];
        this.afterPlay = [];
        this.beforePause = [];
        this.afterPause = [];
        this.beforeRestart = [];
        this.afterRestart = [];
        this.timeUpdate = [];
        this.ended = [];
        this.fullscreenEnter = [];
        this.fullscreenExit = [];
        this.volumeChange = [];
        this.volumeOn = [];
        this.volumeOff = [];
        this.loadedmetadata = [];
        this.media = media;
        this.createOption = createOption;
        this.setEnvironment();
        this.getSize();
        this.createParentDiv();
        this.setInitialVolume(this.volume);
        var controlBarPair = this.createControlBar(createOption, controlOption);
        var titleBarPair = this.createTitleBar(createOption, titleBarOption);
        var seekBarPair = this.createSeekBar(createOption, seekBarOption, titleBarPair.barObject);
        this.controlBarPair = controlBarPair;
        this.titleBarPair = titleBarPair;
        this.seekBarPair = seekBarPair;
        this.setBarEvents(controlBarPair, titleBarPair, seekBarPair);
        this.setNoTSPlayerEvents();
        this.setTSPlayerEvents(createOption);
        if (this.createOption.automaticCloseFullscreen) {
            this.hookEnded(function (player, video) {
                if (!_this.isOldAndroidChrome) {
                    _this.exitFullscreen();
                }
            }, "exit full screen if ended:147");
        }
        media.load();
    }
    TSPlayer.prototype.setBarEvents = function (controlBarPair, titleBarPair, seekBarPair) {
        var _this = this;
        var createOption = this.createOption;
        var media = this.media;
        var displayControl = true;
        var barFadeIn = function () {
            if (_this.isPlaying) {
                titleBarPair.barObject.fadeIn(0, createOption.fadeInTime);
                controlBarPair.barObject.fadeIn(0, createOption.fadeInTime);
                if (seekBarPair) {
                    if (!_this.createOption.displayAlwaysSeekBar) {
                        seekBarPair.barObject.fadeIn(0, createOption.fadeInTime);
                    }
                    else {
                        if (!displayControl) {
                            seekBarPair.barObject.moveUpBar();
                        }
                    }
                }
                displayControl = true;
            }
        };
        media.addEventListener('mouseover', barFadeIn, false);
        if (controlBarPair) {
            controlBarPair.bar.addEventListener('mouseover', barFadeIn, false);
        }
        if (titleBarPair) {
            titleBarPair.bar.addEventListener('mouseover', barFadeIn, false);
        }
        if (seekBarPair) {
            seekBarPair.bar.addEventListener('mouseover', barFadeIn, false);
        }
        if (this.isIOSMobile) {
            this.addDocumentEvent("webkitfullscreenchange", barFadeIn);
        }
        var barFadeOut = function () {
            if (_this.isPlaying) {
                titleBarPair.barObject.fadeOut(0, createOption.fadeOutTime);
                controlBarPair.barObject.fadeOut(0, createOption.fadeOutTime);
                if (seekBarPair) {
                    if (!_this.createOption.displayAlwaysSeekBar) {
                        seekBarPair.barObject.fadeOut(0, createOption.fadeOutTime);
                    }
                    else {
                        if (displayControl) {
                            controlBarPair.barObject.setFadeOutHookOnce(function () {
                                seekBarPair.barObject.moveDownBar();
                            });
                        }
                    }
                }
                displayControl = false;
            }
        };
        media.addEventListener('mouseout', barFadeOut);
        if (this.isAndroid) {
            this.hookAfterPlay(barFadeOut, "set fade out :221 ");
        }
        if (controlBarPair) {
            controlBarPair.bar.addEventListener('mouseout', barFadeOut, false);
        }
        if (titleBarPair) {
            titleBarPair.bar.addEventListener('mouseout', barFadeOut, false);
        }
        if (seekBarPair) {
            seekBarPair.bar.addEventListener('mouseout', barFadeOut, false);
        }
        this.hookEnded(function (player, video) {
            titleBarPair.barObject.fadeIn(0, createOption.fadeInTime);
            controlBarPair.barObject.fadeIn(0, createOption.fadeInTime);
            if (seekBarPair) {
                if (!_this.createOption.displayAlwaysSeekBar) {
                    seekBarPair.barObject.fadeIn(0, createOption.fadeInTime);
                }
                else {
                    if (!displayControl) {
                        seekBarPair.barObject.moveUpBar();
                    }
                }
            }
            displayControl = true;
        });
    };
    TSPlayer.prototype.setTSPlayerEvents = function (createOption) {
        var _this = this;
        var media = this.media;
        if (this.createOption.playWithFullscreen) {
            this.hookFullscreenExit(function () {
                _this.pause(), "exit fullscreen on pause if play with fullscreen";
            });
        }
        if (CookieManager.get("muted") == "true") {
            this.setVolumeOff();
        }
        /* add events */
        this.addEvent(media, 'click', function () {
            _this.togglePauseRestart();
        }, false);
        this.addEvent(media, 'touch', function () {
            _this.togglePauseRestart();
        }, false);
        this.addEvent(media, 'timeupdate', function () {
            _this.doMethodArray(_this.timeUpdate);
        }, false);
        this.addEvent(media, 'loadedmetadata', function () {
            _this.doMethodArray(_this.loadedmetadata);
        }, false);
        this.addEvent(media, 'ended', function () {
            _this.doMethodArray(_this.ended);
            _this.isPlaying = false;
            _this.isPaused = false;
            _this.isEnded = true;
        }, false);
        this.addEvent(media, 'volumechange', function () {
            _this.doMethodArray(_this.volumeChange);
        }, false);
        this.addDocumentEvent("webkitfullscreenchange", function () {
            if (_this.isFullscreen == true) {
                _this.doMethodArray(_this.fullscreenExit);
                if (_this.createOption.playWithFullscreen) {
                    _this.pause();
                }
                setTimeout(function () {
                    _this.isFullscreen = false;
                }, 1000);
            }
            else {
                if (_this.createOption.playWithFullscreen) {
                    _this.play();
                }
                setTimeout(function () {
                    _this.isFullscreen = true;
                }, 1000);
            }
        });
        this.addEvent(media, "webkitendfullscreen", function () {
            _this.pause();
        });
    };
    TSPlayer.prototype.createControlBar = function (createOption, controlOption) {
        var _this = this;
        if (!createOption.viewControlBar) {
            return null;
        }
        var controlBarObject = new ControlBar(controlOption, this.width);
        var controlBar = this.setLowerBar(controlBarObject);
        var controlImage = this.createOption.imagePath + this.createOption.controlButtons;
        this.centerBarPartsSetting.setSrc(this.createOption.imagePath + this.createOption.centerButton);
        this.playBarPartsSetting.setSrc(controlImage);
        this.pauseBarPartsSetting.setSrc(controlImage);
        this.volumeOnBarPartsSetting.setSrc(controlImage);
        this.volumeOffBarPartsSetting.setSrc(controlImage);
        this.fullscreenBarPartsSetting.setSrc(controlImage);
        this.centerLoadingImageSetting.setSrc(this.createOption.imagePath + this.createOption.loadingImage);
        this.barPartsCenterButton = new BarPartsCenterPlayButton(this, controlBarObject, this.centerBarPartsSetting);
        new BarPartsPlayPauseButton(this, controlBarObject, this.playBarPartsSetting, this.pauseBarPartsSetting);
        if (!this.isCellularPhone) {
            new BarPartsVolumeButton(this, controlBarObject, this.volumeOnBarPartsSetting, this.volumeOffBarPartsSetting);
        }
        var timeParts = new BarPartsTimes(this, controlBarObject, this.createOption.separateString, this.createOption.timeFontSize, this.createOption.timeMarginTop);
        if (this.createOption.displayCurrentTime) {
            timeParts.setCurrentTime();
        }
        if (this.createOption.displayDuration) {
            timeParts.setDuration(this.getDuration());
            if (this.isAndroid) {
                // if Android , we can get duration after play start
                this.hookTimeupdate(function () {
                    timeParts.setDuration(_this.getDuration());
                }, "get duration for android");
            }
            else {
                this.hookLoadedmetadata(function () {
                    timeParts.setDuration(_this.getDuration());
                }, "get duration");
            }
        }
        if (this.createOption.displayFullscreen) {
            new BarPartsFullscreenButton(this, controlBarObject, this.fullscreenBarPartsSetting);
        }
        if (this.isAndroid) {
            var loading = new BarPartsLoadingImage(this, controlBarObject, this.centerLoadingImageSetting);
            this.loading = loading;
            this.hookBeforePlay(function () {
                loading.visible();
            }, "display android loading image");
            this.hookTimeupdate(function () {
                if (_this.getCurrentTime() > 0) {
                    loading.invisible();
                }
            }, "hide android loading image");
            this.hookBeforePause(function () {
                loading.invisible();
            }, "hide android loading image");
        }
        return new BarPair(controlBarObject, controlBar);
    };
    TSPlayer.prototype.createSeekBar = function (createOption, seekBarOption, controlBarObject) {
        if (controlBarObject === void 0) { controlBarObject = null; }
        if (!createOption.viewSeekBar) {
            return null;
        }
        var seekBarObject = new SeekBar(seekBarOption, this.width);
        var seekBar = this.setLowerBar(seekBarObject);
        if (controlBarObject) {
            seekBarObject.setMoveDownHeight(controlBarObject.getHeight());
        }
        return new BarPair(seekBarObject, seekBar);
    };
    TSPlayer.prototype.createTitleBar = function (createOption, titleBarOption) {
        if (!createOption.viewTitleBar) {
            return null;
        }
        var titleBarObject = new TitleBar(titleBarOption, this.width);
        var titleBar = this.setUpperBar(titleBarObject);
        new BarPartsTitleString(this, titleBarObject, createOption.titleString);
        return new BarPair(titleBarObject, titleBar);
    };
    /**
        TSPlayer以外のplay/pauseイベントにフックを書く<br>
        @method setNoTSPlayerEvents
        @return void
    */
    TSPlayer.prototype.setNoTSPlayerEvents = function () {
        var _this = this;
        var media = this.media;
        this.addEvent(media, 'play', function () {
            if (!_this.isInPlayEvent) {
                _this.doMethodArrayOnce(_this.beforePlayOnce);
                _this.doMethodArray(_this.beforePlay);
                _this.doMethodArray(_this.afterPlay);
            }
        });
        this.addEvent(media, 'pause', function () {
            if (!_this.isInPauseEvent) {
                _this.doMethodArray(_this.beforePause);
                _this.doMethodArray(_this.afterPause);
            }
        });
    };
    TSPlayer.prototype.setCurrentTime = function (moveToSec) {
        var media = this.media;
        media.currentTime = moveToSec;
    };
    TSPlayer.prototype.getCurrentTime = function () {
        var media = this.media;
        return media.currentTime;
    };
    TSPlayer.prototype.getDuration = function () {
        var duration = this.media.duration;
        if (isNaN(duration)) {
            duration = 0;
        }
        return duration;
    };
    TSPlayer.prototype.setEnvironment = function () {
        var userAgent = navigator.userAgent;
        var matches;
        if (matches = /Android (\d+\.\d+)\.\d+/.exec(userAgent)) {
            this.isAndroid = true;
            this.version = matches[1];
        }
        if (matches = /Android (2\.\d+)\.\d+/.exec(userAgent)) {
            this.isAndroid2 = true;
            this.version = matches[1];
        }
        if (matches = /Android (4\.0)\.\d+/.exec(userAgent)) {
            this.isAndroid40 = true;
            this.version = matches[1];
        }
        if (matches = /Android.*?Chrome\/(\d+)/.exec(userAgent)) {
            this.isChrome = true;
            var version = matches[1];
            if (parseInt(version) < 34) {
                this.isOldAndroidChrome = true;
            }
        }
        if (userAgent.match('iPad')) {
            this.isIOSMobile = false;
            this.isIOS = true;
            this.isIPad = true;
        }
        if (userAgent.match('iPod')) {
            this.isIOSMobile = true;
            this.isIOS = true;
            this.isIPod = true;
        }
        if (userAgent.match('iPhone')) {
            this.isIOSMobile = true;
            this.isIOS = true;
            this.isIPhone = true;
        }
        if (this.isIOS == false && this.isAndroid == false) {
            // Windows Phone and others , not implemented
            this.isPC = true;
        }
        if (document.ontouchstart !== undefined) {
            this.canTouch = true;
        }
        this.isCellularPhone = this.isIOSMobile || this.isAndroid;
    };
    TSPlayer.prototype.getSize = function () {
        var media = this.media;
        this.width = parseInt(media.style.width.replace('px', ''));
        if (!this.width) {
            this.width = parseInt(this.getComputedStyle(media).width.replace('px', ''));
        }
        this.height = parseInt(media.style.height.replace('px', ''));
        if (!this.height) {
            this.height = parseInt(this.getComputedStyle(media).height.replace('px', ''));
        }
    };
    TSPlayer.prototype.getComputedStyle = function (element) {
        if (window.getComputedStyle) {
            return getComputedStyle(element, '');
        }
        else {
            return element.currentStyle;
        }
    };
    TSPlayer.prototype.createParentDiv = function () {
        if (this.isIOSMobile) {
            return;
        }
        var media = this.media;
        media.style.position = 'absolute';
        var parentNode = media.parentNode;
        var mediaParent = document.createElement('div');
        mediaParent.appendChild(media);
        parentNode.appendChild(mediaParent);
        this.mediaParent = mediaParent;
        media.style.top = "0";
        this.media = media;
    };
    TSPlayer.prototype.setFullscreenCenterElementPosition = function (element, ratio) {
        var mediaParent = this.mediaParent;
        if (mediaParent == null) {
            return;
        }
        var width = parseInt(mediaParent.style.width.replace('px', ''));
        if (!width) {
            width = parseInt(this.getComputedStyle(mediaParent).width.replace('px', ''));
        }
        var height = screen.height;
        element.style.width = width * ratio + "px";
        element.style.height = element.style.width;
        element.style.left = (width - width * ratio) / 2 + "px";
        element.style.top = (height - width * ratio) / 2 + "px";
    };
    TSPlayer.prototype.setInitialVolume = function (volume) {
        var media = this.media;
        media.volume = volume;
    };
    /**
        <br>
        
        @method getVolume
        @param {}
        @return number
    */
    TSPlayer.prototype.getVolume = function () {
        var media = this.media;
        return media.volume;
    };
    TSPlayer.prototype.toggleFullscreen = function () {
        var _this = this;
        if (!this.isFullscreen) {
            this.enterFullscreen();
            setTimeout(function () {
                _this.isFullscreen = false;
            }, 1000);
        }
        else {
            this.exitFullscreen();
            setTimeout(function () {
                _this.isFullscreen = true;
            }, 1000);
        }
    };
    /**
        <br>
        
        @method enterFullscreen
        @param {}
        @return void
    */
    TSPlayer.prototype.enterFullscreen = function () {
        var _this = this;
        if (this.isAndroid2) {
            return;
        }
        var mediaParent = this.mediaParent;
        var media = this.media;
        if (media.requestFullscreen) {
            media.requestFullscreen();
        }
        else if (media.mozRequestFullScreen) {
            media.mozRequestFullScreen();
        }
        else if (media.webkitEnterFullScreen) {
            if (this.isFullscreen && this.isAndroid40) {
                media.webkitExitFullScreen();
            }
            media.webkitEnterFullScreen();
        }
        else if (media.webkitRequestFullScreen) {
            media.webkitRequestFullScreen();
        }
        setTimeout(function () {
            if (window.screenTop || window.screenY) {
                _this.isFullscreen = false;
            }
            else {
                _this.isFullscreen = true;
            }
        }, 1000);
        this.doMethodArray(this.fullscreenEnter);
    };
    /**
        <br>
        
        @method exitFullscreen
        @param {}
        @return void
    */
    TSPlayer.prototype.exitFullscreen = function () {
        var _this = this;
        var media = this.media;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (media.webkitExitFullScreen) {
            media.webkitExitFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        setTimeout(function () {
            _this.isFullscreen = false;
        }, 1000);
    };
    /**
        <br>
        
        @method getHookComments
        @param hookName {string}
        @return Array
    */
    TSPlayer.prototype.getHookComments = function (hookName) {
        var returnArray = [];
        for (var i = 0, arrayLength = this.hookComments.length; i < arrayLength; i++) {
            var row = this.hookComments[i];
            if (row.name == hookName) {
                returnArray.push(row);
            }
        }
        return returnArray;
    };
    TSPlayer.prototype.hookBeforePlay = function (hookMethod, comment) {
        this.beforePlay.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "beforePlay"
        });
    };
    TSPlayer.prototype.hookBeforePlayOnce = function (hookMethod, comment) {
        this.beforePlayOnce.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "beforePlayOnce"
        });
    };
    TSPlayer.prototype.hookAfterPlay = function (hookMethod, comment) {
        this.afterPlay.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "afterPlay"
        });
    };
    TSPlayer.prototype.hookBeforePause = function (hookMethod, comment) {
        this.beforePause.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "beforePause"
        });
    };
    TSPlayer.prototype.hookAfterPause = function (hookMethod, comment) {
        this.afterPause.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "afterPause"
        });
    };
    TSPlayer.prototype.hookBeforeRestart = function (hookMethod, comment) {
        this.beforeRestart.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "beforeRestart"
        });
    };
    TSPlayer.prototype.hookAfterRestart = function (hookMethod, comment) {
        this.afterRestart.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "afterRestart"
        });
    };
    TSPlayer.prototype.hookTimeupdate = function (hookMethod, comment) {
        this.timeUpdate.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "timeUpdate"
        });
    };
    TSPlayer.prototype.hookEnded = function (hookMethod, comment) {
        this.ended.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "ended"
        });
    };
    TSPlayer.prototype.hookFullscreenEnter = function (hookMethod, comment) {
        this.fullscreenEnter.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "fullscreenEnter"
        });
    };
    TSPlayer.prototype.hookFullscreenExit = function (hookMethod, comment) {
        this.fullscreenExit.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "fullscreenExit"
        });
    };
    TSPlayer.prototype.hookVolumeChange = function (hookMethod, comment) {
        this.volumeChange.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "volumeChange"
        });
    };
    TSPlayer.prototype.hookVolumeOn = function (hookMethod, comment) {
        this.volumeOn.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "volumeOn"
        });
    };
    TSPlayer.prototype.hookVolumeOff = function (hookMethod, comment) {
        this.volumeOff.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "volumeOff"
        });
    };
    TSPlayer.prototype.hookLoadedmetadata = function (hookMethod, comment) {
        this.loadedmetadata.push(hookMethod);
        this.hookComments.push({
            method: hookMethod,
            comment: comment || "",
            name: "loadedmetadata"
        });
    };
    /**
        <br>
        
        @method setVolumeOn
        @param {}
        @return void
    */
    TSPlayer.prototype.setVolumeOn = function () {
        this.volume = this.media.volume;
        this.media.muted = false;
        CookieManager.set("muted", "false");
        this.enableSound = true;
        this.doMethodArray(this.volumeOn);
    };
    /**
        <br>
        
        @method setVolumeOff
        @param {}
        @return void
    */
    TSPlayer.prototype.setVolumeOff = function () {
        this.media.muted = true;
        CookieManager.set("muted", "true");
        this.enableSound = false;
        this.doMethodArray(this.volumeOff);
    };
    /**
        <br>
        
        @method toggleVolume
        @param {}
        @return void
    */
    TSPlayer.prototype.toggleVolume = function () {
        this.enableSound ? this.setVolumeOff() : this.setVolumeOn();
    };
    /**
        <br>
        
        @method setVolume
        @param {}
        @return void
    */
    TSPlayer.prototype.setVolume = function (dVolume) {
        var newVolume = this.media.volume + dVolume;
        if (newVolume < 0) {
            newVolume = 0;
        }
        if (newVolume > 1) {
            newVolume = 1;
        }
        this.media.volume + newVolume;
    };
    TSPlayer.prototype.doMethodArray = function (methods) {
        for (var i = 0; i < methods.length; i++) {
            methods[i](this, this.media);
        }
    };
    TSPlayer.prototype.doMethodArrayOnce = function (methods) {
        while (methods.length > 0) {
            var method = methods.shift();
            method(this, this.media);
        }
    };
    /**
        <br>
        
        @method getPoster
        @param {}
        @return string
    */
    TSPlayer.prototype.getPoster = function () {
        return this.media.poster;
    };
    TSPlayer.prototype.togglePlayPause = function () {
        if (this.isPlaying) {
            this.pause();
        }
        else {
            this.play();
        }
    };
    /**
        <br>
        
        @method play
        @param {}
        @return void
    */
    TSPlayer.prototype.play = function () {
        var _this = this;
        // Android 4.1 some devices , XperiaZ , SH-02
        // They are not fired webkitendfullscreen 
        if (this.isFullscreen) {
            if (window.screenTop || window.screenY) {
                this.isFullscreen = false;
                this.exitFullscreen();
                if (this.loading) {
                    this.loading.visible();
                }
                setTimeout(function () {
                    _this.play();
                }, 300);
                return;
            }
        }
        this.media.poster = "";
        if (this.isEnded) {
            this.setCurrentTime(0);
            this.isEnded = false;
        }
        var media = this.media;
        if (this.isPaused) {
            this.doMethodArray(this.beforeRestart);
        }
        this.doMethodArrayOnce(this.beforePlayOnce);
        this.doMethodArray(this.beforePlay);
        if (this.createOption.playWithFullscreen) {
            this.enterFullscreen();
        }
        this.isInPlayEvent = true;
        media.play();
        if (this.createOption.playWithFullscreen) {
            this.isPlaying = false;
            this.isPaused = true;
        }
        else {
            this.isPlaying = true;
            this.isPaused = false;
        }
        this.doMethodArray(this.afterPlay);
        if (this.isPaused) {
            this.doMethodArray(this.afterRestart);
        }
        setTimeout(function () {
            _this.isInPlayEvent = false;
        }, 100);
        // Android4.0 , some device ,cannot fire beginfullscreen
        if (this.isAndroid40) {
            setTimeout(function () {
                var intervalID = setInterval(function () {
                    if (_this.isFullscreen) {
                        if (window.screenTop || window.screenY) {
                            _this.isFullscreen = false;
                            _this.exitFullscreen();
                            _this.pause();
                            clearInterval(intervalID);
                        }
                    }
                    else {
                        clearInterval(intervalID);
                    }
                }, 100);
            }, 3000);
        }
    };
    /**
        <br>
        
        @method pause
        @param {}
        @return void
    */
    TSPlayer.prototype.pause = function () {
        var _this = this;
        var media = this.media;
        this.doMethodArray(this.beforePause);
        this.isInPauseEvent = true;
        media.pause();
        this.isPaused = true;
        this.doMethodArray(this.afterPause);
        this.isPlaying = false;
        setTimeout(function () {
            _this.isInPauseEvent = false;
        }, 100);
    };
    TSPlayer.prototype.togglePauseRestart = function () {
        var _this = this;
        var media = this.media;
        if (!this.isPlaying && this.isPaused) {
            if (this.isEnded) {
                this.setCurrentTime(0);
                this.isEnded = false;
            }
            this.doMethodArray(this.beforePlay);
            this.doMethodArray(this.beforeRestart);
            if (this.createOption.playWithFullscreen && this.isFullscreen == false) {
                this.enterFullscreen();
            }
            this.isInPlayEvent = true;
            media.play();
            this.doMethodArray(this.afterPlay);
            this.doMethodArray(this.afterRestart);
            if (this.createOption.playWithFullscreen) {
                this.isPlaying = false;
                this.isPaused = true;
            }
            else {
                this.isPlaying = true;
                this.isPaused = false;
            }
            setTimeout(function () {
                _this.isInPlayEvent = false;
            }, 100);
        }
        else if (this.isPlaying) {
            this.doMethodArray(this.beforePause);
            if (this.createOption.playWithFullscreen && this.isFullscreen == true) {
                this.exitFullscreen();
            }
            this.isInPauseEvent = true;
            media.pause();
            this.isPaused = true;
            this.doMethodArray(this.afterPause);
            this.isPlaying = false;
            setTimeout(function () {
                _this.isInPauseEvent = false;
            }, 100);
        }
    };
    TSPlayer.prototype.toggleElement = function (element) {
        element.style.display = element.style.display == 'none' ? 'block' : 'none';
    };
    TSPlayer.prototype.setLowerBar = function (barObject) {
        var bar = barObject.getElement();
        if (bar == null) {
            bar = barObject.createElement(this);
        }
        var height = parseInt(bar.style.height.replace('px', ''));
        var setHeight = this.setHeight;
        if (!height) {
            height = parseInt(this.getComputedStyle(bar).height.replace('px', ''));
        }
        bar.style.top = (this.height - height - setHeight) + "px";
        this.setHeight += (height);
        var media = this.media;
        var parentNode = media.parentNode;
        parentNode.appendChild(bar);
        return bar;
    };
    TSPlayer.prototype.clearLowerBar = function (barObject) {
        var bar = barObject.getElement();
        var media = this.media;
        var parentNode = media.parentNode;
        parentNode.removeChild(bar);
    };
    TSPlayer.prototype.setUpperBar = function (barObject) {
        var bar = barObject.createElement(this);
        bar.style.top = "0px";
        var media = this.media;
        var parentNode = media.parentNode;
        parentNode.appendChild(bar);
        return bar;
    };
    TSPlayer.prototype.setFullscreenLowerBar = function (barObject) {
        var bar = barObject.createElement(this);
        var screenHeight = screen.height;
        var height = parseInt(bar.style.height.replace('px', ''));
        if (!height) {
            height = parseInt(this.getComputedStyle(bar).height.replace('px', ''));
        }
        bar.style.top = (screenHeight - height) + "px";
    };
    /**
        <br>
        
        @method getMedia
        @param {}
        @return HTMLVideoElement
    */
    TSPlayer.prototype.getMedia = function () {
        return this.media;
    };
    /**
        <br>
        
        @method getMediaParent
        @param {}
        @return HTMLDivElement
    */
    TSPlayer.prototype.getMediaParent = function () {
        if (this.mediaParent) {
            return this.mediaParent;
        }
        else {
            throw "not yet set parent . ios will not set parent";
        }
    };
    /**
        <br>
        
        @method  resize
        @param {}
        @return void
    */
    TSPlayer.prototype.resize = function (width, height) {
        this.media.style.width = width + "px";
        this.media.style.height = height + "px";
        if (this.isIOSMobile) {
            return;
        }
        this.mediaParent.style.width = width + "px";
        this.mediaParent.style.height = height + "px";
        if (this.titleBarPair) {
            this.titleBarPair.barObject.resize(width, height);
        }
        this.setHeight = 0;
        this.width = width;
        this.height = height;
        if (this.controlBarPair) {
            this.controlBarPair.barObject.resize(width, height);
            this.clearLowerBar(this.controlBarPair.barObject);
            this.setLowerBar(this.controlBarPair.barObject);
        }
        if (this.seekBarPair) {
            this.seekBarPair.barObject.resize(width, height);
            this.clearLowerBar(this.seekBarPair.barObject);
            this.setLowerBar(this.seekBarPair.barObject);
        }
        if (this.barPartsCenterButton) {
            this.barPartsCenterButton.resize(width, height);
        }
    };
    return TSPlayer;
})(AddEvent);
