var Bar = (function () {
    function Bar() {
        this.maxAlpha = 0.5;
        this.eventEnable = true;
        this.inFeedOut = false;
        this.inFeedIn = false;
    }
    Bar.prototype.createElement = function (player) {
        return document.createElement("div");
    };

    Bar.prototype.feedOut = function (waitSeconds, feedOutSeconds) {
        var thisObject = this;
        if (this.createdElement) {
            var element = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var unitGradAlpha = currentAlpha / feedOutSeconds;
            var setGradAlpha = function () {
                if (!thisObject.inFeedOut) {
                    return;
                }
                currentAlpha -= unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if (currentAlpha > 0) {
                    setTimeout(setGradAlpha, 1);
                } else {
                    element.style.opacity = "0";
                    thisObject.inFeedOut = false;
                    thisObject.eventEnable = false;
                }
            };
            this.inFeedOut = true;
            this.inFeedIn = false;
            setTimeout(function () {
                setGradAlpha();
            }, waitSeconds);
        }
    };

    Bar.prototype.feedIn = function (waitSeconds, feedOutSeconds) {
        console.log("start");
        var thisObject = this;
        if (this.createdElement) {
            var element = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var maxAlpha = this.maxAlpha;
            if (currentAlpha > maxAlpha) {
                return;
            }
            var unitGradAlpha = maxAlpha - currentAlpha / feedOutSeconds;
            var setGradAlpha = function () {
                currentAlpha += unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if (!thisObject.inFeedIn) {
                    return;
                }
                if (currentAlpha < maxAlpha) {
                    setTimeout(setGradAlpha, 1);
                } else {
                    element.style.opacity = maxAlpha + "";
                }
            };
            this.inFeedOut = false;
            this.inFeedIn = true;
            this.eventEnable = true;

            setTimeout(function () {
                setGradAlpha();
            }, waitSeconds);
        }
    };

    Bar.prototype.setEvent = function (element, eventName, eventFunction) {
        var thisObject = this;
        element.addEventListener(eventName, function () {
            if (thisObject.eventEnable) {
                eventFunction();
            }
        }, false);
    };
    return Bar;
})();
var TitleBarOption = (function () {
    function TitleBarOption() {
        this.height = 40;
        this.zIndex = 100;
    }
    return TitleBarOption;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TitleBar = (function (_super) {
    __extends(TitleBar, _super);
    function TitleBar(options, width) {
        _super.call(this);
        this.options = options;
        if (this.options == null) {
            this.options = new TitleBarOption();
        }
        this.width = width;
        this.thisObject = this;
    }
    TitleBar.prototype.createElement = function (player) {
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";

        this.createdElement = newElement;

        var thisObject = this.thisObject;

        player.hookAfterPlay(function () {
            thisObject.feedOut(1000, 50);
        });
        player.hookAfterPause(function () {
            thisObject.feedIn(0, 50);
        });

        newElement.addEventListener('mouseenter', function () {
            if (player.isPlaying) {
                player.title.feedIn(0, 50);
                player.control.feedIn(0, 50);
                player.seekbar.feedIn(0, 50);
            }
        }, false);
        newElement.addEventListener('mouseout', function () {
            if (player.isPlaying) {
                player.title.feedOut(0, 50);
                player.control.feedOut(0, 50);
                player.seekbar.feedOut(0, 50);
            }
        }, false);

        return newElement;
    };
    return TitleBar;
})(Bar);
var SeekBarOption = (function () {
    function SeekBarOption() {
        this.height = 20;
        this.zIndex = 100;
    }
    return SeekBarOption;
})();
var SeekBar = (function (_super) {
    __extends(SeekBar, _super);
    function SeekBar(options, width) {
        _super.call(this);
        this.appendMethods = {};
        this.options = options;
        if (this.options == null) {
            this.options = new SeekBarOption();
        }
        this.width = width;
        this.thisObject = this;
    }
    SeekBar.prototype.createElement = function (player) {
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";

        var options = this.options;

        this.createdElement = newElement;
        var thisObject = this.thisObject;

        player.hookAfterPlay(function () {
            thisObject.feedOut(1000, 50);
        });
        player.hookAfterPause(function () {
            thisObject.feedIn(0, 50);
        });

        newElement.addEventListener('mouseenter', function () {
            if (player.isPlaying) {
                player.title.feedIn(0, 50);
                player.control.feedIn(0, 50);
                player.seekbar.feedIn(0, 50);
            }
        }, false);
        newElement.addEventListener('mouseout', function () {
            if (player.isPlaying) {
                player.title.feedOut(0, 50);
                player.control.feedOut(0, 50);
                player.seekbar.feedOut(0, 50);
            }
        }, false);

        var seekbar = document.createElement("canvas");
        var width = this.width;
        seekbar.setAttribute('height', this.options.height + "");
        seekbar.setAttribute('width', width + "");
        var ctx = seekbar.getContext('2d');

        ctx.fillStyle = "rgb(200, 0, 0)";
        player.hookTimeUpdate(function (player, video) {
            var current = video.currentTime;
            var duration = player.getDuration();
            var percent = current / duration;

            var filledWidth = width * percent;
            ctx.fillRect(0, 0, filledWidth, 1000);
        });
        newElement.appendChild(seekbar);
        return newElement;
    };
    return SeekBar;
})(Bar);
var ControlBarOption = (function () {
    function ControlBarOption() {
        this.displayLeftButtons = ['play', 'volume', 'duration', '::', 'current'];
        this.displayRightButtons = ['fullscreen'];
        this.height = 40;
        this.zIndex = 100;
    }
    return ControlBarOption;
})();
var ControlBar = (function (_super) {
    __extends(ControlBar, _super);
    function ControlBar(options, width) {
        _super.call(this);
        this.appendMethods = {};
        this.options = options;
        if (this.options == null) {
            this.options = new ControlBarOption();
        }
        this.width = width;
        this.thisObject = this;
    }
    ControlBar.prototype.createElement = function (player) {
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";

        var options = this.options;

        var buttonFunctions = this.getCreateButtonMethods(player);
        for (var i = 0; i < options.displayLeftButtons.length; i++) {
            var functionName = options.displayLeftButtons[i];
            if (buttonFunctions[functionName]) {
                var functionName = options.displayLeftButtons[i];
                var buttonElement = buttonFunctions[functionName]();
                buttonElement.className = buttonElement.className + " controllButtonLeft";
                newElement.appendChild(buttonElement);
            } else {
                var stringObject = document.createElement('div');
                stringObject.innerHTML = functionName;
                stringObject.className = buttonElement.className + " controllButtonLeft";
                newElement.appendChild(stringObject);
            }
        }

        for (var i = 0; i < options.displayRightButtons.length; i++) {
            var functionName = options.displayRightButtons[i];
            var buttonElement = buttonFunctions[functionName]();
            buttonElement.className = buttonElement.className + " controllButtonRight";
            newElement.appendChild(buttonElement);
        }

        this.createdElement = newElement;
        var thisObject = this.thisObject;

        player.hookAfterPlay(function () {
            thisObject.feedOut(1000, 50);
        });
        player.hookAfterPause(function () {
            thisObject.feedIn(0, 50);
        });

        newElement.addEventListener('mouseenter', function () {
            if (player.isPlaying) {
                player.title.feedIn(0, 50);
                player.control.feedIn(0, 50);
                player.seekbar.feedIn(0, 50);
            }
        }, false);
        newElement.addEventListener('mouseout', function () {
            if (player.isPlaying) {
                player.title.feedOut(0, 50);
                player.control.feedOut(0, 50);
                player.seekbar.feedOut(0, 50);
            }
        }, false);

        return newElement;
    };

    ControlBar.prototype.appendCreateButtonMethods = function (buttonName, buttonCreateFunction) {
        this.appendMethods[buttonName] = buttonCreateFunction;
    };

    ControlBar.prototype.getCreateButtonMethods = function (player) {
        var thisObject = this.thisObject;
        var createMethods = {
            'play': function () {
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                thisObject.setEvent(element, "click", player.togglePlayPause);
                return element;
            },
            'volume': function () {
                var element = document.createElement("img");
                element.className = "volume";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'duration': function () {
                var element = document.createElement("div");
                element.className = "duration";
                element.style.height = thisObject.options.height + "px";
                var duration = player.getDuration();
                duration = Math.floor(duration * 100) / 100;
                element.innerHTML = duration + '';
                return element;
            },
            'current': function () {
                var element = document.createElement("div");
                element.className = "current";
                element.innerHTML = '00:00';
                player.hookTimeUpdate(function (player, video) {
                    var current = video.currentTime;
                    current = Math.floor(current * 100) / 100;
                    element.innerHTML = current + '';
                });
                return element;
            },
            'fullscreen': function () {
                var element = document.createElement("img");
                element.className = "fullscreen";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                thisObject.setEvent(element, "click", player.toggleFullScreen);
                return element;
            }
        };
        for (var key in this.appendMethods) {
            createMethods[key] = this.appendMethods[key];
        }
        return createMethods;
    };
    return ControlBar;
})(Bar);
var CreateOption = (function () {
    function CreateOption() {
        this.imagePath = '../image/';
        this.largePlayButton = 'largeButton.svg';
    }
    return CreateOption;
})();

var thisObject;
var Player = (function () {
    function Player(target, createOption, controlOption, titleBarOption, seekBarOption) {
        this.setHeight = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.isFullScreen = false;
        this.isIOS = false;
        this.isIPad = false;
        this.isIPod = false;
        this.isIPhone = false;
        this.isAndroid = false;
        this.isWebkit = false;
        this.isChorome = false;
        this.isFirefox = false;
        this.isPC = false;
        this.canTouch = false;
        this.beforePlay = [];
        this.afterPlay = [];
        this.beforePause = [];
        this.afterPause = [];
        this.beforeRestart = [];
        this.afterRestart = [];
        this.timeUpdate = [];
        this.ended = [];
        this.target = target;
        this.createOption = createOption;
        this.getEnvironment();
        this.getSize();

        this.createParentDiv();

        this.title = new TitleBar(titleBarOption, this.width);
        this.control = new ControlBar(controlOption, this.width);
        this.seekbar = new SeekBar(seekBarOption, this.width);

        thisObject = this;

        var largePlayButton = this.largePlayButton;

        this.setUpperBar(this.title);
        this.setLowerBar(this.control);
        this.setLowerBar(this.seekbar);

        largePlayButton.addEventListener('click', function () {
            thisObject.togglePlayPause();
        }, false);

        largePlayButton.addEventListener('touch', function () {
            thisObject.togglePlayPause();
        }, false);

        target.addEventListener('click', function () {
            thisObject.togglePauseRestart();
        }, false);
        target.addEventListener('touch', function () {
            thisObject.togglePauseRestart();
        }, false);

        target.addEventListener('timeupdate', function () {
            thisObject.doMethodArray(thisObject.timeUpdate);
        }, false);

        target.addEventListener('ended', function () {
            thisObject.doMethodArray(thisObject.ended);
        }, false);

        target.addEventListener('mouseenter', function () {
            if (thisObject.isPlaying) {
                thisObject.title.feedIn(0, 50);
                thisObject.control.feedIn(0, 50);
                thisObject.seekbar.feedIn(0, 50);
            }
        }, false);
        target.addEventListener('mouseout', function () {
            if (thisObject.isPlaying) {
                thisObject.title.feedOut(0, 50);
                thisObject.control.feedOut(0, 50);
                thisObject.seekbar.feedOut(0, 50);
            }
        }, false);

        this.hookEnded(function (player, video) {
            thisObject.title.feedIn(0, 50);
            thisObject.control.feedIn(0, 50);
            thisObject.seekbar.feedIn(0, 50);
        });
        this.setInitialVolume(0);
    }
    Player.prototype.getDuration = function () {
        return this.duration;
    };

    Player.prototype.getEnvironment = function () {
        var userAgent = navigator.userAgent;
        var matches;
        if (matches = /Android (\d+\.\d+\.\d+)/.exec(userAgent)) {
            this.isAndroid = true;
            this.version = matches[0];
        }
        if (userAgent.match('iPad')) {
            this.isIOS = true;
            this.isIPad = true;
        }
        if (userAgent.match('iPod')) {
            this.isIOS = true;
            this.isIPod = true;
        }
        if (userAgent.match('iPhone')) {
            this.isIOS = true;
            this.isIPhone = true;
        }
        if (this.isIOS == false && this.isAndroid == false) {
            this.isPC = true;
        }
        if (document.ontouchstart !== undefined) {
            this.canTouch = true;
        }
    };

    Player.prototype.getSize = function () {
        var target = this.target;
        this.width = parseInt(target.style.width.replace('px', ''));
        if (!this.width) {
            this.width = parseInt(getComputedStyle(target, '').width.replace('px', ''));
        }

        this.height = parseInt(target.style.height.replace('px', ''));
        if (!this.height) {
            this.height = parseInt(getComputedStyle(target, '').height.replace('px', ''));
        }
    };

    Player.prototype.createParentDiv = function () {
        var target = this.target;
        target.style.position = 'absolute';

        var parentNode = target.parentNode;
        var targetParent = document.createElement('div');
        targetParent.appendChild(target);
        parentNode.appendChild(targetParent);
        this.targetParent = targetParent;

        target.style.top = "0";
        this.target = target;

        var createOption = this.createOption;
        var largePlayButton = document.createElement('img');
        largePlayButton.style.position = 'absolute';
        largePlayButton.className = 'largePlayButton';
        largePlayButton.src = createOption.imagePath + createOption.largePlayButton;

        this.setCenterElementPosition(largePlayButton, 0.5);
        targetParent.appendChild(largePlayButton);

        this.largePlayButton = largePlayButton;
        this.duration = target.duration;
    };

    Player.prototype.setCenterElementPosition = function (element, ratio) {
        element.style.width = this.width * ratio + "px";
        element.style.height = element.style.width;
        element.style.left = (this.width - this.width * ratio) / 2 + "px";
        element.style.top = (this.height - this.width * ratio) / 2 + "px";
    };

    Player.prototype.setFullscreenCenterElementPosition = function (element, ratio) {
        var targetParent = this.targetParent;
        var width = parseInt(targetParent.style.width.replace('px', ''));
        if (!width) {
            width = parseInt(getComputedStyle(targetParent, '').width.replace('px', ''));
        }

        var height = screen.height;

        element.style.width = width * ratio + "px";
        element.style.height = element.style.width;
        element.style.left = (width - width * ratio) / 2 + "px";
        element.style.top = (height - width * ratio) / 2 + "px";
    };

    Player.prototype.setInitialVolume = function (volume) {
        var target = this.target;
        target.volume = volume;
    };

    Player.prototype.toggleFullScreen = function () {
        var targetParent = thisObject.targetParent;
        var target = thisObject.target;
        var largePlayButton = thisObject.largePlayButton;
        if (thisObject.isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            target.style.width = thisObject.width + "px";
            target.style.height = thisObject.height + "px";
            thisObject.isFullScreen = false;
            thisObject.setCenterElementPosition(largePlayButton, 0.5);
        } else {
            if (targetParent.requestFullscreen) {
                targetParent.requestFullscreen();
            } else if (targetParent.mozRequestFullScreen) {
                targetParent.mozRequestFullScreen();
            } else if (targetParent.webkitRequestFullScreen) {
                targetParent.webkitRequestFullScreen();
            }
            target.style.width = '100%';
            target.style.height = '100%';
            thisObject.isFullScreen = true;
            thisObject.setFullscreenCenterElementPosition(largePlayButton, 0.5);
        }
    };

    Player.prototype.hookBeforePlay = function (hookMethod) {
        this.beforePlay.push(hookMethod);
    };

    Player.prototype.hookAfterPlay = function (hookMethod) {
        this.afterPlay.push(hookMethod);
    };

    Player.prototype.hookBeforePause = function (hookMethod) {
        this.beforePause.push(hookMethod);
    };

    Player.prototype.hookAfterPause = function (hookMethod) {
        this.afterPause.push(hookMethod);
    };

    Player.prototype.hookBeforeRestart = function (hookMethod) {
        this.beforeRestart.push(hookMethod);
    };

    Player.prototype.hookAfterRestart = function (hookMethod) {
        this.afterRestart.push(hookMethod);
    };

    Player.prototype.hookTimeUpdate = function (hookMethod) {
        this.timeUpdate.push(hookMethod);
    };

    Player.prototype.hookEnded = function (hookMethod) {
        this.ended.push(hookMethod);
    };

    Player.prototype.doMethodArray = function (methods) {
        for (var i = 0; i < methods.length; i++) {
            methods[i](this, this.target);
        }
    };

    Player.prototype.togglePlayPause = function () {
        var target = thisObject.target;
        if (thisObject.isPlaying) {
            thisObject.doMethodArray(thisObject.beforePause);
            target.pause();
            thisObject.isPaused = true;
            thisObject.doMethodArray(thisObject.afterPause);
            thisObject.isPlaying = false;
        } else {
            if (thisObject.isPaused) {
                thisObject.doMethodArray(thisObject.beforeRestart);
            }
            thisObject.doMethodArray(thisObject.beforePlay);
            target.play();
            thisObject.doMethodArray(thisObject.afterPlay);
            if (thisObject.isPaused) {
                thisObject.doMethodArray(thisObject.afterRestart);
            }
            thisObject.isPlaying = true;
            thisObject.isPaused = false;
        }
        thisObject.toggleElement(thisObject.largePlayButton);
    };

    Player.prototype.togglePauseRestart = function () {
        var target = thisObject.target;
        if (!thisObject.isPlaying && thisObject.isPaused) {
            thisObject.doMethodArray(thisObject.beforePlay);
            thisObject.doMethodArray(thisObject.beforeRestart);
            target.play();
            thisObject.doMethodArray(thisObject.afterPlay);
            thisObject.doMethodArray(thisObject.afterRestart);
            thisObject.isPlaying = true;
            thisObject.isPaused = false;
            thisObject.toggleElement(thisObject.largePlayButton);
        } else if (thisObject.isPlaying) {
            thisObject.doMethodArray(thisObject.beforePause);
            target.pause();
            thisObject.isPaused = true;
            thisObject.doMethodArray(thisObject.afterPause);
            thisObject.isPlaying = false;
            thisObject.toggleElement(thisObject.largePlayButton);
        }
    };

    Player.prototype.toggleElement = function (element) {
        element.style.display = element.style.display == 'none' ? 'block' : 'none';
    };

    Player.prototype.setLowerBar = function (barObject) {
        var bar = barObject.createElement(this);

        var height = parseInt(bar.style.height.replace('px', ''));
        var setHeight = this.setHeight;
        if (!height) {
            height = parseInt(getComputedStyle(bar, '').height.replace('px', ''));
        }

        bar.style.top = (this.height - height - setHeight) + "px";
        this.setHeight += (height);

        var target = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
    };

    Player.prototype.setUpperBar = function (barObject) {
        var bar = barObject.createElement(this);
        bar.style.top = "0px";

        var target = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
    };

    Player.prototype.setFullscreenLowerBar = function (barObject) {
        var bar = barObject.createElement(this);

        var screenHeight = screen.height;

        var height = parseInt(bar.style.height.replace('px', ''));
        if (!height) {
            height = parseInt(getComputedStyle(bar, '').height.replace('px', ''));
        }

        bar.style.top = (screenHeight - height) + "px";
    };
    return Player;
})();
