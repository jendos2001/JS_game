var mapManager = {
    mapData: null,
    tLayer: null,
    oLayer: null,
    xCount: 0,
    yCount: 0,
    tSize: {x: 64, y: 64},
    mapSize: {x: 64, y: 64},
    tilesets: [],
    imgLoadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,
    view: {x: 0, y: 0, w: 1344, h: 704},

    loadMap(path) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                mapManager.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        request.send();
    },

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;

        this.mapSize.y = this.yCount * this.tSize.y;
        for (var i = 0; i < this.mapData.tilesets.length; i++) {
            var img = new Image();
            img.onload = function () {
                mapManager.imgLoadCount++;
                if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;
            var t = this.mapData.tilesets[i];
            var ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
                yCount: Math.floor(t.imageheight / mapManager.tSize.y)
            };
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    },

    draw(ctx) {
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {
                mapManager.draw(ctx);
            }, 100);
        } else {
            if (this.tLayer === null)
                for (var id = 0; id < this.mapData.layers.length; id++) {
                    var layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            for (var i = 0; i < this.tLayer.data.length; i++) {
                if (this.tLayer.data[i] !== 0) {
                    var tile = this.getTile(this.tLayer.data[i]);
                    var pX = (i % this.xCount) * this.tSize.x;
                    var pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if(!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    },

    isVisible(x, y, width, height) {
        if (x + width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h)
            return false;
        return true;
    },

    getTile(tileIndex) {
        var tile = {
            img: null,
            px: 0, py: 0
        };
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        var id = tileIndex - tileset.firstgid;
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile;
    },

    getTileset(tileIndex) {
        for (var i = mapManager.tilesets.length - 1; i >= 0; i--)
            if (mapManager.tilesets[i].firstgid <= tileIndex) {
                return mapManager.tilesets[i];
            }
        return null;
    },

    parseEntities(){
    if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
        setTimeout(function () { mapManager.parseEntities(); }, 100);
    } else
        for (var j = 0; j < this.mapData.layers.length; j++)
            if(this.mapData.layers[j].type === 'objectgroup') {
                var entities = this.mapData.layers[j];
                for (var i = 0; i < entities.objects.length; i++) {
                    var e = entities.objects[i];
                    try {
                        var obj = Object.create(gameManager.factory[e.type]);
                        obj.name = e.name;
                        obj.pos_x = e.x;
                        obj.pos_y = e.y;
                        obj.size_x = e.width;
                        obj.size_y = e.height;

                        gameManager.entities.push(obj);
                        if(obj.name === "Player"){
                            gameManager.initPlayer(obj);
                        }

                    } catch (ex) {
                        console.log("Error while creating: [" + e.gid + "] " + e.type +
                            ", " + ex);
                    }
                }
            }
    },
    reset: function (){
        this.mapData = null;
        this.tLayer = null;
        this.oLayer = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = {x: 64, y: 64};
        this.mapSize = {x: 64, y: 64};
        this.tilesets = [];
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        this.view = {x: 0, y: 0, w: 1344, h: 704};
        //console.log(this);
    },
    getTilesetIdx(x, y){
        var wX = x;
        var wY = y;
        var idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return this.tLayer.data[idx];
    },

    centerAt(x, y) {
        if(x < this.view.w / 2)
            this.view.x = 0;
        else
        if(x > this.mapSize.x - this.view.w / 2)
            this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x - (this.view.w / 2);
        if(y < this.view.h / 2)
            this.view.y = 0;
        else
        if(y > this.mapSize.y - this.view.h / 2)
            this.view.y = this.mapSize.y - this.view.h;
        else
            this.view.y = y - (this.view.h / 2);
    },
    showRecords(){
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'black';
        ctx.font = '30px "Courier New"';
        let record = [];
        for(let key in localStorage){
            if(localStorage.getItem(key) != null && key !== "gamer_name"){
                record.push([key, parseInt(localStorage.getItem(key))]);
            }
        }
        ctx.fillText("Таблица Рекордов", 1500, 0);
        record.sort(this.compare);
        for(let i = 0; i < 10; i++){
            if(i > record.length - 1){
                break;
            }
            ctx.fillText(String(i + 1) + ". " + record[i][0] + ": " + record[i][1], 1500, (i + 1) * 50);
        }
    },

    compare(a, b){
        if (a[1] > b[1]) {
            return -1;
        }
        if (a[1] < b [1]) {
            return 1;
        }
        return 0;
    }
}

