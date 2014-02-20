var Bar = (function () {
    function Bar() {
        this.maxAlpha = 0.5;
        this.eventEnable = true;
        this.inFeedOut = false;
        this.inFeedIn = false;
        this.feedInHook = [];
        this.feedInHookOnce = [];
        this.feedOutHook = [];
        this.feedOutHookOnce = [];
    }
    Bar.prototype.createElement = function (player) {
        return document.createElement("div");
    };

    Bar.prototype.feedOut = function (waitSeconds, feedOutSeconds) {
        var _this = this;
        if (this.createdElement) {
            var element = this.createdElement;
            var currentAlpha = Number(element.style.opacity);
            var unitGradAlpha = currentAlpha / feedOutSeconds;
            var setGradAlpha = function () {
                if (!_this.inFeedOut) {
                    return;
                }
                currentAlpha -= unitGradAlpha;
                element.style.opacity = currentAlpha.toString();
                if (currentAlpha > 0) {
                    setTimeout(setGradAlpha, 1);
                } else {
                    element.style.opacity = "0";
                    _this.inFeedOut = false;
                    _this.eventEnable = false;
                    element.style.opacity = "0";
                    for (var i = 0, arrayLength = _this.feedOutHook.length; i < arrayLength; i++) {
                        var method = _this.feedOutHook[i];
                        method();
                    }
                    for (var i = 0, arrayLength = _this.feedOutHookOnce.length; i < arrayLength; i++) {
                        var method = _this.feedOutHookOnce[i];
                        method();
                    }
                    _this.feedOutHookOnce = [];
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
        var _this = this;
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
                if (!_this.inFeedIn) {
                    return;
                }
                if (currentAlpha < maxAlpha) {
                    setTimeout(setGradAlpha, 1);
                } else {
                    element.style.opacity = maxAlpha + "";
                    for (var i = 0, arrayLength = _this.feedInHook.length; i < arrayLength; i++) {
                        var method = _this.feedInHook[i];
                        method();
                    }
                    for (var i = 0, arrayLength = _this.feedInHookOnce.length; i < arrayLength; i++) {
                        var method = _this.feedInHookOnce[i];
                        method();
                    }
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

    Bar.prototype.setFeedInHook = function (hookMethod) {
        this.feedInHook.push(hookMethod);
    };

    Bar.prototype.setFeedInHookOnce = function (hookMethod) {
        this.feedInHookOnce.push(hookMethod);
    };

    Bar.prototype.setFeedOutHook = function (hookMethod) {
        this.feedOutHook.push(hookMethod);
    };

    Bar.prototype.setFeedOutHookOnce = function (hookMethod) {
        this.feedOutHookOnce.push(hookMethod);
    };

    Bar.prototype.setEvent = function (element, eventName, eventFunction) {
        var _this = this;
        element.addEventListener(eventName, function () {
            if (_this.eventEnable) {
                eventFunction();
            }
        }, false);
    };

    Bar.prototype.getHeight = function () {
        var element = this.createdElement;
        return parseInt(element.style.height.replace("px", ""));
    };

    Bar.prototype.getElement = function () {
        return this.createdElement;
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
        this.width = width;
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

        return newElement;
    };
    return TitleBar;
})(Bar);
var SeekBarOption = (function () {
    function SeekBarOption() {
        this.height = 20;
        this.zIndex = 100;
        this.railColor = "#000000";
        this.filledColor = "#FF0000";
        this.class = "seekbar";
    }
    return SeekBarOption;
})();
var SeekBar = (function (_super) {
    __extends(SeekBar, _super);
    function SeekBar(options, width) {
        _super.call(this);
        this.appendMethods = {};
        this.options = options;
        this.width = width;
    }
    SeekBar.prototype.createElement = function (player) {
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.className = this.options.class;
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

        seekbar.addEventListener("click", function (e) {
            var clickedX = e.pageX;
            var moveToSec = player.getDuration() * clickedX / width;
            player.setCurrentTime(moveToSec);
        }, false);

        player.hookTimeUpdate(function (player, video) {
            var current = video.currentTime;
            var duration = player.getDuration();
            var percent = current / duration;
            var filledWidth = width * percent;
            seekbarInner.style.width = filledWidth + "px";
        });
        newElement.appendChild(seekbar);
        this.seekbar = seekbar;
        return newElement;
    };
    return SeekBar;
})(Bar);
var ControlBarOption = (function () {
    function ControlBarOption() {
        this.displayLeftButtons = ['play', 'volume', 'duration', '::', 'current'];
        this.displayRightButtons = ['fullscreen'];
        this.height = 30;
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
        this.width = width;
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

        this.createdElement = newElement;

        return newElement;
    };

    ControlBar.prototype.appendCreateButtonMethods = function (buttonName, buttonCreateFunction) {
        this.appendMethods[buttonName] = buttonCreateFunction;
    };

    ControlBar.prototype.getZIndex = function () {
        return this.options.zIndex;
    };
    return ControlBar;
})(Bar);
var CreateOption = (function () {
    function CreateOption() {
        this.imagePath = '../image/';
        this.viewControllBar = true;
        this.viewTitleBar = true;
        this.viewSeekBar = true;
        this.displayAlwaysSeekBar = true;
    }
    return CreateOption;
})();

var Player = (function () {
    function Player(target, createOption, controlOption, titleBarOption, seekBarOption) {
        if (typeof createOption === "undefined") { createOption = new CreateOption(); }
        if (typeof controlOption === "undefined") { controlOption = new ControlBarOption(); }
        if (typeof titleBarOption === "undefined") { titleBarOption = new TitleBarOption(); }
        if (typeof seekBarOption === "undefined") { seekBarOption = new SeekBarOption(); }
        var _this = this;
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
        this.fullscreenEnter = [];
        this.fullscreenExit = [];
        this.target = target;
        this.createOption = createOption;
        this.getEnvironment();
        this.getSize();

        this.createParentDiv();

        this.title = new TitleBar(titleBarOption, this.width);
        this.control = new ControlBar(controlOption, this.width);
        this.seekbar = new SeekBar(seekBarOption, this.width);

        if (createOption.viewControllBar) {
            this.setLowerBar(this.control);
        }
        if (createOption.viewTitleBar) {
            this.setUpperBar(this.title);
        }
        var seekbar;
        if (createOption.viewSeekBar) {
            seekbar = this.setLowerBar(this.seekbar);
        }
        this.controls = new Controls(this, this.control);

        var centerBackgroundImageSetting = new BackgroundImageSetting('../image/largeButton.svg', 240, 240, 30, 30, 80, 80, new Margin(0, 0, 0, 0));
        this.controls.setCenterPlayButton(centerBackgroundImageSetting);

        var playBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg', 16, 16, 0, 0, 100, 100, new Margin(7, 5, 7, 5));
        var pauseBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg', 16, 16, 0, -16, 100, 100, new Margin(7, 5, 7, 5));
        this.controls.setPlayButton(playBackgroundImageSetting, pauseBackgroundImageSetting);

        var volumeOnBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg', 16, 16, -16, -16, 100, 100, new Margin(7, 5, 7, 5));
        var volumeOffBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg', 16, 16, -16, 0, 100, 100, new Margin(7, 5, 7, 5));
        this.controls.setVolumeButton(volumeOnBackgroundImageSetting, volumeOffBackgroundImageSetting);

        this.controls.setCurrentTime();
        this.controls.setSeparator(" / ");
        this.controls.setDuration(this.duration);

        var fullscreenBackgroundImageSetting = new BackgroundImageSetting('../image/controls.svg', 16, 16, -32, 0, 100, 100, new Margin(7, 5, 7, 5));
        this.controls.setFullscreenButton(fullscreenBackgroundImageSetting);

        target.addEventListener('click', function () {
            _this.togglePauseRestart();
        }, false);
        target.addEventListener('touch', function () {
            _this.togglePauseRestart();
        }, false);

        target.addEventListener('timeupdate', function () {
            _this.doMethodArray(_this.timeUpdate);
        }, false);

        target.addEventListener('ended', function () {
            _this.doMethodArray(_this.ended);
            _this.isPlaying = false;
            _this.isPaused = false;
        }, false);

        var displayControll = true;
        target.addEventListener('mouseover', function () {
            if (_this.isPlaying) {
                _this.title.feedIn(0, 50);
                _this.control.feedIn(0, 50);
                if (!_this.createOption.displayAlwaysSeekBar) {
                    _this.seekbar.feedIn(0, 50);
                } else {
                    if (!displayControll) {
                        seekbar.style.top = parseInt(seekbar.style.top.replace("px", "")) - _this.control.getHeight() + "px";
                    }
                }
                displayControll = true;
            }
        }, false);
        target.addEventListener('mouseout', function () {
            if (_this.isPlaying) {
                _this.title.feedOut(0, 50);
                _this.control.feedOut(0, 50);
                if (!_this.createOption.displayAlwaysSeekBar) {
                    _this.seekbar.feedOut(0, 50);
                } else {
                    if (displayControll) {
                        _this.control.setFeedOutHookOnce(function () {
                            seekbar.style.top = parseInt(seekbar.style.top.replace("px", "")) + _this.control.getHeight() + "px";
                        });
                    }
                }
                displayControll = false;
            }
        }, false);

        this.hookEnded(function (player, video) {
            _this.title.feedIn(0, 50);
            _this.control.feedIn(0, 50);
            if (!_this.createOption.displayAlwaysSeekBar) {
                _this.seekbar.feedIn(0, 50);
            } else {
                if (!displayControll) {
                    seekbar.style.top = parseInt(seekbar.style.top.replace("px", "")) - _this.control.getHeight() + "px";
                }
            }
            displayControll = true;
        });
        this.setInitialVolume(0);
    }
    Player.prototype.setCurrentTime = function (moveToSec) {
        var target = this.target;
        target.currentTime = moveToSec;
        target.play();
    };

    Player.prototype.getCurrentTime = function () {
        var target = this.target;
        return target.currentTime;
    };

    Player.prototype.getDuration = function () {
        if (!this.duration) {
            this.duration = this.target.duration;
        }
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

        this.duration = target.duration;
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
        var targetParent = this.targetParent;
        var target = this.target;
        if (this.isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            target.style.width = this.width + "px";
            target.style.height = this.height + "px";
            this.isFullScreen = false;
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
            this.isFullScreen = true;
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

    Player.prototype.hookFullscreenEnter = function (hookMethod) {
        this.fullscreenEnter.push(hookMethod);
    };

    Player.prototype.hookFullscreenExit = function (hookMethod) {
        this.fullscreenExit.push(hookMethod);
    };

    Player.prototype.doMethodArray = function (methods) {
        for (var i = 0; i < methods.length; i++) {
            methods[i](this, this.target);
        }
    };

    Player.prototype.togglePlayPause = function () {
        var target = this.target;
        if (this.isPlaying) {
            this.doMethodArray(this.beforePause);
            target.pause();
            this.isPaused = true;
            this.doMethodArray(this.afterPause);
            this.isPlaying = false;
        } else {
            if (this.isPaused) {
                this.doMethodArray(this.beforeRestart);
            }
            this.doMethodArray(this.beforePlay);
            target.play();
            this.doMethodArray(this.afterPlay);
            if (this.isPaused) {
                this.doMethodArray(this.afterRestart);
            }
            this.isPlaying = true;
            this.isPaused = false;
        }
    };

    Player.prototype.togglePauseRestart = function () {
        var target = this.target;
        if (!this.isPlaying && this.isPaused) {
            this.doMethodArray(this.beforePlay);
            this.doMethodArray(this.beforeRestart);
            target.play();
            this.doMethodArray(this.afterPlay);
            this.doMethodArray(this.afterRestart);
            this.isPlaying = true;
            this.isPaused = false;
        } else if (this.isPlaying) {
            this.doMethodArray(this.beforePause);
            target.pause();
            this.isPaused = true;
            this.doMethodArray(this.afterPause);
            this.isPlaying = false;
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
        return bar;
    };

    Player.prototype.setUpperBar = function (barObject) {
        var bar = barObject.createElement(this);
        bar.style.top = "0px";

        var target = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
        return bar;
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
var BackgroundImageSetting = (function () {
    function BackgroundImageSetting(src, width, height, top, left, scaleWidth, scaleHeight, margin) {
        if (typeof top === "undefined") { top = 0; }
        if (typeof left === "undefined") { left = 0; }
        if (typeof scaleWidth === "undefined") { scaleWidth = 100; }
        if (typeof scaleHeight === "undefined") { scaleHeight = 100; }
        if (typeof margin === "undefined") { margin = new Margin(0, 0); }
        this.src = src;
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;
        this.margin = margin;
    }
    return BackgroundImageSetting;
})();

var Margin = (function () {
    function Margin(top, right, bottom, left) {
        if (typeof bottom === "undefined") { bottom = null; }
        if (typeof left === "undefined") { left = null; }
        if (bottom == null && left == null) {
            this.top = top;
            this.right = right;
            this.bottom = top;
            this.left = right;
        } else {
            this.top = top;
            this.right = right;
            this.bottom = top;
            this.left = right;
        }
    }
    Margin.prototype.getMarginString = function () {
        return [this.top, this.right, this.bottom, this.left].map(function (value) {
            return value ? value + "px" : "0";
        }).join(" ");
    };
    return Margin;
})();

var Controls = (function () {
    function Controls(player, controlBar) {
        this.hasSetDuration = false;
        this.hasSetCurrentTime = false;
        this.player = player;
        this.controlBar = controlBar;
    }
    Controls.prototype.createButton = function (backgroundImageSetting) {
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
        style.zIndex = (this.controlBar).getZIndex() + 1 + "";
        return button;
    };

    Controls.prototype.setCenterPlayButton = function (backgroundImageSetting) {
        var _this = this;
        var centerPlayButton = this.createButton(backgroundImageSetting);
        centerPlayButton.className = 'centerPlayButton';
        var style = centerPlayButton.style;
        style.position = 'absolute';
        style.left = (this.player.width - backgroundImageSetting.width) / 2 + "px";
        style.top = (this.player.height - backgroundImageSetting.height) / 2 + "px";

        var targetParent = this.player.targetParent;
        targetParent.appendChild(centerPlayButton);

        this.centerPlayButton = centerPlayButton;

        centerPlayButton.addEventListener('click', function () {
            _this.player.togglePlayPause();
        }, false);

        centerPlayButton.addEventListener('touch', function () {
            _this.player.togglePlayPause();
        }, false);

        this.player.hookAfterRestart(function () {
            style.visibility = "hidden";
            style.display = "none";
        });
        this.player.hookAfterPlay(function () {
            style.visibility = "hidden";
            style.display = "none";
        });

        this.player.hookAfterPause(function () {
            style.visibility = "visible";
            style.display = "block";
        });
        this.player.hookEnded(function () {
            style.visibility = "visible";
            style.display = "block";
        });
    };

    Controls.prototype.modifyButton = function (button, backgroundImageSetting) {
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

    Controls.prototype.setPlayButton = function (playBackgroundImageSetting, pauseBackgroundImageSetting) {
        var _this = this;
        var playPauseButton = this.createButton(playBackgroundImageSetting);
        playPauseButton.className = 'controllButtonLeft playPauseButton';
        this.controlBar.getElement().appendChild(playPauseButton);

        this.player.hookAfterRestart(function () {
            _this.modifyButton(playPauseButton, pauseBackgroundImageSetting);
        });
        this.player.hookAfterPlay(function () {
            _this.modifyButton(playPauseButton, pauseBackgroundImageSetting);
        });

        this.player.hookAfterPause(function () {
            _this.modifyButton(playPauseButton, playBackgroundImageSetting);
        });
        this.player.hookEnded(function () {
            _this.modifyButton(playPauseButton, playBackgroundImageSetting);
        });

        playPauseButton.addEventListener('click', function () {
            _this.player.togglePlayPause();
        }, false);
        playPauseButton.addEventListener('touch', function () {
            _this.player.togglePlayPause();
        }, false);
    };

    Controls.prototype.setFullscreenButton = function (backgroundImageSetting) {
        var fullscreenButton = this.createButton(backgroundImageSetting);
        fullscreenButton.className = 'controllButtonRight playPauseButton';
        this.controlBar.getElement().appendChild(fullscreenButton);
    };

    Controls.prototype.setVolumeButton = function (volumeOnImageSetting, volumeOffImageSetting) {
        var volumeButton = this.createButton(volumeOnImageSetting);
        volumeButton.className = 'controllButtonLeft volumeButton';
        this.controlBar.getElement().appendChild(volumeButton);
    };

    Controls.prototype.setVolumeBar = function (src, width, height, top, left, scaleWidth, scaleHeight) {
    };

    Controls.prototype.setVolumeBackground = function (src, width, height, top, left, scaleWidth, scaleHeight) {
    };

    Controls.prototype.setSeparator = function (separateString) {
        this.separateString = separateString;
    };

    Controls.prototype.setCurrentTime = function () {
        var _this = this;
        this.hasSetCurrentTime = true;
        var barHeight = this.controlBar.getHeight();
        var area = document.createElement('div');
        area.style.height = barHeight + "px";
        area.innerHTML = "00:00";
        area.className = 'controllButtonLeft currentTime';
        this.controlBar.getElement().appendChild(area);

        this.player.hookTimeUpdate(function (player, video) {
            var currentTime = player.getCurrentTime();
            var currentTimeString = _this.getTime(currentTime);
            area.innerHTML = currentTimeString;
        });
    };

    Controls.prototype.setDuration = function (durationSeconds) {
        var barHeight = this.controlBar.getHeight();
        var area = document.createElement('div');
        area.style.height = barHeight + "px";

        var durationString = this.getTime(durationSeconds);

        area.innerHTML = durationString;
        area.className = 'controllButtonLeft duration';

        if (this.hasSetCurrentTime && this.separateString) {
            var separator = document.createElement('div');
            separator.style.height = barHeight + "px";
            separator.innerHTML = this.separateString;
            separator.className = 'controllButtonLeft';
            this.controlBar.getElement().appendChild(separator);
        }
        this.controlBar.getElement().appendChild(area);
    };

    Controls.prototype.getTime = function (time) {
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
    return Controls;
})();
