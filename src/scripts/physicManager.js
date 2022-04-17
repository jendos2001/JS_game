var physicManager = {
    update: function (obj) {
        if (obj.move_x === 0 && obj.move_y === 0)
            return "stop";
        /*if(obj.name === "Player")
            console.log(obj.level);*/
        var newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        var newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

        if(obj.move_y === 1 || obj.move_x === 1){
            var ts = mapManager.getTilesetIdx(newX + obj.move_x * obj.size_x, newY + obj.move_y * obj.size_y);
        }
        else{
            ts = mapManager.getTilesetIdx(newX + obj.move_x, newY + obj.move_y);
        }
        if(obj.name === "Player"){
            if(obj.move_y !== 0){
                if(obj.move_y === 1){
                    var ts1 = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y);
                    var ts2 = mapManager.getTilesetIdx(newX , newY + obj.size_y);
                }
                else{
                    ts1 = mapManager.getTilesetIdx(newX + obj.size_x, newY);
                    ts2 = mapManager.getTilesetIdx(newX , newY);
                }
                if(ts1 === ts2 && ts1 === 254 && obj.name === "Player")
                    ts = 254;
                else
                    ts = 6;
            }
            if(obj.move_x !== 0){
                if(obj.move_x === 1){
                    ts1 = mapManager.getTilesetIdx(newX + obj.size_x, newY);
                    ts2 = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y);
                }
                else{
                    ts1 = mapManager.getTilesetIdx(newX, newY);
                    ts2 = mapManager.getTilesetIdx(newX, newY + obj.size_y);
                }
                if(ts1 === ts2 && ts1 === 254 && obj.name === "Player")
                    ts = 254;
                else
                    ts = 6;
            }
        }
        var e = this.entityAtXY(obj, newX, newY);
        if(obj.name === "Enemy") {
            if (ts === 254) {
                obj.pos_x = newX;
                obj.pos_y = newY;
                obj.steps += 1;
                if (obj.steps === 100) {
                    obj.steps = 0
                    if (obj.move_x !== 0) {
                        obj.prev_x = obj.move_x;
                        obj.move_x = 0;
                        if (obj.prev_y === 1) {
                            obj.move_y = -1;
                            obj.prev_y = -1;
                        } else {
                            obj.move_y = 1;
                            obj.prev_y = 1;
                        }
                    } else {
                        obj.prev_y = obj.move_y;
                        obj.move_y = 0;
                        if (obj.prev_x === 1) {
                            obj.move_x = -1;
                            obj.prev_x = -1;
                        } else {
                            obj.move_x = 1;
                            obj.prev_x = 1;
                        }
                    }
                }
            }
            else{
                obj.steps = 0
                if (obj.move_x !== 0) {
                    obj.prev_x = obj.move_x;
                    obj.move_x = 0;
                    if (obj.prev_y === 1) {
                        obj.move_y = -1;
                        obj.prev_y = -1;
                    } else {
                        obj.move_y = 1;
                        obj.prev_y = 1;
                    }
                } else {
                    obj.prev_y = obj.move_y;
                    obj.move_y = 0;
                    if (obj.prev_x === 1) {
                        obj.move_x = -1;
                        obj.prev_x = -1;
                    } else {
                        obj.move_x = 1;
                        obj.prev_x = 1;
                    }
                }
            }
        }
        if(obj.name === "Rocket" && (ts === 6 || ts === 8)){
            obj.pos_x = -100;
            obj.pos_y = -100;
            obj.life = false;
        }
        if (e !== null && obj.onTouchEntity){
            if(obj.name === "Rocket"){
                obj.pos_x = -100;
                obj.pos_y = -100;
                if(e.name !== "Bonus"){
                    e.pos_x = -100;
                    e.pos_y = -100;
                }
            }

           if(obj.name === "Player")
                e.onTouchEntity(obj);
            obj.onTouchEntity(e);
        }

        if (ts !== 254 && ts !== 8 && obj.onTouchMap)
            obj.onTouchMap(ts);
        if (ts === 254 && e === null) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else
            return "break";
        return "move";
    },
    entityAtXY: function (obj, x, y) {
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x || y + obj.size_y < e.pos_y || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y){
                    continue;
                }
                return e;
            }
        }
        return null;
    }
};
