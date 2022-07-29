var DCTpanel;
var imgpanel;
var imgpicker

var DCTmatrix;
var imgmatrix;

var DCTpanelComponents;
var imgpanelComponents;

function begin() {
	prepVariables();
	gatherElements();
	buildGUI();
}

// -----------------

function prepVariables() {
	DCTmatrix = [];
	imgmatrix = [];
	DCTpanelComponents = [];
	imgpanelComponents = [];
	for (var i=0; i<8; i++) {
		DCTmatrix.push( [0,0,0,0,0,0,0,0] );
		imgmatrix.push( [128,128,128,128,128,128,128,128] );
		DCTpanelComponents.push( [0,0,0,0,0,0,0,0] );
		imgpanelComponents.push( [0,0,0,0,0,0,0,0] );
	}
}

function gatherElements() {
	DCTpanel = document.getElementById("dctPanel");
	imgpanel = document.getElementById("imgPanel");
	imgpicker = document.getElementById("imgPicker")
}

function buildGUI() {
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			var elem = buildDCTPanel(i,j);
			DCTpanel.appendChild(elem);
			DCTpanelComponents[i][j] = elem;
		}
		// var br = document.createElement("br");
		// DCTpanel.appendChild(br);
	}
	
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			var elem = buildimgPanel(i,j);
			imgpanel.appendChild(elem);
			imgpanelComponents[i][j] = elem;
		}
		// var br = document.createElement("br");
		// imgpanel.appendChild(br);
	}

	// var img1 = new Image();
	// img1.src = "img.png";

	var elem = buildimgPicker("img2.png",480,480);
	imgpicker.appendChild(elem);
	// imgpicker.drawImage("img.png",0,0);

	// document.body.appendChild(elem);

	// var br = document.createElement("br")
	// imgpicker.appendChild(br);
}

// -----------------------

function buildDCTPanel(i,j) {
	var elem = document.createElement("div");
	elem.className = "panel";
	elem.i = i;
	elem.j = j;
	elem.innerHTML = DCTmatrix[i][j];
	
	elem.addEventListener("wheel", function(e) {
		e.preventDefault();
		var newValue = DCTmatrix[this.i][this.j] - e.deltaY/10;
		updateDCTvalue(this, newValue);
	});
	
	elem.addEventListener("mousedown", function(e) {
		e.preventDefault();
		switch(e.button) {
			case 0: updateDCTvalue(this, 1023); break;
			case 1: updateDCTvalue(this, 0); break;
			case 2: updateDCTvalue(this, -1024); break;
		}
	});
	
	elem.addEventListener("mousemove", function(e) {
		e.preventDefault();
		switch(e.buttons) {
			case 1: updateDCTvalue(this, 1024); break;
			case 4: updateDCTvalue(this, 0); break;
			case 2: updateDCTvalue(this, -1024); break;
		}
	});

	elem.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	});
	
	elem.style.backgroundColor = "rgb(128,128,128)";
	
	return elem;
}

function buildimgPanel(i,j) {
	var elem = document.createElement("div");
	elem.className = "panel";
	elem.i = i;
	elem.j = j;
	elem.innerHTML = imgmatrix[i][j];
	
	elem.addEventListener("wheel", function(e) {
		e.preventDefault();
		var newValue = imgmatrix[this.i][this.j] - e.deltaY/10;
		updateimgvalue(this, newValue);
	});
	
	elem.addEventListener("mousedown", function(e) {
		e.preventDefault();
		switch(e.button) {
			case 0: updateimgvalue(this, 255); break;
			case 1: updateimgvalue(this, 128); break;
			case 2: updateimgvalue(this, 0); break;
		}
	});
	
	elem.addEventListener("mousemove", function(e) {
		e.preventDefault();
		switch(e.buttons) {
			case 1: updateimgvalue(this, 255); break;
			case 4: updateimgvalue(this, 128); break;
			case 2: updateimgvalue(this, 0); break;
		}
	});

	elem.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	});
	
	elem.style.backgroundColor = "rgb(128,128,128)";
	
	return elem;
}

function buildimgPicker(src, width, height) {

	var img = document.createElement("img");
	
    img.src = src;
    img.width = width;
    img.height = height;
	// img.crossOrigin = "Anonymous";

	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;


	

	canvas.addEventListener("mousedown", function(e) {
		e.preventDefault();
		switch(e.buttons) {
			case 1:

				var x = e.offsetX;
				var y = e.offsetY;
				
				var matching = document.querySelectorAll('[class*="panel"]')


				var ctx = canvas.getContext("2d");
				ctx.drawImage(img,0,0);
				
				// var pixelData = ctx.getImageData(x, y, 1, 1).data;

				panelNumber = 64;

				for (var i=-4; i<4; i++) {
					for (var j=-4; j<4; j++) {
						var pixelData = ctx.getImageData(x+j, y+i, 1, 1).data;
						updateimgvalue(matching[panelNumber], pixelData[0]);
						panelNumber++;
					}
				}
		}
	});

	canvas.addEventListener("mousemove", function(e) {
		e.preventDefault();

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img,0,0);
		
		ctx.beginPath();
		ctx.lineWidth = "2";
		ctx.strokeStyle = "red";
		ctx.rect(e.offsetX-4, e.offsetY-4,8,8);
		ctx.stroke();

		// imgpicker.appendChild(canvas);

	});

	canvas.addEventListener("mouseout", function(e) {
		e.preventDefault();

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img,0,0);
	});

	var ctx = canvas.getContext("2d");
	ctx.drawImage(img,0,0);

	return canvas;

}

// -----------------

function updateDCTvalue(obj,val) {
	val = Math.max(-1024, Math.min(val, 1023));
	DCTmatrix[obj.i][obj.j] = val;
	obj.innerHTML = val;
	var normalized = Math.round(((val+1024) / 2047.0) * 255);
	obj.style.backgroundColor = "rgb(" + normalized + "," + normalized + "," + normalized + ")";
	
	updateimgmatrix();
}

function updateimgvalue(obj,val) {
	val = Math.max(0, Math.min(val, 255));;
	imgmatrix[obj.i][obj.j] = val;
	obj.innerHTML = val;
	obj.style.backgroundColor = "rgb(" + val + "," + val + "," + val + ")";
	
	updateDCTmatrix();
}

// -------------------

function updateimgmatrix() {
	imgmatrix = inverseDCT(DCTmatrix);
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			var obj = imgpanelComponents[i][j];
			var val = imgmatrix[i][j];
			obj.innerHTML = val;
			obj.style.backgroundColor = "rgb(" + val + "," + val + "," + val + ")";
		}
	}
}

function updateDCTmatrix() {
	DCTmatrix = forwardDCT(imgmatrix);
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			var obj = DCTpanelComponents[i][j];
			var val = DCTmatrix[i][j];
			var normalized = Math.round(((val+1024) / 2047.0) * 255);
			obj.innerHTML = val;
			obj.style.backgroundColor = "rgb(" + normalized + "," + normalized + "," + normalized + ")";
		}
	}
}