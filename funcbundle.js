newPopup = function (url) {
	popupWindow = window.open(
		url,'popUpWindow','height=500,width=400,left=10,top=10,resizable=no,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
};

function capitalise(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,// - rect.left,
        y: evt.clientY - rect.top// - rect.top	  
    };
};	

function isset(a){
	if(a != null && a != undefined){
		return true;
	}
	return false;
};


//Returns true if the circles are touching, or false if they are not
function circlesCollide(x1, y1, r1, x2, y2, r2){
	//compare the distance to combined radii
	var dx = x2 - x1;
	var dy = y2 - y1;
	var radii = r1 + r2;

	if( ((dx * dx) + (dy * dy)) < (radii * radii)){
		return true;
	}else{
		return false;
	}
};

// x: box x coord | w: box width
// y: box y coord | h: box height
// p: point{x:0, y:0} <-eg. a map
function pointInBox(x,y,w, h,p){
	if(p.x >= x  && p.x <= (x + w) && p.y >= y && p.y <= (y + h)){
		return true;
	}
	return false;
};

function drawLine(context, x1, y1, x2, y2){
	context.beginPath();
  	context.moveTo(x1,y1);
  	context.lineTo(x2,y2);
  	context.strokeStyle = '#003300';
  	context.stroke();
};


function getHexValue(bit_value){
		switch(bit_value){
			case 0: return 0;
			case 1: return 1;
			case 2: return 2;
			case 3: return 3;
			case 4: return 4;
			case 5: return 5;
			case 6: return 6;
			case 7: return 7;
			case 8: return 8;
			case 9: return 9;
			case 10: return 'A';
			case 11: return 'B';
			case 12: return 'C';
			case 13: return 'D';
			case 14: return 'E';
			case 15: return 'F';
			default: return null;
		}
};

function invertBit(val){
		if(val === 1){
			return 0;
		}
		else if(val === 0){
			return 1;
		}
	};