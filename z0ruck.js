var FLASH_WIDTH = 600;
var FLASH_HEIGHT = 450;

// special value that indicates initialization state and shouldn't be put on
// the stack
var curflashloop = -1;

// array that serves as size-limited stack to allow skipping back and to
// prevent showing the same flash loops too frequent
var MAX_ARRAY_SIZE = 100;
var shownflashloops = new Array();

function setVisibility(id, visible, block) {
	if (visible)
		if (block)
			document.getElementById(id).style.display = "block";
		else
			document.getElementById(id).style.display = "inline";
	else
		document.getElementById(id).style.display = "none";
}

function validateNumber(n) {
	if (typeof n == "string") {
		var nu = parseInt(n);
		if (!isNaN(nu) && nu >= 0 && nu < TOTAL_FLASH_COUNT)
			return nu;
		else
			return -1;
	}
	else
		return -1;
}

function addOldFlash() {
	if (curflashloop != -1) {
		if (shownflashloops.length >= MAX_ARRAY_SIZE)
			shownflashloops = shownflashloops.slice(1, MAX_ARRAY_SIZE);
		shownflashloops.push(curflashloop);
	} else return false;
}

function replaceFlash() {
	document.title = "ZOMG ZUFALL! #" + curflashloop;
	document.location.hash = curflashloop;
	document.getElementById("onlinelink").innerHTML =
		"Online link: <a href=\"http://z0r.de/" + curflashloop +
		"\">http://z0r.de/" + curflashloop + "</a>";

	// works a lot faster and easier than recursively emptying the DOM tree
	document.getElementById("content").innerHTML = "";

	if (curflashloop <= 0)
		setVisibility("prev", false, false);
	else
		setVisibility("prev", true, false);
	if (curflashloop >= TOTAL_FLASH_COUNT - 1)
		setVisibility("next", false, false);
	else
		setVisibility("next", true, false);
	if (shownflashloops.length == 0)
		setVisibility("back", false, false);
	else
		setVisibility("back", true, false);

	// ADAPT FILE NAME SCHEMA HERE
	var flashpath = "z0r-" + curflashloop + ".swf";
	// for leeching directly off z0r.de (don't do it)
	//var flashpath = "http://raz.z0r.de/L/z0r-de_" + curflashloop + ".swf";
	
	/* HTML code produced by this DOM thingy:
		<object type="application/x-shockwave-flash" data="$FLASHPATH"
			width="$FLASH_WIDTH" height="$FLASH_HEIGHT">
			<param name="movie" value="$FLASHPATH">
		</object> */
	var flashobj = document.createElement("object");
	flashobj.setAttribute("type", "application/x-shockwave-flash");
	flashobj.setAttribute("data", flashpath);
	flashobj.setAttribute("width", FLASH_WIDTH);
	flashobj.setAttribute("height", FLASH_HEIGHT);

	var theParam = document.createElement("param");
	theParam.setAttribute("name", "movie");
	theParam.setAttribute("value", flashpath);

	flashobj.appendChild(theParam);
	document.getElementById("content").appendChild(flashobj);
}

function prevFlash() {
	if (curflashloop <= 0)
		return false;
	else {
		addOldFlash();
		curflashloop--;
		replaceFlash();
	}
}

function nextFlash() {
	if (curflashloop >= TOTAL_FLASH_COUNT - 1)
		return false;
	else {
		addOldFlash();
		curflashloop++;
		replaceFlash();
	}
}

function randomFlash() {
	var alreadyshown = true;
	var rndflashloop;
	while (alreadyshown) {
		rndflashloop = Math.floor(Math.random() * TOTAL_FLASH_COUNT);
		alreadyshown = false;
		for (var i = 0; i++; i < shownflashloops.length) {
			if (shownflashloops[i] == rndflashloop) {
				alreadyshown = true;
				break;
			}
		}
	}
	addOldFlash();
	curflashloop = rndflashloop;
	replaceFlash();
}

function lastFlash() {
	if (shownflashloops.length == 0)
		return false;
	else {
		curflashloop = shownflashloops.pop();
		replaceFlash();
	}
}

function flashByNumber() {
	var input = validateNumber(prompt("Jump to which flash loop (0 through " +
		(TOTAL_FLASH_COUNT - 1) + ")?", ""));
	if (input != -1) {
		addOldFlash();
		curflashloop = input;
		replaceFlash();
	}
}

window.onload = window.onpopstate = function() {
	document.getElementById("prev").onclick = prevFlash;
	document.getElementById("rand").onclick = randomFlash;
	document.getElementById("next").onclick = nextFlash;
	document.getElementById("back").onclick = lastFlash;
	document.getElementById("bynum").onclick = flashByNumber;

	document.getElementById("main").style.width = FLASH_WIDTH + "px";
	document.getElementById("content").style.minHeight = FLASH_HEIGHT + "px";

	setVisibility("onlinelink", true, true);

	if (location.hash.length > 1) {
		var input = validateNumber(location.hash.substring(1));
		if (input != -1) {
			curflashloop = input;
			replaceFlash();
		}
		else
			randomFlash();
	}
	else
		randomFlash();
}
