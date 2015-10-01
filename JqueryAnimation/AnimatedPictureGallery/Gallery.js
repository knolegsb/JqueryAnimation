(function (ns) {
    ns.Gallery = function (id) {
        var gallery = $('#' + id);
        var images = gallery.find('.galleryImage');

        var xPos = 50;
        var yPos = 50;
        var gWidth = gallery.width();

        images.each(function (idx, el) {
            var img = $(el);
            img.data('homeX', xPos);
            img.data('homeY', yPos);
            img.data('currentScale', 1);
            img.css({
                'left': xPos,
                'top': yPos,
                'width': img.width() * 0.25
            });
            xPos += 95;
            if (xPos > gWidth - 100) {
                xPos = 50;
                yPos += 115;
            }

            img.hover(
                function (event) {
                    var target = $(event.target);
                    brignImageToTop(target);
                    animateImage(target, 500, target.data('homeX'), target.data('homeY'), 2);
                },
                function (event) {
                    returnAllToNormal();
                }
            );
        });

        var brignImageToTop = function (img) {
            images.each(function (idx, el) {
                $(el).css('z-index', 0);
            });
            img.css('z-index', 1);
        }

        var returnAllToNormal = function () {
            images.each(function (idx, el) {
                var img = $(el);
                animateImage(img, 500, img.data('homeX'), img.data('homeY'), 1);
            });
        }

        var animateImage = function (img, duration, left, top, scale) {
            img.stop();
            img.css('textIndent', img.data('currentScale'));
            img.animate({
                'left': left,
                'top': top,
                'textIndent': scale,
            },
            {
                duration: duration,
                step: function (now, fx) {
                    if (fx.prop === 'textIndent') {
                        img.data('currentScale', now);
                        img.css('transform', 'scale(' + now + ')');
                    }
                    else if (fx.prop === 'left')
                        img.css('left', now);
                    else if (fx.prop === 'top')
                        img.css('top', now);
                }
            });
        }
    }
}(window.PS = window.PS || {}));