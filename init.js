document.getElementById('trigger').addEventListener("click", function() {
	toggleMenu();
});
new mlPushMenu(document.getElementById('mp-menu'), document
		.getElementById('trigger'));

toggleMenu = function() {
	var trigger = document.getElementById('trigger');
	var content = document.getElementById("content");
	var menu = document.getElementById("menu");
	if (menu.style.zIndex == 9) {
		menu.style.zIndex = "0";
		content.style.zIndex = "9";
	} else {
		menu.style.zIndex = "9";
		content.style.zIndex = "0";
	}
}

window.addEventListener('urlchange', function(e) {
	console.log("url changed");
	console.log(e);
	console.log(e.detail);
	console.log(location);
}, false);