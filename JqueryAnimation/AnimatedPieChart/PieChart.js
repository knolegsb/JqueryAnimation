﻿(function (ns) {
    ns.PieChart = function (id, title, data) {
        var pieChart = $('#' + id);

        var slices;
        var centerX = 150;
        var centerY = 150;
        var radius = 100;
        var currentRotationAngle = 0;
        var targetAngle;
        var animationState;
        var selectedSlice;
        var nextSelectedSlice;
        var nextTargetAngle;
        var isAnimating = false;

        var heading = $('<div>' +
                        '   <h3>' + title + '</h3>' +
                        '   <h4></h4>' +
                        '</div>');
        pieChart.append(heading);

        var percentSpan = $('<span class="percentSpan"></span>');
        pieChart.append(percentSpan);
        percentSpan.css({
            'left': centerX - 32,
            'top': centerY - 25,
            'z-index': 1000,
            'opacity': 0
        });

        var createSlices = function (data) {
            slices = [];
            var startAngle = 0;
            for (var i = 0; i < data.length; i++) {
                var slice = data[i];
                slices.push(slice);
                slice.canvas = $('<canvas class="pieSlice" width="300px" height="300px"></canvas>');
                pieChart.append(slice.canvas);

                slice.canvas.click(function (event) {
                    if (isAnimating) return;
                    handlePieClick(event.offsetX, event.offsetY);
                });

                var c = slice.canvas[0];
                var context = c.getContext('2d');
                context.beginPath();
                context.moveTo(centerX, centerY);

                context.arc(centerX, centerY, radius, startAngle, startAngle + (slice.pct / 100) * Math.PI * 2, false);
                context.lineTo(centerX, centerY);

                context.fillStyle = slice.color;
                context.fill();

                context.lineWidth = 1;
                context.strokeStyle = 'black';
                context.stroke();

                startAngle = startAngle + (slice.pct / 100) * Math.PI * 2;
            }
        };

        var setState = function (newState) {
            animationState = newState;
            switch (animationState) {
                case 'StateIdle':
                    isAnimating = false;
                    break;
                case 'StateRotating':
                    rotateSlices(targetAngle);
                    isAnimating = true;
                    break;
                case 'StateSeparating':
                    separateSlice();
                    isAnimating = true;
                    percentSpan.text(selectedSlice.pct + '%');
                    heading.find('h4').text(selectedSlice.title);
                    break;
                case 'StateSeparated':
                    isAnimating = false;
                    percentSpan.animate({ 'opacity': 1 }, 300);
                    break;
                case 'StateJoining':
                    joinSlice();
                    percentSpan.animate({ 'opacity': 0 }, 300);
                    heading.find('h4').text('');
                    isAnimating = true;
                    break;
            }
        };

        var rotateSlices = function (destAngle) {
            $({ a: currentRotationAngle }).animate({ a: destAngle },
                {
                    duration: 800,
                    easing: 'easeInOutBack',
                    step: function (now, fx) {
                        for (var i = 0; i < slices.length; i++) {
                            slices[i].canvas.css('transform', 'rotate(' + now + 'rad)');
                            slices[i].canvas.data('rotate', now);
                        }
                    },
                    complete: function () {
                        currentRotationAngle = destAngle;
                        setState('StateSeparating');
                    }
                });
        };

        var separateSlice = function () {
            selectedSlice.canvas.css('textIndent', 1);
            selectedSlice.canvas.animate({ 'top': 100, 'textIndent': 1.5 },
                {
                    duration: 1000,
                    easing: 'easeOutElastic',
                    step: function (now, fx) {
                        if (fx.prop === 'textIndent') {
                            selectedSlice.canvas.css('transform', 'rotate(' + selectedSlice.canvas.data('rotate') + 'rad)scale(' + now + ')');
                        }
                    },
                    complete: function () {
                        setState('StateSeparated');
                    }
                });
        };

        var joinSlice = function () {
            selectedSlice.canvas.css('textIndent', 1.5);
            selectedSlice.canvas.animate({ 'top': 200, 'textIndent': 1 },
                {
                    duration: 500,
                    easing: 'easeOutBounce',
                    step: function (now, fx) {
                        if (fx.prop === 'textIndent') {
                            selectedSlice.canvas.css('transform', 'rotate(' + selectedSlice.canvas.data('rotate') + 'rad) scale(' + now + ')');
                        }
                    },
                    complete: function () {
                        if (nextSelectedSlice == null) {
                            setState('StateIdle');
                            selectedSlice = null;
                        }
                        else {
                            selectedSlice = nextSelectedSlice;
                            targetAngle = nextTargetAngle;
                            nextSelectedSlice = null;

                            setState('StateRotating');
                        }
                    }
                });
        };

        var handlePieClick = function (x, y) {
            var a = getAngleFromXY(x, y);
            if (a < 0)
                a += 2 * Math.PI;

            var first = 0;
            var last = first;
            for (var i = 0; i < slices.length; i++) {
                var slice = slices[i];
                last = first + (slice.pct / 100) * Math.PI * 2;
                if (last > Math.PI * 2) {
                    if (a > first || a < last - (Math.PI * 2))
                        break;
                }
                else if (a >= first && a <= last)
                    break;
                first = last;
                if (first > Math.PI * 2)
                    first -= Math.PI * 2;
            }

            if (slice == selectedSlice) {
                nextSelectedSlice = null;
                setState('StateJoining');
                return;
            }

            //alert('selected: ' + slice.title);

            var tAngle = 1.5 * Math.PI - (last - first) / 2.0;
            var destAngle = tAngle - first;
            if (destAngle < 0) destAngle += Math.PI * 2;

            if (animationState == 'StateSeparated') {
                nextSelectedSlice = slice;
                nextTargetAngle = destAngle;
                setState('StateJoining');
            }
            else {
                selectedSlice = slice;
                targetAngle = destAngle;
                setState('StateRotating');
            }
            //rotateSlices(destAngle);
            //setState('StateRotating');
        }        

        var getAngleFromXY = function (x, y) {
            var deltaY = y - centerY;
            var deltaX = x - centerX;
            return Math.atan2(deltaY, deltaX);
        };

        createSlices(data);
        setState('StateIdle');
    };
})(window.PS = window.PS || {});