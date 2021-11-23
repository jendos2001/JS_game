var canvas = document.getElementById("canvasId");
var ctx = canvas.getContext("2d");

var gameManager = {
    factory: {},
    entities: [],
    fireNum: 0,
    player: null,
    laterKill: [],
    money: 0,
    prevPlayer: null,
    isFill: false,
    isStart: false,
    initPlayer: function(obj) {
        this.player = obj;
    },
    kill: function(obj) {
        this.laterKill.push(obj);
    },
    update: function () {
        if(!this.isStart){
            this.isStart = true;
            soundManager.playEvent(soundManager.themeSound);
        }
        this.showInfo();
        if(this.player === null){
            return;
        }
        this.player.move_x = 0;
        this.player.move_y = 0;
        if (eventsManager.action["up"]) this.player.move_y = -1;
        if (eventsManager.action["down"]) this.player.move_y = 1;
        if (eventsManager.action["left"]) this.player.move_x = -1;
        if (eventsManager.action["right"]){
            this.player.move_x = 1;
        }
        if (eventsManager.action["fire"]){
            this.player.fire();
        }
        this.entities.forEach(function(e) {
            try {
                if(e.name === "Enemy" && e.life || e.name !== "Enemy")
                    e.update();
            } catch(ex) {
            }

        });

        for(var i = 0; i < this.laterKill.length; i++) {
            var idx = this.entities.indexOf(this.laterKill[i]);
            if(idx > -1)
                this.entities.splice(idx, 1);
        }
        if(this.laterKill.length > 0)
            this.laterKill.length = 0;

        mapManager.draw(ctx);

        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw(ctx);
        if(this.player.level === 2 && !this.isFill){
            this.isFill = true;
            ctx.clearRect(0,0, 1344, 704);
            mapManager.reset();
            this.loadAll(2);
            this.player.coins = this.money;
        }
    },
    draw: function(ctx) {
        for(var e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx);
    },
    loadAll: function (level) {
        if(level === 1)
            mapManager.loadMap("/maps/map1.json");
        else
            mapManager.loadMap("/maps/map2.json");
        spriteManager.loadAtlas("/sprites/sprites.json", "/sprites/spritesheet.png");
        gameManager.factory['Player'] = Player;
        gameManager.factory['Enemy'] = Enemy;
        gameManager.factory['Bonus'] = Bonus;
        gameManager.factory['Shot'] = Shot;
        if(level === 2) {
            this.entities = [];
            this.entities.push(this.player);
            this.prevPlayer = this.player;
        }
        mapManager.parseEntities();
        mapManager.draw(ctx);
        mapManager.showRecords();
        eventsManager.setup(canvas);
        soundManager.init();

    },
    play: function() {
        setInterval(updateWorld, 100);

    },

    showInfo(){
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'black';
        ctx.font = '30px "Courier New"';
        if(this.player.name !== null){
            ctx.fillText("Монетки:" + String(this.money), 0, 800);
            ctx.fillText("Жизни:" + String(this.player.lifetime), 0, 835);
        }
        else{
            ctx.fillText("Монетки:" + String(0), 0, 800);
            ctx.fillText("Жизни:" + String(0), 0, 835);

        }
        if(this.player !== null) {
            if (this.player.coins !== this.money) {
                ctx.clearRect(0, 800, 200, 100);
                this.money = this.player.coins;
            }
        }

    },

};

function updateWorld() {
    gameManager.update();
}

gameManager.loadAll(1);
gameManager.play();
