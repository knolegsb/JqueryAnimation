(function (ns) {
    ns.PieChart = function (id, title, data) {
        var pieChart = $('#' + id);

        var slices;
        var centerX = 150;
        var centerY = 150;
        var radius = 100;

        var createSlices = function (data) {
            slices = [];
            var startAngle = 0;
            for (var i = 0; i < data.length; i++) {
                var slice = data[i];
                slices.push(slice);
                slice.canvas = $('<canvas class="pieSlice" width="300px" height="300px"></canvas>');
                pieChart.append(slice.canvas);

                slice.canvas.click(function (event) {
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

            alert('selected: ' + slice.title);
        }

        var getAngleFromXY = function (x, y) {
            var deltaY = y - centerY;
            var deltaX = x - centerX;
            return Math.atan2(deltaY, deltaX);
        };

        createSlices(data);
    };
})(window.PS = window.PS || {});