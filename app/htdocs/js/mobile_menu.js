document.getElementById("mobile_menu").onclick = function() {toggleMenu()};

function toggleMenu() {
	var element = document.getElementById("menu_nav");
	
	if (window.getComputedStyle(element).display == 'none') {
		element.style.display = 'flex';
	}
	else {
		element.style.display = '';
	}
}