 /*
 * jquery.widgrid
 * by Alexandre Piel
 * email: alexandre (dot) piel (at) gmail (dot) com
 * 
 */
(function ($) {     
    var Widgrid = function (target, options) {
        var defaults = {
            widgets: [],
            columns: 6,
            rows: 4,
            dropClass: 'widgrid-drop',
            validClass: 'widgrid-valid-drop',
            hoverClass: 'widgrid-drop-hover',
            usedClass: 'widgrid-used-drop',
            resizeClass: 'widgrid-resize-over',
            opacity: .75,
            removeWidget: function(widget) { return widget; },
            addWidget: function(widget) { return widget; },
        };
        this.target = $(target);
        this.options = $.extend(defaults, options);
        this.init();
    };
    Widgrid.prototype = {
        dropTimer: null,
        dropWidth: 0,
        dropHeight: 0,
        dropElmts: [],
        dropElmtsGrid: [],
        
        init: function () { 
            var me = this;
            this.addDropArea();
            this.calcDropSize(); 
            this.setDroppable();
            this.initWidgets();
            this.target.on('click', 'a[href=#removeWidget]', function() {
                me.removeWidget($(this).parent()); 
                return false; 
            });
        },
        initWidgets: function() {
            var me = this;
            $.each(me.options.widgets, function() {
                var widget = me.addWidget(this.widget);
                for(var r = this.position.row; r<this.position.row+this.dimension.rows; r++) {
                    for(var c = this.position.col; c<this.position.col+this.dimension.cols; c++) {
                        var drop = me.dropElmtsGrid[r][c]; //me.target.find('div[row='+r+'][column='+c+']'); // this is not fine, we need a tree this.dropElmts
                        drop.addClass(me.options.validClass);
                        me.validDrop(widget, drop);
                    }
                }
            });
        },
        addDropArea: function() {
            for (var r = 0; r < this.options.rows; r++) {
                this.dropElmtsGrid[r] = [];
                for (var c = 0; c < this.options.columns; c++) {
                    var drop = $(this.getDropElement(r, c));
                    drop.addClass(this.options.dropClass)
                        .css('float', 'left')
                        .data('position', {row: r, col: c})
                        .appendTo(this.target);
                    this.dropElmtsGrid[r][c] = drop;
                }                
            }
            this.dropElmts = this.target.find("." + this.options.dropClass);
        },
        getDropElement: function(row, col) {
            return '<div row="'+row+'" column="'+col+'"></div>';
        },
        calcDropSize: function() {
            this.dropWidth = Math.floor((this.target.innerWidth()-(this.dropElmts.outerWidth(true)*this.options.columns))/this.options.columns);
            this.dropElmts.width(this.dropWidth);
            this.dropHeight = Math.floor((this.target.innerHeight()-(this.dropElmts.outerHeight(true)*this.options.rows))/this.options.rows);
            this.dropElmts.height(this.dropHeight);
        },
        setDroppable: function() {
            var me = this;
            this.dropElmts.droppable({
                hoverClass: me.options.hoverClass,
                tolerance: "touch",
                drop: function(event, ui) {
                    if ($(this).hasClass(me.options.validClass)) {
                        var widget = me.addWidget($(ui.draggable));
                        me.validDrop(widget, this);
                    }
                },
                over: function( event, ui ) {
                    clearTimeout(me.dropTimer);
                    me.dropTimer = setTimeout(function() { me.dropOver($(ui.draggable), '.' + me.options.hoverClass); }, 10);
                },
                out: function( event, ui ) {
                    clearTimeout(me.dropTimer);
                    me.dropTimer = setTimeout(function() { me.dropOver($(ui.draggable), '.' + me.options.hoverClass); }, 10);
                }
            });
        },
        validDrop: function(widget, dropElmt) {
            var posParent = $(dropElmt).parent().offset();
            var pos = $(dropElmt).offset();
            var top = pos.top - posParent.top;
            var left = pos.left - posParent.left;
            if (!widget.data('leftopset')) {
                widget.parent().css({ marginTop: top, marginLeft: left });
                widget.css({ top: 0, left: 0 });
                widget.data('leftopset', {top: top, left: left});
                widget.data('droppables', []);
                widget.data('position', $(dropElmt).data('position'));
            }
            widget.css({ height: top - widget.data('leftopset').top + $(dropElmt).innerHeight() });
            widget.css({ width: left - widget.data('leftopset').left + $(dropElmt).innerWidth() });
            //$(dropElmt).droppable( "disable" );
            $(dropElmt).addClass(this.options.usedClass);
            widget.data('droppables').push(dropElmt);
            $(dropElmt).removeClass(this.options.validClass);
        },
        dropOver: function(widget, identifier) {
            var free = [], cntRow = 0, cntCol = 0;
            this.dropElmts.removeClass(this.options.validClass);
            this.target.find(identifier).not('.' + this.options.usedClass).each(function() {
                var row = $(this).attr('row'); 
                if (typeof free[row] == 'undefined') free[row] = [];
                free[row][$(this).attr('column')] = this;
            });
            var first = 0; for(first in free) break;
            for(var col in free[first]) {
                col = parseInt(col);
                cntCol++;
                if (typeof free[first][col+1] == 'undefined') {
                    free[first].splice(col+1);
                    break;
                }
            }
            for(var col in free[first]) {
                for(var row in free) {
                    if (row !== first && typeof free[row][col] == 'undefined') {
                        free.splice(row);
                    }
                }
            }
            for(var row in free) {
                cntRow++;
                for(var col in free[row]) {
                    if (typeof free[first][col] == 'undefined') delete free[row][col];
                    else $(free[row][col]).addClass(this.options.validClass);
                }
            }
            widget.data('dimension', {'rows': cntRow, 'cols': cntCol});
        },
        removeWidget: function(widget) {
            widget = this.options.removeWidget(widget);
            this.resetDrop(widget);
            widget.parent().remove();
        },
        getCloseElement: function() {
            return '<a class="close" href="#removeWidget">&times;</a>';
        },
        addWidget: function(widget) {
            widget = this.options.addWidget(widget);
            if (widget.parent().parent().get(0) !== this.target.get(0)) {
                this.setWidgetResizable(widget);
                this.setWidgetDraggable(widget);
                widget.prepend(this.getCloseElement());
                $('<div></div>').append(widget).css('position', 'absolute') // Add a div element because of bug with draggable and margin
                        .appendTo(this.target);
            }
            return widget;
        },
        setWidgetDraggable: function(widget) {
            var me = this;
            widget.draggable(); // For cloned widget
            widget.draggable("destroy");
            widget.draggable({ 
                revert: true, 
                zIndex: 100, 
                opacity: me.options.opacity, 
                start: function( event, ui ) {
                    widget.data('leftopset', null);
                    me.resetDrop(widget);
                },
            });
        },
        setWidgetResizable: function(widget) {
            var me = this;
            widget.resizable({ 
                minWidth: this.dropWidth, 
                minHeight: this.dropHeight,
                start: function( event, ui ) {
                    widget.css('opacity', me.options.opacity);
                    widget.css('zIndex', 200);
                    me.resetDrop(widget);
                },
                resize: function( event, ui ) {
                    $('.' + me.options.resizeClass).removeClass(me.options.resizeClass);
                    me.dropElmts.not('.ui-droppable-disabled').each(function() { 
                        if (me.overlaps(widget, this)) {
                            $(this).addClass(me.options.resizeClass);
                        }
                    }); 
                    me.dropOver(widget, '.' + me.options.resizeClass);
                },
                stop: function( event, ui ) { 
                    widget.css('opacity', 1);
                    widget.css('zIndex', 0);
                    me.target.find("." + me.options.validClass).each(function () {
                        me.validDrop(widget, this);
                    });
                    $('.' + me.options.resizeClass).removeClass(me.options.resizeClass);
                }
            });
        },
        resetDrop: function(widget) {
            var me = this;
            $.each(widget.data('droppables'), function(k, droppable) { 
                //$(droppable).droppable( "enable" ); 
                $(droppable).removeClass(me.options.usedClass);
            });
            widget.data('droppables', []);
        },
        overlaps: (function () {
            function getPositions( elem ) {
                var pos, width, height;
                pos = $( elem ).offset();
                width = $( elem ).width();
                height = $( elem ).height();
                return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
            }

            function comparePositions( p1, p2 ) {
                var r1, r2;
                r1 = p1[0] < p2[0] ? p1 : p2;
                r2 = p1[0] < p2[0] ? p2 : p1;
                return r1[1] > r2[0] || r1[0] === r2[0];
            }

            return function ( a, b ) {
                var pos1 = getPositions( a ),
                    pos2 = getPositions( b );
                return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
            };
        })(),
    };
    
    $.fn.Widgrid = function (options) {
        new Widgrid(this, options);
    };
}(jQuery));
