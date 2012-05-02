loadall
=======

jQuery plugin which load all content into selected object. Wait untill all content will be loaded not only html, but all images and scripts inside html-code.

Options
-------
* `animation` – Animation speed in milliseconds
* `image` – Animated gif-loader (you can use [ajaxload.info](http://ajaxload.info/) to create it)
* `callback` – Callback-function called after all content is loaded
* `debug` – Print debug message to console (true – yes, false – no)

Sample
-------
	<div id="l2" class="loader">loading content here</div>
	<script type="text/javascript">
		// Loading content from div1.html, showing gif-loader and print debug messages
		$("#l2").loadall({image: "images/ajax-loader.gif", url: "div1.html", debug: true});
	</script>
