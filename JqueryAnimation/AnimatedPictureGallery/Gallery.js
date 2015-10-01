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
        });
    }
}(window.PS = window.PS || {}));