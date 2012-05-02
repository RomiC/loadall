$(function() {
	$("#b3").click(function() {
		$("#l2").loadall({image: "images/ajax-loader.gif", url: "div1.html", debug: true});
	});
	$("#b4").click(function() {
		$("#l2").loadall({image: "images/ajax-loader.gif", url: "div2.html"});
	});
});