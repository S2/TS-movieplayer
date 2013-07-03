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
        this.getSize();

        this.title = new TitleBar(titleBarOption, this.width);
        this.controles = new Controles(controlOption, this.width);

        var thisObject = this;
        target.addEventListener('click', function () {
            thisObject.toggleFullScreen();
        }, false);

        this.setInitialVolume(0);
    }
    Player.prototype.getSize = function () {
        var target = this.target;
        this.width = parseInt(target.style.width.replace('px', ''));
        if (this.width == 0) {
            this.width = parseInt(getComputedStyle(target, '').width.replace('px', ''));
        }

        this.height = parseInt(target.style.height.replace('px', ''));
        if (this.height == 0) {
            this.height = parseInt(getComputedStyle(target, '').height.replace('px', ''));
        }
    };

    Player.prototype.setInitialVolume = function (volume) {
        var target = this.target;
        target.volume = volume;
    };

    Player.prototype.toggleFullScreen = function () {
        var target = this.target;
        if (this.isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }

            this.isFullScreen = false;
        } else {
            if (target.requestFullscreen) {
                target.requestFullscreen();
            } else if (target.mozRequestFullScreen) {
                target.mozRequestFullScreen();
            } else if (target.webkitRequestFullScreen) {
                target.webkitRequestFullScreen();
            }
            this.isFullScreen = true;
        }
    };

    Player.prototype.togglePlayPause = function () {
        var target = this.target;
        if (this.isPlaying) {
            target.pause();
            this.isPlaying = false;
            this.toggleFullScreen();
        } else {
            target.play();
            this.isPlaying = true;
            this.toggleFullScreen();
        }
    };
    return Player;
})();
