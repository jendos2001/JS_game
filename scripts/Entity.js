var Entity = {
    pos_x: 0, pos_y: 0,
    size_x: 0, size_y: 0,
    extend: function (extendProto) {
        var object = Object.create(this);
        for (var property in extendProto) {
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};


var Player = Entity.extend({
    lifetime: 1,
    coins: 0,
    move_x: 0, move_y: 0,
    speed: 10,
    freeze: 0,
    level: 1,
    draw: function (ctx) {
        if(this.lifetime > 0) {
            if (this.move_x === 1)
                spriteManager.drawSprite(ctx, "Player_right", this.pos_x, this.pos_y);
            else if (this.move_x === -1)
                spriteManager.drawSprite(ctx, "Player_left", this.pos_x, this.pos_y);
            else if (this.move_y === 1)
                spriteManager.drawSprite(ctx, "Player_down", this.pos_x, this.pos_y);
            else if (this.move_y === -1)
                spriteManager.drawSprite(ctx, "Player_up", this.pos_x, this.pos_y);
            else
                spriteManager.drawSprite(ctx, "Player_down", this.pos_x, this.pos_y);
        }
        else{
            this.setRecord();
            document.location.href = ("./index.html");
            window.alert("Game over!");
        }

    },
    setRecord: function(){
        if(localStorage.hasOwnProperty(localStorage.getItem("gamer_name"))){
            if(this.coins > parseInt(localStorage.getItem(localStorage.getItem("gamer_name")))){
                localStorage.setItem(localStorage.getItem("gamer_name"), String(this.coins));
            }
        }else{

            localStorage.setItem(localStorage.getItem("gamer_name"), String(this.coins));
        }
    },
    update: function () {
        if(1060 < this.pos_x && this.pos_x < 1093 && 6 < this.pos_y && this.pos_y < 38){
            this.level = 2;
            physicManager.update(this);
        }
        if(161 < this.pos_x && this.pos_x < 223 && 6 < this.pos_y && this.pos_y < 38 && this.level === 2){
            this.setRecord();
            document.location.href = ("./index.html");
            window.alert("You won!");
        }
        if(this.lifetime > 0)
            if (this.freeze > 20){
                physicManager.update(this);
            }
            else
                this.freeze += 1;


    },
    onTouchEntity: function(obj) {
        if(obj.name === "Bonus"){
            this.coins += 1;
            soundManager.playEvent(soundManager.eventSoung);
        }


    },
    kill: function() { },
    fire: function() {
        soundManager.playEvent(soundManager.shotSound);
        var r = Object.create(Shot);
        r.size_x = 32;
        r.size_y = 32;
        r.name = "Rocket";
        r.move_x = this.move_x;
        r.move_y = this.move_y;
        switch (this.move_x + 2 * this.move_y) {
            case -1:
                r.pos_x = this.pos_x - r.size_x;
                r.pos_y = this.pos_y;
                break;
            case 1:
                r.pos_x = this.pos_x + this.size_x;
                r.pos_y = this.pos_y;
                break;
            case -2:
                r.pos_x = this.pos_x;
                r.pos_y = this.pos_y - r.size_y;
                break;
            case 2:
                r.pos_x = this.pos_x;
                r.pos_y = this.pos_y + this.size_y;
                break;
            default:
                return;
        }
        gameManager.entities.push(r);
    }
});

var Enemy = Entity.extend({
    lifetime: 100,
    move_x: 1, move_y: 0,
    prev_x: -1, prev_y: 1,
    speed: 5,
    steps:0,
    life:true,
    touch: false,
    draw: function (ctx) {
        if(this.life)
            if(this.move_x === 1)
                spriteManager.drawSprite(ctx, "Enemy_right", this.pos_x, this.pos_y);
            else if(this.move_x === -1)
                spriteManager.drawSprite(ctx, "Enemy_left", this.pos_x, this.pos_y);
            else if(this.move_y === 1)
                spriteManager.drawSprite(ctx, "Enemy_down", this.pos_x, this.pos_y);
            else if(this.move_y === -1)
                spriteManager.drawSprite(ctx, "Enemy_up", this.pos_x, this.pos_y);
            else
                spriteManager.drawSprite(ctx, "Enemy_up", this.pos_x, this.pos_y);

    },
    update: function () {
        physicManager.update(this);
    },
    onTouchEntity: function(obj) {
        if(this.pos_x < obj.pos_x < this.pos_x + this.size_x && this.pos_y < obj.pos_y < this.pos_y + this.size_y
        || this.pos_x < obj.pos_x < this.pos_x + this.size_x && this.pos_y < obj.pos_y + obj.size_y < this.pos_y + this.size_y
        || this.pos_x < obj.pos_x + obj.size_x < this.pos_x + this.size_x && this.pos_y < obj.pos_y < this.pos_y + this.size_y
        || this.pos_x < obj.pos_x + obj.size_x < this.pos_x + this.size_x && this.pos_y < obj.pos_y + obj.size_y < this.pos_y + this.size_y){
            if(!this.touch){
                obj.lifetime -= 1;
                this.touch = true;
                obj.freeze = 0;
            }
        }
    },
    kill: function() {
        this.pos_x = -100;
        this.pos_y = -100;
        this.life = false;
    },
    fire: function() { }
});

var Shot = Entity.extend({
    move_x: 0, move_y: 0,
    speed: 20,
    life: true,
    draw: function (ctx) {
        if(this.life)
            if(this.move_x === 1)
                spriteManager.drawSprite(ctx, "Rocket_right", this.pos_x, this.pos_y);
            else if(this.move_x === -1)
                spriteManager.drawSprite(ctx, "Rocket_left", this.pos_x, this.pos_y);
            else if(this.move_y === 1)
                spriteManager.drawSprite(ctx, "Rocket_down", this.pos_x, this.pos_y);
            else if(this.move_y === -1)
                spriteManager.drawSprite(ctx, "Rocket_up", this.pos_x, this.pos_y);
            else
                spriteManager.drawSprite(ctx, "Rocket_up", this.pos_x, this.pos_y);

    },
    update: function () {
        if(this.life)
            physicManager.update(this);
    },
    onTouchEntity: function(obj) {
        if(obj.name === "Enemy"){
            obj.life = false;
            this.life = false;
        }
    },
    onTouchMap: function(idx) {
        this.kill();
    },
    kill: function() {}
});

var Bonus = Entity.extend({
    life: true,
    draw: function (ctx) {
        if(this.life)
            spriteManager.drawSprite(ctx, "Bonus", this.pos_x, this.pos_y);
    },
    kill: function() {},
    onTouchEntity: function(obj) {
        if(obj.name === "Player") {
            this.life = false;
            this.pos_x = -100;
            this.pos_y = -100;
        }
    }
});