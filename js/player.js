var Bar = (function () {
    function Bar() {
    }
    Bar.prototype.createElement = function () {
        return document.createElement("div");
    };
    return Bar;
})();
var ControlBarOption = (function () {
    function ControlBarOption() {
        this.displayLeftButtons = ['play', 'volume', 'duration', 'current', 'seekbar'];
        this.displayRightButtons = ['fullscreen'];
        this.height = 40;
        this.zIndex = 100;
    }
    return ControlBarOption;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    ControlBar.prototype.createElement = function () {
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";

        var options = this.options;

        var buttonFunctions = this.getCreateButtonMethods();
        for (var i = 0; i < options.displayLeftButtons.length; i++) {
            var functionName = options.displayLeftButtons[i];
            newElement.appendChild(buttonFunctions[functionName]());
        }

        for (var i = 0; i < options.displayRightButtons.length; i++) {
            var functionName = options.displayRightButtons[i];
            newElement.appendChild(buttonFunctions[functionName]());
        }

        return newElement;
    };

    ControlBar.prototype.appendCreateButtonMethods = function (buttonName, buttonCreateFunction) {
    };

    ControlBar.prototype.getCreateButtonMethods = function () {
        var thisObject = this.thisObject;
        var createMethods = {
            'play': function () {
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'volume': function () {
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'duration': function () {
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'current': function () {
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'seekbar': function () {
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
                return element;
            },
            'fullscreen': function () {
                var element = document.createElement("img");
                element.className = "play";
                element.src = "../image/miniButton.svg";
                element.style.height = thisObject.options.height + "px";
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
var TitleBarOption = (function () {
    function TitleBarOption() {
        this.height = 40;
        this.zIndex = 100;
    }
    return TitleBarOption;
})();
var TitleBar = (function (_super) {
    __extends(TitleBar, _super);
    function TitleBar(options, width) {
        _super.call(this);
        this.options = options;
        if (this.options == null) {
            this.options = new TitleBarOption();
        }
        this.width = width;
    }
    TitleBar.prototype.createElement = function () {
        var newElement = document.createElement("div");
        newElement.style.width = this.width + "px";
        newElement.style.height = this.options.height + "px";
        newElement.style.backgroundColor = "#888888";
        newElement.style.zIndex = this.options.zIndex + "";
        newElement.style.position = "absolute";
        newElement.style.opacity = "0.5";

        return newElement;
    };
    return TitleBar;
})(Bar);
var CreateOption = (function () {
    function CreateOption() {
        this.imagePath = '../image/';
        this.largePlayButton = 'largeButton.svg';
    }
    return CreateOption;
})();

var Player = (function () {
    function Player(target, createOption, controlOption, titleBarOption) {
        this.isPlaying = false;
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
        this.target = target;
        this.createOption = createOption;
        this.getEnvironment();
        this.getSize();

        this.createParentDiv();

        this.title = new TitleBar(titleBarOption, this.width);
        this.control = new ControlBar(controlOption, this.width);

        var thisObject = this;

        var largePlayButton = this.largePlayButton;

        this.setUpperBar(this.title);
        this.setLowerBar(this.control);

        largePlayButton.addEventListener('click', function () {
            thisObject.togglePlayPause();
        }, false);

        largePlayButton.addEventListener('touch', function () {
            thisObject.togglePlayPause();
        }, false);

        this.setInitialVolume(0);
    }
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
        var targetParent = this.targetParent;
        var target = this.target;
        var largePlayButton = this.largePlayButton;
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
            this.setCenterElementPosition(largePlayButton, 0.5);
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
            this.setFullscreenCenterElementPosition(largePlayButton, 0.5);
        }
    };

    Player.prototype.togglePlayPause = function () {
        var target = this.target;
        if (this.isPlaying) {
            target.pause();
            this.isPlaying = false;
        } else {
            target.play();
            this.isPlaying = true;
        }
        this.toggleElement(this.largePlayButton);
    };

    Player.prototype.toggleElement = function (element) {
        element.style.display = element.style.display == 'none' ? 'block' : 'none';
    };

    Player.prototype.setLowerBar = function (barObject) {
        var bar = barObject.createElement();

        var height = parseInt(bar.style.height.replace('px', ''));
        if (!height) {
            height = parseInt(getComputedStyle(bar, '').height.replace('px', ''));
        }

        bar.style.top = (this.height - height) + "px";

        var target = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
    };

    Player.prototype.setUpperBar = function (barObject) {
        var bar = barObject.createElement();
        bar.style.top = "0px";

        var target = this.target;
        var parentNode = target.parentNode;
        parentNode.appendChild(bar);
    };

    Player.prototype.setFullscreenLowerBar = function (barObject) {
        var bar = barObject.createElement();

        var screenHeight = screen.height;

        var height = parseInt(bar.style.height.replace('px', ''));
        if (!height) {
            height = parseInt(getComputedStyle(bar, '').height.replace('px', ''));
        }

        bar.style.top = (screenHeight - height) + "px";
    };
    return Player;
})();
