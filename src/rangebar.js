(function( $ ) {
 
    $.fn.rangebar = function( options ) {
        var opts = $.extend({
            name : 'rangebar',
            min: 0,
            max: 100,
            rangeFrom: 20,
            rangeTo: 80,
            point: 50,
            css: {
                bar: {
                    width: '100%',
                    height: '15px'
                },
                extremes: {
                    'background-color': '#149bdf'
                },
                center: {
                    'background-color': '#000'
                },
                point: {
                    'width': 0,
                    'height': 0,
                    'border-left': '7px solid transparent',
                    'border-right': '7px solid transparent',
                    'border-top': '14px solid #008F3E',
                    'margin': '1px 15px 0 0',
                    'top'   : '-20px'
                }
            },
            showTextPoint: true
        }, options );

        // Matematical % slices
        var parts = [{
            width : Math.round( ((opts.rangeFrom - opts.min) * 100) / (opts.max - opts.min) )+'%',
            radius: '5px 0 0 5px'
        },{
            width : Math.round( ((opts.rangeTo - opts.rangeFrom) * 100) / (opts.max - opts.min) )+'%'
        },{
            width : Math.round( ((opts.max - opts.rangeTo) * 100 ) / (opts.max - opts.min) )+'%',
            radius: '0 5px 5px 0'
        }]
        
        // Matematical % point
        // var totalWidth = this.width();
        var positionPoint = ((opts.point * 100) / (opts.max - opts.min))+'%';

        // Create a wrapper
        var wraper = this.append( '<div id="'+opts.name+'" style="position: relative;"></div>' ).children();
        // Create the point
        var point = wraper.append('<div class="point"></div>').children();
        // Create the point text
        if (opts.showTextPoint)
            var pointText = point.append('<div style="position: absolute; top: -40px; left: -7px;">'+opts.point+'</div>').children();
        // Create the slices
        var bar = wraper.append('<div class="bar"></div>').children('.bar');
        var extreme1 = bar.append('<div id="'+opts.name+'_extreme1"></div>').children('#'+opts.name+'_extreme1');
        var centralPart = bar.append('<div id="'+opts.name+'_centralPart"></div>').children('#'+opts.name+'_centralPart');
        var extreme2 = bar.append('<div id="'+opts.name+'_extreme2"></div>').children('#'+opts.name+'_extreme2');

        // Append stile
        $.each(opts.css.bar, function (index, item) {
            bar.children().css(index, item);
        })
        extreme1.css('width',parts[0].width).css('float','left').css('border-radius',parts[0].radius);
        extreme2.css('width',parts[2].width).css('float','left').css('border-radius',parts[2].radius);
        $.each(opts.css.extremes, function (index, item) {
            extreme1.css(index, item);
            extreme2.css(index, item);
        })
        centralPart.css('width',parts[1].width).css('float','left');
        $.each(opts.css.center, function (index, item) {
            centralPart.css(index, item);
        })
        point
            .css('position', 'absolute')
            .css('left', positionPoint)
            .css('top', opts.css.point.top)
        $.each(opts.css.point, function (index, item) {
            point.css(index, item);
        })


        var dragging = false;
        var startX = 0;
        var startT = 0;
        
        // event point
        point.mousedown(function(ev) {
            dragging = true;
            startX = ev.clientX;
            startT = point.css('left');
        });

        $(window).mousemove(function(ev) {
            if (dragging) {
                // calculate new top
                var newLeft = parseInt(startT) + (ev.clientX - startX);
                
                //stay in parent
                var pointWidth = parseInt($(point).css('border-top-width'));
                var maxLeft = centralPart.width() + extreme1.width() - (pointWidth/2);
                var minLeft = extreme1.width() - (pointWidth/2);
                newLeft = newLeft < minLeft ? minLeft : newLeft > maxLeft ? maxLeft : newLeft;
                point.css('left', newLeft );
            }
        }).mouseup(function() {
            dragging = false;
        });

        return this;
    };
 
}( jQuery ));