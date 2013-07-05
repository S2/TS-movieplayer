var ControlesOption = (function () {
    function ControlesOption() {
        this.displayPlayButton = true;
        this.displaySeekBar = true;
        this.displayVolumeBar = true;
        this.displayCurrent = true;
        this.displayDuration = true;
        this.displayFullScreen = true;
    }
    return ControlesOption;
})();

var Controles = (function () {
    function Controles(options, width) {
    }
    return Controles;
})();
var TitleBarOption = (function () {
    function TitleBarOption() {
    }
    return TitleBarOption;
})();

var TitleBar = (function () {
    function TitleBar(options, width) {
    }
    return TitleBar;
})();
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
        this.controles = new Controles(controlOption, this.width);

        var thisObject = this;

        var largePlayButton = this.largePlayButton;

        largePlayButton.addEventListener('click', function () {
            thisObject.toggleFullScreen();
            thisObject.togglePlayPause();
        }, false);

        largePlayButton.addEventListener('touch', function () {
            thisObject.toggleFullScreen();
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

        var height = parseInt(targetParent.style.height.replace('px', ''));
        if (!height) {
            height = parseInt(getComputedStyle(targetParent, '').height.replace('px', ''));
        }

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
    };
    return Player;
})();
