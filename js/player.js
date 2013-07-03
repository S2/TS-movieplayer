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
    }
    return CreateOption;
})();

var Player = (function () {
    function Player(target, createOption, controlOption, titleBarOption) {
        this.isPlaying = false;
        this.isFullScreen = false;
        this.target = target;
        this.createParentDiv();
        this.getSize();

        this.title = new TitleBar(titleBarOption, this.width);
        this.controles = new Controles(controlOption, this.width);

        var thisObject = this;

        target.addEventListener('click', function () {
            thisObject.toggleFullScreen();
            thisObject.togglePlayPause();
        }, false);

        target.addEventListener('touch', function () {
            thisObject.toggleFullScreen();
            thisObject.togglePlayPause();
        }, false);

        this.setInitialVolume(0);
    }
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

        var parentNode = target.parentNode;
        var targetParent = document.createElement('div');
        targetParent.appendChild(target);
        parentNode.appendChild(targetParent);
        this.targetParent = targetParent;
        this.target = target;
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
