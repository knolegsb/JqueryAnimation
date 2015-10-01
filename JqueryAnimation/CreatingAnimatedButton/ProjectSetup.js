(function (ns) {
    ns.BuyNowButton = function (id, cb) {

        var b = $("#" + id);
        var callback = cb;

        setInterval(function () {
            $({ xval: -30 }).animate({ xval: 300 },
                {
                    duration: 2000,
                    step: function (now) {
                        b.css('background', 'radial-gradient(circle 80px at ' + now + 'px 30px, #ffaaaa, red)')
                    }
                })
        }, 2000);

        b.hover(function () {
            $({
                scale: '1'
            }).animate({                
                scale: '1.1'
            }, {
                duration: 1000,
                easing: 'easeOutElastic',
                step: function (now, tween) {
                    b.css('transform', 'scale(' + now + ')');
                    b.children().css('transform', 'scale(' + now * 1.1 + ')');
                }
            });
        },
            function () {
                $({
                    scale: '1.1'
                }).animate({
                    scale: '1'
                }, {
                    duration: 1000,
                    easing: 'easeOutElastic',
                    step: function (now, tween) {
                        b.css('transform', 'scale(' + now + ')');
                        b.children().css('transform', 'scale(' + now * 1.1 + ')');
                    }
                });
            });

        b.click(function () {
            b.unbind('mouseenter mouseleave click');

            b.find('span').fadeOut(500);

            b.find('i').animate({ left: '235' }, 2000, 'easeOutBounce');

            $({ tilt: 0 }).animate({ tilt: 20 },
                {
                    duration: 1000,
                    step: function (tilt) {
                        b.css('transform', 'rotate(' + tilt + 'deg)');
                    },
                    complete: function(){
                        b.fadeOut(1000, function(){
                            callback();
                        });
                    }
                });
        });        
    }
}(window.PS = window.PS || {}));