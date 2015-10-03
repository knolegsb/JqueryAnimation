(function (ns) {
    ns.Sprite = function (img) {
        this.image = $('<img class="sprite" src="' + img + '" />');
        this.x = 0;
        this.y = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.loops;

        this.update = function (time) {
            this.x += this.xSpeed * time;
            this.y += this.ySpeed * time;
            this.image[0].style.left = this.x + 'px';
            this.image[0].style.top = this.y + 'px';
            //this.image.css('left', this.x);
            //this.image.css('top', this.y);
        };
    };

    ns.GameSurface = function (id) {
        this.surface = $('#' + id);
        this.sprites = [];
        this.time;
        this.fps = 30;

        this.addSprite = function (s) {
            this.sprites.push(s);
            this.surface.append(s.image);
        };

        this.start = function () {
            var self = this;
            this.timer = setInterval(function () {
                for (var i = 0; i < self.sprites.length; i++) {
                    self.sprites[i].update(self.fps / 1000);
                }
            }, 1000 / this.fps);
        };

        var stop = function () {
            clearTimeout(this.timer);
        };
    };
})(window.PS = window.PS || {});