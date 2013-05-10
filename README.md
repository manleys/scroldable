Scroldable

Scroldable is a jQuery plug designed to replace the default overflow:scroll
behavior, providing the ability to add custom scroll elements. It works on both
desktop and mobile browsers, as well as ie7+.

Scroldable works by taking the element initiated as the scroll element and
wrapping the content in an absolutely positioned div. The height of this element
is compared to the height of the parent element and if it is greater then a
scroll bar is added. The default scroll elements require CSS to be positioned
correctly.

The options for Scroldable are ‘orientation’, ‘scrollHtml’, and ‘onScroll’.
Orientation means whether or not the scrollable content is vertical or
horizontal. The value can be either ‘x’ or ‘y’; the default is y. The
‘scrollHtml’ provides the option to use custom html for the scroll elements,
normally this will not have to be changed. ‘onScroll’ provides a callback every
time the element is scrolled.

Further development on this plugin would be to allow the user to scroll the
element in both ‘x’ and ‘y’ axis. It would also be good for the user to be able
to grab and scroll the element without the use of scrollbars on desktop
computers similar to mobile devices.