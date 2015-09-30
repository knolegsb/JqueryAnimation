(function (ns) {
    ns.BuyNowButton = function (id) {

        var b = $("#" + id);

        setInterval(function () {
            $({ xval: -30 }).animate({ xval: 300 },
                {
                    duration: 2000,
                    step: function (now) {
                        b.css('background', 'radial-gradient(circle 80px at ' + now + 'px 30px, #ffaaaa, red)')
                    }
                })
        }, 2000);

    }
}(window.PS = window.PS || {}));