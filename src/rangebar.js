;(function($) {
        var pluginName = 'RangeBar';

    function Plugin(element, options) {
        var el = element;
        var $el = $(element);

        options = $.extend(
            {
                name : 'rangebar',
                min: 0,
                max: 1,
                range: {
                    from: 0.2,
                    to: 0.8
                },
                movablePoint: 0.4, // or false
                showTextPoint: true,
                // fixedPoints: [ 0.1, 0.7 ], OR 
                fixedPoints: [ 
                    {
                        value: 0.1,
                        css: {
                            'border-top': '14px solid rgb(0, 108, 255)'
                        }
                    },
                    {
                        value: 0.7,
                        css: {
                            'border-top': '14px solid rgb(0, 255, 108)'
                        }
                    }
                ],
                css: {
                    bar: {
                        'width': '100%',
                        'height': '15px',
                    },
                    extremes: {
                        'background-color': 'rgb(130, 213, 255)'
                    },
                    center: {
                        'background-color': 'rgb(145, 145, 145)'
                    },
                    movablePoint: {
                        'width': 0,
                        'height': 0,
                        'border-left': '7px solid transparent',
                        'border-right': '7px solid transparent',
                        'border-top': '14px solid #008F3E',
                        'margin': '1px 15px 0 0',
                        'top'   : '-20px',
                        'cursor': 'pointer',
                        'z-index': '100'
                    },
                    fixedPoints: {
                        'width': 0,
                        'height': 0,
                        'border-left': '7px solid transparent',
                        'border-right': '7px solid transparent',
                        'border-top': '14px solid rgb(0, 108, 255)',
                        'margin': '1px 15px 0 0',
                        'top'   : '-20px'
                    },
                    zone: {
                        'float': 'left',
                        'text-align': 'center',
                        'height': '35px',
                        // 'position': 'absolute',
                        'top': '15px',
                    },
                    chart: {
                        'height' : '250px'
                    }
                },
                zones : [
                    {
                        from: 0,
                        to : 0.15,
                        text : 'Sicherheit',
                        color: 'rgba(255, 240, 0, 1)'
                    },
                    {
                        from: 0.15,
                        to : 0.3,
                        text : 'Ertrag',
                        color: 'rgba(255, 220, 0, 1)'
                    },
                    {
                        from: 0.3,
                        to : 0.55,
                        text : 'wachstum',
                        color: 'rgba(255, 200, 0, 1)'
                    },
                    {
                        from: 0.55,
                        to : 0.8,
                        text : 'Chancen',
                        color: 'rgba(255, 180, 0, 1)'
                    },
                    {
                        from: 0.8,
                        to : 1,
                        text : 'Spekilativ',
                        color: 'rgba(255, 160, 0, 1)'
                    }
                ],
                chart : [
                    {
                        data : [[0.099277436,0.1983005],[0.110842508,0.216456586],[0.310842508,0.416456586],[0.410842508,0.516456586],[0.610842508,0.716456586]]
                    },
                    {
                        type:'scatter',
                        color:'#000000',
                        marker: {
                            radius:9, 
                            symbol:"diamond"
                        },
                        name:'',
                        data: [[0.5, 0.5]]
                    }
                ]
            }, 
            $.fn[pluginName].defaults, 
            options);

        function init() {
            // var options = this.options;

            // Matematical % slices
            var parts = [{
                width : Math.round( ((options.range.from - options.min) * 100) / (options.max - options.min) )+'%',
                radius: '5px 0 0 5px'
            },{
                width : Math.round( ((options.range.to - options.range.from) * 100) / (options.max - options.min) )+'%',
                radius: '5px 5px 5px 5px'
            },{
                width : Math.round( ((options.max - options.range.to) * 100 ) / (options.max - options.min) )+'%',
                radius: '0 5px 5px 0'
            }]


            // Create a wrapper
            var wraper = $el.append( '<div id="'+options.name+'" style="position: relative; margin-left:10px; margin-right:10px;"></div>' ).children();
            // Create the point
            var point = wraper.append('<div class="point"></div>').children();
            // Create the point text
            if (options.movablePoint && options.showTextPoint)
                var pointText = point.append('<div style="position: absolute; top: -40px; left: -7px;">'+options.movablePoint+'</div>').children();
            // Create the fixed Points
            var fixedPoints = [];
            $.each(options.fixedPoints, function (index, item) {
                fixedPoints.push( wraper.append('<div class="fixedpoint"></div>').children().last() );
            })
            // Create the bar slices
            var bar = wraper.append('<div class="bar"></div>').children('.bar');
            var extreme1 = bar.append('<div id="'+options.name+'_extreme1"></div>').children('#'+options.name+'_extreme1');
            var centralPart = bar.append('<div id="'+options.name+'_centralPart"></div>').children('#'+options.name+'_centralPart');
            var extreme2 = bar.append('<div id="'+options.name+'_extreme2"></div>').children('#'+options.name+'_extreme2');
            // Create background zones
            var divZones = wraper.append('<div class="divzones"></div>').children().last()
            var zones = [];
            $.each(options.zones, function (index, zone) {
                zones.push( divZones.append('<div class="zone">'+zone.text+'</div>').children().last() );
            });

            // Append stile
            $.each(options.css.bar, function (index, item) {
                bar.children().css(index, item);
            })

            extreme1.css('width',parts[0].width).css('float','left').css('border-radius',parts[0].radius);
            extreme2.css('width',parts[2].width).css('float','left').css('border-radius',parts[2].radius);
            $.each(options.css.extremes, function (index, item) {
                extreme1.css(index, item);
                extreme2.css(index, item);
            });
            centralPart.css('width',parts[1].width).css('float','left');
            if (options.range.from == options.min & options.range.to == options.max)
                centralPart.css('border-radius',parts[1].radius);
            $.each(options.css.center, function (prop, val) {
                centralPart.css(prop, val);
            });

            $.each(zones, function (index, zone) {
                var from = (options.zones[index].from * 100) / (options.max - options.min);
                var to = (options.zones[index].to * 100) / (options.max - options.min);
                var width = (to-from)+'%'
                zone.css('width', width);
                zone.css('background-color', options.zones[index].color);

                var left = 0;
                if(index > 0)
                    for (var i = 0; i < index; i++) {
                        left += zones[i].width();
                    };
                zone.css('left', left);
                
                $.each(options.css.zone, function (prop, val) {
                    zone.css(prop, val);
                });
            });

            // Matematical % point
            // var totalWidth = this.width();
            if( options.movablePoint ){
                var positionPoint = ((options.movablePoint * 98) / (options.max - options.min))+'%'; // if 100% out of bar range
                point
                    .css('position', 'absolute')
                    .css('left', positionPoint)
                    .css('top', options.css.movablePoint.top)
                $.each(options.css.movablePoint, function (prop, val) {
                    point.css(prop, val);
                });
            }

            $.each(options.fixedPoints, function (index, item) {
                var positionPoint = 0;
                if ( isNaN(item) )
                    positionPoint = ((item.value * 98) / (options.max - options.min))+'%'; // if 100% out of bar range
                else
                    positionPoint = ((item * 98) / (options.max - options.min))+'%'; // if 100% out of bar range
                fixedPoints[index]
                    .css('position', 'absolute')
                    .css('left', positionPoint)
                    .css('top', options.css.fixedPoints.top)
                $.each(options.css.fixedPoints, function (prop, val) {
                    fixedPoints[index].css(prop, val);
                })
                if ( isNaN(item) )
                    $.each(item.css, function (prop, val) {
                        fixedPoints[index].css(prop, val);
                    })
            });


            if( options.movablePoint ){
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
                        var minLeft = extreme1.width() - (pointWidth/5);
                        newLeft = newLeft < minLeft ? minLeft : newLeft > maxLeft ? maxLeft : newLeft;
                        point.css('left', newLeft );

                        // Update the point value
                        var newPointPos = (newLeft * options.range.to) / maxLeft;
                            newPointPos = newPointPos >= 0 ? newPointPos : 0;
                        options.movablePoint = newPointPos;
                        $('.point>div').html(newPointPos.toFixed(2));
                    }
                }).mouseup(function(ev) {
                    dragging = false;
                });
            }

            if( options.chart ){
                var chartDiv = $el.prepend('<div class="chartDiv"></div>').children().get(0);
                $.each(options.css.chart, function (prop, val) {
                    $(chartDiv).css(prop, val);
                });
                createChart(chartDiv, options.zones, options.chart)
            }

            hook('onInit');
        }

        function getPoint() {
          return options.movablePoint;
        }

        function option (key, val) {
          if (val) {
            options[key] = val;
          } else {
            return options[key];
          }
        }

        function destroy() {
          $el.each(function() {
            var el = this;
            var $el = $(this);

            // Add code to restore the element to its original state...

            hook('onDestroy');
            $el.removeData('plugin_' + pluginName);
          });
        }

        function hook(hookName) {
          if (options[hookName] !== undefined) {
            options[hookName].call(el);
          }
        }

        function createChart (container, risikoZones, data) {
            $(container).highcharts({
                credits: false,
                title : false,
                chart : {
                    type: 'spline'
                },
                xAxis: {
                    title: false,
                    labels: {
                        enabled: false
                    },
                    plotBands : risikoZones,
                    min: 0,
                    max: 1
                },                   
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    title: false,
                    min: 0,
                    max: 1
                },
                tooltip: {
                    enabled: false
                },
                legend: {
                    enabled:false
                },
                plotOptions: {
                    spline: {
                        marker: { 
                            enabled: false 
                        },
                        shadow: true
                    }
                },
                series : data
            });
        }

        init();

        return {
          option: option,
          destroy: destroy,
          getPoint: getPoint
        };
    }

    $.fn[pluginName] = function(options) {
        if (typeof arguments[0] === 'string') {
          var methodName = arguments[0];
          var args = Array.prototype.slice.call(arguments, 1);
          var returnVal;
          this.each(function() {
            if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
              returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
            } else {
              throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
            }
          });
          if (returnVal !== undefined){
            return returnVal;
          } else {
            return this;
          }
        } else if (typeof options === "object" || !options) {
          return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
              $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
          });
        }
    };

    $.fn[pluginName].defaults = {
        onInit: function() {},
        onDestroy: function() {}
    };

})(jQuery);
