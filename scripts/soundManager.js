var soundManager= {
    themeSound: null,
    shotSound: null,
    eventSoung: null,
    volume: 1,


    init: function () {
        this.themeSound = new Audio("/audio/main.mp3");
        this.shotSound = new Audio("/audio/shot.mp3");
        this.eventSoung = new Audio("/audio/coin.wav");

    },

    playEvent: function (song) {
        song.volume = 0.5;
        song.play();

    }
}
