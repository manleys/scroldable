/*
 * Scroldable - JQuery Plugin
 *
 * Written by Adam Daly
 *
 * Version 0.2
 *
 * Log: 
 * 	Changes 0.2: No longer depends on jqueryUI, Vertical and Horizontal Scroll
 *	ToDo: Scroll on mousewheel
 */
 
 // the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "scroldable",
        defaults = {
            orientation: 'y',
			scrollHtml: '<div class="scroll-root"><div class="scroll"><div class="icon up"></div><div class="icon down"></div></div></div>',
			onScroll: function(){}
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
			
			console.log('scroldable');

			var that = this;

			var elementToScroll = this.element;
			$(elementToScroll).css('position', 'relative').css('overflow', 'hidden');
			
			var content = $(elementToScroll).html();
			
			$(elementToScroll).wrapInner('<div class="inner" style="position:absolute; top:0; left:0;" />');
			
			
			
			if(this.orientation === 'y'){
				
				if($(elementToScroll).height() >= $(elementToScroll).children('.inner').height()){
					$(elementToScroll).empty().html(content);
					return;
				}
			}else{
				
				if($(elementToScroll).width() >= $(elementToScroll).children('.inner').width()){
					$(elementToScroll).empty().html(content);
					return;
				}
			}
			
			var deltaMultiplier = (navigator.appName === 'Microsoft Internet Explorer') ? 10 : 1;
			
			if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch){
				
			}else{
				$(elementToScroll).on('mouseenter',//REMOVE WINDOW SCROLL WHEN THE MOUSE IS OVER SCROLLABLE ELEMENT
					function(e){
						
						window.onmousewheel = function(e){
							e.preventDefault();
						}
					
						$(elementToScroll).on('mouseleave',
							function(e){
								window.onmousewheel = null;
								$(elementToScroll).off('mouseleave');
							}
						);
					}
				);
				
				$(elementToScroll).append(this._defaults.scrollHtml);
				
				if(this.orientation === 'y'){
					
					$(elementToScroll).children('.scroll-root').height($(elementToScroll).height());					
					var scrollRatio = $(elementToScroll).height() / $(elementToScroll).children('.inner').height();					
					$(elementToScroll).children('.scroll-root').children('.scroll').height(parseInt($(elementToScroll).height() * scrollRatio));					
					var scrollDeltaY = $(elementToScroll).height() - $(elementToScroll).children('.scroll-root').children('.scroll').height();					
					var contentDeltaX = $(elementToScroll).children('.inner').height() - $(elementToScroll).height();
					
					$(elementToScroll).children('.scroll-root').children('.scroll').on('click',
					function(e){
							scrollStart = parseInt($(this).css('top'));
						}
					);	
									
				}else{
					
					$(elementToScroll).children('.scroll-root').width($(elementToScroll).width());
					var scrollRatio = $(elementToScroll).width() / $(elementToScroll).children('.inner').width();
					$(elementToScroll).children('.scroll-root').children('.scroll').width(parseInt($(elementToScroll).height() * scrollRatio));
					var scrollDeltaY = $(elementToScroll).width() - $(elementToScroll).children('.scroll-root').children('.scroll').width();
					var contentDeltaX = $(elementToScroll).children('.inner').width() - $(elementToScroll).width();
					
					$(elementToScroll).children('.scroll-root').children('.scroll').on('click',
						function(e){
							scrollStart = parseInt($(this).css('left'));
						}
					);	
				}
				
				
				var scrollCurrent;
				var scrollOffset;
				var scrollStart;
				
				var mouseCoordStart = {
					x: 0,
					y: 0
				}
								
				var mouseCoordDelta = {
					x: 0,
					y: 0
				}
				
				$(elementToScroll).children('.scroll-root').children('.scroll').on('mouseenter',
					function(e){
						scrollStart = parseInt($(this).css('top'));
						
						$(this).on('mousedown',
							function(e){
								
								$('body').css('-moz-user-select', 'none').css('-webkit-user-select', 'none').css('-ms-user-select', 'none').css('user-select', 'none');
						
								mouseCoordStart.x = e.pageX;
								mouseCoordStart.y = e.pageY;
								
								document.onselectstart = function() { return false; }
								$(document).on('mousemove',
									function(e){
										
										drag(e.pageX, e.pageY);
									}
								);
								
								$(document).on('mouseup',
									function(e){
										
										$('body').css('-moz-user-select', 'all').css('-webkit-user-select', 'all').css('-ms-user-select', 'text').css('user-select', 'all');
										document.onselectstart = function() { return true; }
										$(document).off('mousemove');
										$(document).off('mouseup');
									}
								);
							}
						);
						
						$('.scroll').on('mouseleave',
							function(e){
								$('.scroll').off('mouseleave');
								$('.scroll').off('mousedown');
							}
						)
					}
				);
				
				var contentDeltaX;
				var contentDeltaY;
				var scrollDeltaX;
				var scrollDeltaY;
				
				function drag(x, y){
					
					mouseCoordDelta.x = x - mouseCoordStart.x;
					mouseCoordDelta.y = y - mouseCoordStart.y;
					
					mouseCoordStart.x = x;
					mouseCoordStart.y = y;
					
					if(this.orientation === 'y'){
						$(elementToScroll).children('.scroll-root').children('.scroll').css('top', '+=' + mouseCoordDelta.y)
						
						if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('top')) < 0){
							$(elementToScroll).children('.scroll-root').children('.scroll').css('top', 0);
						}
						
						if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('top')) + $(elementToScroll).children('.scroll-root').children('.scroll').height() > $(elementToScroll).height()){
							$(elementToScroll).children('.scroll-root').children('.scroll').css('top', $(elementToScroll).height() - $(elementToScroll).children('.scroll-root').children('.scroll').height());
						}
						
						
						scrollDeltaY = (100 / ($(elementToScroll).height() - parseInt($(elementToScroll).children('.scroll-root').children('.scroll').height())) * parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('top')));
						
						contentDeltaY = $(elementToScroll).height() - $(elementToScroll).children('.inner').height();
						$(elementToScroll).children('.inner').css('top', 100 / contentDeltaY * scrollDeltaY);
						
					}else{
						$(elementToScroll).children('.scroll-root').children('.scroll').css('left', '+=' + mouseCoordDelta.x);
						
						if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('left')) < 0){
							$(elementToScroll).children('.scroll-root').children('.scroll').css('left', 0);
						}
						
						if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('left')) + $(elementToScroll).children('.scroll-root').children('.scroll').width() > $(elementToScroll).width()){
							$(elementToScroll).children('.scroll-root').children('.scroll').css('left', $(elementToScroll).width() - $(elementToScroll).children('.scroll-root').children('.scroll').width());
						}
						
						scrollDeltaX = (100 / ($(elementToScroll).width() - parseInt($(elementToScroll).children('.scroll-root').children('.scroll').width())) * parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('left')));
						
						$(elementToScroll).data({scrollDelta: scrollDeltaX});

						contentDeltaX = $(elementToScroll).width() - $(elementToScroll).children('.inner').width();

						$(elementToScroll).children('.inner').css('left', contentDeltaX / 100 * scrollDeltaX);
					}

					that.options.onScroll.call(that);
						
				}
			}

			$(elementToScroll).on('mousewheel',
				function(e){
					
					if('wheelDelta' in e.originalEvent){
						delta = e.originalEvent.wheelDelta * (Math.PI / 180) * deltaMultiplier;
					}else{
						delta = e.originalEvent.detail * -500 * (Math.PI / 180);
					}
					
					var scrollFrom = 'top';
					var scrollRatio = $(elementToScroll).height() / $(elementToScroll).children('.inner').height();
					var elementProperty = $(elementToScroll).height();
					var elementScrollProperty = $(elementToScroll).children('.scroll-root').children('.scroll').height();
					var contentDelta = $(elementToScroll).height() - $(elementToScroll).children('.inner').height();

					if(that.options.orientation === 'x'){
						scrollFrom = 'left';
						scrollRatio = $(elementToScroll).width() / $(elementToScroll).children('.inner').width();
						elementProperty = $(elementToScroll).width();
						elementScrollProperty = $(elementToScroll).children('.scroll-root').children('.scroll').width();
						contentDelta = $(elementToScroll).width() - $(elementToScroll).children('.inner').width();
					}

					$(elementToScroll).children('.scroll-root').children('.scroll').css(scrollFrom, '-=' + (delta * scrollRatio));
					
					if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css(scrollFrom)) >= elementProperty - elementScrollProperty){
						
						$(elementToScroll).children('.scroll-root').children('.scroll').css(scrollFrom, elementProperty - elementScrollProperty);
						
					}else if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css(scrollFrom)) <= 0){
						$(elementToScroll).children('.scroll-root').children('.scroll').css(scrollFrom, 0);
					}
				
					var scrollDelta = (100 / ($(elementToScroll).width() - parseInt(elementScrollProperty)) * parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css(scrollFrom)));
					
					$(elementToScroll).data({scrollDelta: scrollDelta});

					$(elementToScroll).children('.inner').css('left', contentDelta / 100 * scrollDelta);

					that.options.onScroll.call(that);
				}
			);

			var touchStart = 0;
			var touchCurrent = 0;
			var touchOffset = 0;
			var timer;

			$(elementToScroll).on('touchstart',
				function(e){
					
					$(elementToScroll).addClass('touchstart');
					clearInterval(timer);
					touchStart = e.originalEvent.touches[0].pageX;
				}
			);
			
			$(elementToScroll).on('touchend',
				function(e){
					timer = setInterval(function(){
						touchOffset = touchOffset / 1.25;
						scrollElement(touchOffset);
						
						if(Math.floor(Math.abs(touchOffset)) === 0){
							clearInterval(timer);
						}
					}, 25);
					$(elementToScroll).removeClass('touchstart').removeClass('touchmove');
				}
			);

			$(elementToScroll).on('touchmove',
				function(e){
					
					e.preventDefault();
					
					$(elementToScroll).addClass('touchmove');
					
					touchCurrent = e.originalEvent.touches[0].pageX;
					touchOffset = touchCurrent - touchStart;
					touchStart = touchCurrent;
					
					scrollElement(touchOffset);
				}
			);

			function scrollElement(delta){

				$(elementToScroll).children('.inner').css('left', '+=' + delta);
				
				if(parseInt($(elementToScroll).children('.inner').css('left')) <= $(elementToScroll).width() - $(elementToScroll).children('.inner').width()){
					$(elementToScroll).children('.inner').css('left', $(elementToScroll).width() - $(elementToScroll).children('.inner').width());
				}else if(parseInt($(elementToScroll).children('.inner').css('left')) >= 0){
					$(elementToScroll).children('.inner').css('left', 0);
				}
				
				var scrollDelta = Math.abs(100 / (parseInt($(elementToScroll).children('.inner').width()) - $(elementToScroll).width()) * parseInt($(elementToScroll).children('.inner').css('left')));

				$(elementToScroll).data({scrollDelta: scrollDelta});

				that.options.onScroll.call(that);
			}
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn['scroldable'] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );

/*

jQuery.fn.scroldable = function(options) {
	
	console.log('scroldable');
	
	var options = $.extend({
		'scrollHtml': '<div class="scroll-root"><div class="scroll"><div class="icon up"></div><div class="icon down"></div></div></div>'
	}, options);
	
	var elementToScroll = $(this);
	$(elementToScroll).css('position', 'relative').css('overflow', 'hidden');
	
	var content = $(elementToScroll).html();
	$(elementToScroll).wrapInner('<div class="inner" style="position:absolute; top:0; left:0;" />');
	
	if($(elementToScroll).height() >= $(elementToScroll).children('.inner').height()){
		$(elementToScroll).empty().html(content);
		return;
	}
	
	var deltaMultiplier = (navigator.appName === 'Microsoft Internet Explorer') ? 10 : 1;

	if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch){
		
	}else{
		$(elementToScroll).on('mouseenter',//REMOVE WINDOW SCROLL WHEN THE MOUSE IS OVER THE CENTER COLUMN
			function(){
				$('#window').off('mousewheel');
				
				if($(this).parents('.no-scroll').length < 1){
					$(this).on('mouseleave',//RE APPLY THE WINDOW SCROLL WHEN THE MOUSE LEAVES THE CENTER COLUMN
						function(){
							
							if($('.topic').attr('id') !== 'about' && $('.topic').attr('id') !== 'news' && $('.topic').attr('id') !== 'testimonials' && $('.topic').attr('id') !== 'contact'){
								$('#window').on('mousewheel', scrollWindow);
							}
							$(this).off('mouseleave');
						}
					);
				}
			}
		);
		
		$(elementToScroll).append(options['scrollHtml']);
		
		$(elementToScroll).children('.scroll-root').height($(elementToScroll).height());
		
		
		var scrollRatio = $(elementToScroll).height() / $(elementToScroll).children('.inner').height();
		
		$(elementToScroll).children('.scroll-root').children('.scroll').height(parseInt($(elementToScroll).height() * scrollRatio));
		
		var scrollDeltaY = $(elementToScroll).height() - $(elementToScroll).children('.scroll-root').children('.scroll').height();
		
		var contentDeltaX = $(elementToScroll).children('.inner').height() - $(elementToScroll).height();
		
		var scrollCurrent;
		var scrollOffset;
		var scrollStart;
		
		$(elementToScroll).children('.scroll-root').children('.scroll').on('click',
			function(e){
				scrollStart = parseInt($(this).css('top'));
			}
		);
		
		$(elementToScroll).children('.scroll-root').children('.scroll').draggable({
			axis: "y",
			containment: $(elementToScroll),
			drag: function(){
				
				
				scrollCurrent = -(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('top')) / scrollDeltaY) * contentDeltaX;
				scrollOffset = scrollCurrent - scrollStart;
				scrollStart = scrollCurrent;
				
				scrollElement(scrollOffset)
			}
		});
	}
	
	var touchStart = 0;
	var touchCurrent = 0;
	var touchOffset = 0;
	
	$(elementToScroll).on('touchstart',
		function(e){
			$(elementToScroll).addClass('touchstart');
			
			touchStart = e.originalEvent.touches[0].pageY;
			
			$(elementToScroll).on('touchend',
				function(e){
					$(elementToScroll).removeClass('touchstart').removeClass('touchmove');
					$(elementToScroll).off('touchend')
				}
			);
		}
	);
	
	$(elementToScroll).on('touchmove',
		function(e){
			e.preventDefault();
			
			$(elementToScroll).addClass('touchmove');
			
			touchCurrent = e.originalEvent.touches[0].pageY;
			touchOffset = touchCurrent - touchStart;
			touchStart = touchCurrent;
			
			scrollElement(touchOffset);
		}
	);
	
	$(elementToScroll).on('mousewheel',
		function(e){
			
			if('wheelDelta' in e.originalEvent){
				delta = e.originalEvent.wheelDelta * (Math.PI / 180) * deltaMultiplier;
			}else{
				delta = e.originalEvent.detail * -500 * (Math.PI / 180);
			}
				
			
			var scrollRatio = $(elementToScroll).height() / $(elementToScroll).children('.inner').height();
			$(elementToScroll).children('.scroll-root').children('.scroll').css('top', '-=' + (delta * scrollRatio));
			
			if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('top')) >= $(elementToScroll).height() - ($(elementToScroll).height() * scrollRatio)){
				
				$(elementToScroll).children('.scroll-root').children('.scroll').css('top', $(elementToScroll).height() - ($(elementToScroll).height() * scrollRatio));
				
			}else if(parseInt($(elementToScroll).children('.scroll-root').children('.scroll').css('top')) <= 0){
				$(elementToScroll).children('.scroll-root').children('.scroll').css('top', 0);
			}
			
			scrollElement(delta);
		}
	);
	
	function scrollElement(delta){

		$(elementToScroll).children('.inner').css('top', '+=' + delta);
		
		if(parseInt($(elementToScroll).children('.inner').css('top')) <= $(elementToScroll).height() - $(elementToScroll).children('.inner').height()){
			$(elementToScroll).children('.inner').css('top', $(elementToScroll).height() - $(elementToScroll).children('.inner').height());
		}else if(parseInt($(elementToScroll).children('.inner').css('top')) >= 0){
			$(elementToScroll).children('.inner').css('top', 0);
		}
		
	}
}
*/