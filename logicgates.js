var ACTION_MODE = true;
var MPI = function(list){
		this.pickedUp = false;
		this.type = null;
		
		this.img = new Image();
		this.img.src = 'Assets/iconmonstr-arrow-25-icon48.png';
		
		this.obj = null;


		//TODO fix the redundancies!!!
		//TODO find another way to replace this.type
		this.drop = function(mouse){
				if(this.type === '8bit'){
					var new_bit8 = new bit8(2, 8);
					new_bit8.init(mouse.x,mouse.y);
					
					list.push(new_bit8);
					mouse.x -= 1;
					this.reset();
					return;
				}else if(this.type === '8bitnegative'){
					var new_bit8 = new bit8(2, 8);
					new_bit8.signed_magnitude = true;
					new_bit8.negative = true;
					new_bit8.init(mouse.x,mouse.y);

					list.push(new_bit8);
					mouse.x -= 1;
					this.reset();
					return;
				}else if(this.type === '8bitpositive'){
					var new_bit8 = new bit8(2, 8);
					new_bit8.signed_magnitude = true;
					new_bit8.init(mouse.x, mouse.y);

					list.push(new_bit8);
					mouse.x -= 1;
					this.reset();
					return;
				}else if(this.type === 'addition'){
					var baddi = new addition(2,8);				
					baddi.init(mouse.x,mouse.y);

					list.push(baddi);
					mouse.x -= 1;
					this.reset();
					return;
				}else if(this.type === 'subtraction'){
					var bsub = new addition(2,8);
					bsub.isTwosComplement = true;
					bsub.init(mouse.x,mouse.y);

					list.push(bsub);
					mouse.x -= 1;
					this.reset();
					return;	
				}else if(this.type === 'twoscomplement'){
					var twoscomp = new twos_complement(2,4);
					twoscomp.init(mouse.x,mouse.y);

					list.push(twoscomp);
					mouse.x -= 1;
					this.reset();
					return;
				}else if(this.type === 'onescomplement'){
					var onescomp = new ones_complement(2,4);
					onescomp.init(mouse.x, mouse.y);

					list.push(onescomp);

					this.reset();
					mouse.x -= 1;
					return;
				}else if (this.type === 'binaryconversion'){
					var conversion = new decimal_binary_conversion();
					conversion.init(mouse.x, mouse.y);

					list.push(conversion);
					this.reset();
					mouse.x -= 1;			
					return;
				}

				
				this.reset();
				mouse.x -= 1;
				return;
		}
		
		//PRIVATE
		this.reset = function(){
			this.type = null;
			this.pickedUp = false;	
			
		}
		
		this.pickUp = function(type){
			this.type = type;
			this.pickedUp = true;
		}

		this.pickUpObj = function(o){
			var tempObj = o;
			o.insideColor = "orange";
			o.mpi_selected = true;
			
			this.pickedUp = true;
			this.obj = tempObj;
			console.log("obj pickup :" + this.obj.value + " x:" + this.obj.x + "  y:" + this.obj.y);
		}

		this.dropObj = function(mouse){
			if(isset(this.obj) && this.pickedUp){
				console.log("MPI drop obj called");
				this.obj.insideColor = "white";
				this.obj.mpi_selected = false;
				this.obj.confirmMove();
				this.obj = undefined;
				this.pickedUp = false;
				mouse.x -= 1000;
				mouse.y -= 1000;
			}
		}
		
		//TODO fix position of the image
		//TODO find another, smaller image 
		this.draw = function(context, mouse){
			if(this.pickedUp === true){
				//context.drawImage(this.img,mouse.x , mouse.y);
				if( this.obj != null || this.obj != undefined){
					//this.obj.draw(context);
				}			
			}
		}};

var Renderer = function(canvas_id, mpi, canvas_status_id){
		this.status_bar = document.getElementById(canvas_status_id);
    	this.canvas = document.getElementById(canvas_id);    	
    	this.context = this.canvas.getContext('2d');

    	
    	var ONE_FRAME_TIME = 1000.0 / 60.0 ; 	
    	this.mpi = mpi;
    	this.itemList = [];
    	
    	// choosing right method for the browser.
    	var animationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null ;

        this.passList = function(list){
        	this.itemList = list;      	
        }

        this.setMpi = function(newMPI){
        	this.mpi = newMPI;
        }
        
        //	method to start the main loop
    	this.run = function(itself){
    		console.log('run-CANVAS::' + this.canvas);
    		if (animationFrame !== null ) {			
	        	var recursiveAnim = function() {
	            	itself.draw();
	            	itself.update();
	            	animationFrame( recursiveAnim );        	
	        	};

	        	// start the loop
	        	animationFrame( recursiveAnim );
    		} else {	
        		setInterval( this.update, ONE_FRAME_TIME );

        		setInterval( this.draw, ONE_FRAME_TIME );
    		}
    	}

    	this.update = function(){
    		for(var i = 0; i < this.itemList.length; i++){
    			this.itemList[i].update();
    		}
    	}

    	this.draw = function(){
    		this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
			if(!ACTION_MODE){
				this.context.beginPath();
				this.context.rect(0, 0, this.canvas.width, this.canvas.height);
				this.context.fillStyle = "lightgrey";
				this.context.fill();
				this.context.closePath();
			}
			for(var i = 0;i < this.itemList.length; i++){

				this.itemList[i].draw(this.context);

			}


    	}};

var button = function(text){
		this.x = 0;
		this.y = 0;
		
		this.height = 0;
		this.width = 0;
		
		this.horizontalOffset = 2;
		this.verticalOffset = 2;
		
		this.hasImage = false;
		this.img;
		
		this.text = text;
		this.fontSize = 15;
		
		this.clicked = false;
		this.focused = false;
		
		this.dropType = '';
		
		this.init = function(x, y){
			this.x = x;
			this.y = y;
			
			this.setBoundarySize();
			
		}
		
		this.setDropType = function(type){
			this.dropType = type;
		}
		
		this.importImage = function(imgPath){
			this.img = new Image();
			this.img.src = imgPath;		
			
			this.hasImage = true;
			
			this.setBoundarySize();
		}
		
		this.setBoundarySize = function(){
			if(this.hasImage){
			
				this.width = this.img.width + (this.horizontalOffset * 2);
				this.height = this.img.height + (this.verticalOffset * 2);
			}else{
				this.height = this.fontSize + (this.verticalOffset * 2);
			}
		}
		
		this.draw = function(context){
			if(!this.hasImage){
				context.font = this.fontSize + 'pt Calibri';
				this.width = context.measureText(this.text).width + (this.horizontalOffset * 2);
			}
			
			if(this.focused){
				context.fillStyle = "rgb(100,75,0)";
				context.fillRect(this.x, this.y, this.width, this.height);
			}else{
				context.fillStyle = "rgb(255,255,255)";
				context.fillRect(this.x, this.y, this.width, this.height);
			}
			
			//Drawing the button icon if there is
			//or draw the text
			if(this.hasImage){
				//this.img.onload = function(context){
					context.drawImage(this.img, this.x + this.horizontalOffset, this.y  + this.verticalOffset);
					context.font = '9pt Calibri';
				context.fillStyle = 'black';
				context.fillText(this.text, this.x + this.horizontalOffset, this.y  - this.verticalOffset*2);
				//}
			}else{							
				context.fillStyle = 'black';
				context.fillText(this.text, this.x + this.horizontalOffset, this.y + this.height - this.verticalOffset);
			}
			
			if(this.focused){
				
			}
		}
		
		this.isClicked = function(mouse){	
			if(mouse.x >= this.x && mouse.x <= (this.x + this.width) && mouse.y >= this.y && mouse.y <= (this.y + this.height)){
				this.clicked = true;
				MPI_ACTIVE1.pickUp(this.dropType); 
				return true;
			}
			this.clicked = false;
			return false;
		}

		this.isClicked = function(mouse,mpi){	
			if(mouse.x >= this.x && mouse.x <= (this.x + this.width) && mouse.y >= this.y && mouse.y <= (this.y + this.height)){
				this.clicked = true;
				mpi.pickUp(this.dropType); 
				return true;
			}
			this.clicked = false;
			return false;
		}
		
		this.isFocused = function(mouse){
			if(mouse.x >= this.x && mouse.x <= (this.x + this.width) && mouse.y >= this.y && mouse.y <= (this.y + this.height)){
				this.focused = true;
				//alert('Old value: ' + old + '  New value is: ' + this.value);
				return true;
			}
			this.focused = false;
			return false;	
		}		};

//////////////////////////////////

var GateInput = function(x, y){
	this.x = x;
	this.y = y;
	this.xDraw = this.x;
	this.yDraw = this.y;

	this.value = 0;

	this.attach = undefined;

	this.mpi_selected = false;
	this.selected = false;
	this.showEdges = false;
	
	this.width = 24;
	this.height = 32;

	this.insideColor = "white";

	var move_box_xOff = -1;
	var move_box_yOff = -7;
	var move_box_wOff = 2;
	var move_box_height = 7;

	this.draw = function(context){
		if(isset(this.attach)){
			if(this.attach instanceof Gate){
				if(this === this.attach.inputA){
					drawLine(context, this.xDraw + this.width, this.yDraw + this.height*0.50, this.attach.xDraw, this.attach.yDraw + this.attach.height*0.25);
				}
				if(this === this.attach.inputB){
					drawLine(context, this.xDraw + this.width, this.yDraw + this.height*0.50, this.attach.xDraw, this.attach.yDraw + this.attach.height*0.75);
				}
			}else{
				drawLine(context, this.xDraw + this.width, this.yDraw +this.height*0.50, this.attach.xDraw, this.attach.yDraw );
			}
		}
		if(ACTION_MODE && this.showEdges){
			context.beginPath();
			context.rect(this.xDraw + move_box_xOff, this.yDraw + move_box_yOff, this.width + move_box_wOff , move_box_height);
			context.fillStyle = "red";
			context.fill();
			context.closePath();
		}
	
		//Draw the boundary of the gate input 
		context.beginPath();
		context.rect(this.xDraw, this.yDraw, this.width, this.height);
		context.fillStyle = this.insideColor;
		context.fill();
		context.linewidth = 2;
		context.strokeStyle = "black";
		context.stroke();
		context.closePath();

		

		//drawing the value
		context.font = '11pt Calibri';
		context.fillStyle = 'black';
		context.fillText(this.value, this.xDraw + (this.width/2) - 3, this.yDraw + (this.height/2) + 4);
	}

	this.isClicked = function(mouse, mpi){
		if(ACTION_MODE){
			if(pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){
				if(this.selected){
					this.selected = false;
					this.insideColor = "white";
					this.confirmMove();
					return true;
				}

				this.toggleBit();
				this.selected = false;
				this.insideColor = "white";
				return;
			}

			if(pointInBox(this.xDraw + move_box_xOff, this.yDraw + move_box_yOff, this.width + move_box_wOff, move_box_height, mouse)){
				if(!pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){
					this.selected = true;
					this.insideColor = "yellow";
					return;
				}
			}
		}else{
			if(pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){
				if(!isset(mpi.obj)){
					mpi.pickUpObj(this);
					return true;
				}else{
					this.setAttach(mpi.obj);
					mpi.dropObj(mouse);
					return true;
				}
			}else{
				return false;
			}
			
		}
	};

	this.isFocused = function(mouse){
		if(ACTION_MODE){
			if(this.selected){
				this.move(mouse.x - this.width/2, mouse.y - this.height/2);
			}else{
				if(pointInBox(this.xDraw + move_box_xOff, this.yDraw + move_box_yOff, this.width, this.height + move_box_height, mouse)){
					this.showEdges = true;
				}else{
					this.showEdges = false;
				}
			}
		}else{
			if(pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){
				return true;
			}else{ return false;}
		}
		
		
	};

	this.update = function(){

	};

	this.move = function(x, y){
		this.xDraw = x;
		this.yDraw = y;
	};

	this.confirmMove = function(){
		this.x = this.xDraw;
		this.y = this.yDraw;
	}

	this.setAttach = function(attachment_gate){
		if(isset(attachment_gate)){
			if(attachment_gate instanceof Display){
				if(isset(attachment_gate.attach)){
					if(attachment_gate.attach instanceof Gate){
						attachment_gate.attach.output = undefined;
						attachment_gate.attach = undefined;
					}
					if(attachment_gate.attach instanceof GateInput){
						attachment_gate.attach.attach = undefined;
						attachment_gate.attach = undefined;
					}
				}
				if(!isset(this.attach)){
					this.attach = attachment_gate;
					attachment_gate.attach = this;
				}else{
					this.attach.attach = undefined;
					this.attach = undefined;

					this.attach = attachment_gate;
					attachment_gate.attach = this;
				}
			}
		}
	}

	this.toggleBit = function(){
		if(this.value === 0){
			this.value = 1;
		}else if(this.value === 1){
			this.value = 0;
		}

		if(isset(this.attach) && this.attach instanceof Gate){
			this.attach.calculate();
		}
	}	


};



var Display = function(x, y){
	this.x = x;
	this.y = y;
	this.xDraw = this.x;
	this.yDraw = this.y;

	this.radius = 16;

	this.value = 0;

	this.attach = undefined;
	this.output = undefined;

	this.selected = false;
	this.showEdges = false;
	this.insideColor = "white";
	
	this.width = this.radius*2;
	this.height = this.radius*2;

	this.fontSize = 12;


	var move_box_height = 7;
	var move_box_radius = this.radius + 1;

	this.draw = function(context){		
		if(this.showEdges){
			context.beginPath();
			context.arc(this.xDraw , this.yDraw - move_box_height, move_box_radius , 0 , 2* Math.PI, false);
			//context.rect(this.xDraw - this.radius + move_box_xOff, this.yDraw - this.radius + move_box_yOff, this.radius*2 + move_box_wOff , this.radius*(1.5));
			context.fillStyle = "red";
			context.fill();
			//context.fillrect(this.xDraw - this.radius + move_box_xOff, this.yDraw - this.radius + move_box_yOff, this.radius*2 + move_box_wOff , this.radius*(1.5));
			context.closePath();
		}


		//Draw the boundary of the gate input 
		context.beginPath();
		context.arc(this.xDraw , this.yDraw , this.radius, 0 , 2* Math.PI, false);
		context.fillStyle = this.insideColor;
		context.fill();
		context.linewidth = 2;
		context.strokeStyle = "black";
		context.stroke();
		context.closePath();

		//drawing the value
		context.font = '' + this.fontSize + 'pt Calibri';
		context.fillStyle = 'black';
		
		if(isset(this.attach)){
			context.fillText(this.attach.value, this.xDraw - this.fontSize/3, this.yDraw + this.fontSize/2);
		}else{
			context.fillText(this.value, this.xDraw - this.fontSize/3, this.yDraw + this.fontSize/2);	
		}	
		

		
	}

	this.isClicked = function(mouse, mpi){
		if(ACTION_MODE){
			if(this.selected){
				this.selected = false;
				this.insideColor = "white";
				this.confirmMove();
				return true;
			}else{
				if(circlesCollide(this.xDraw, this.yDraw - move_box_height, move_box_radius, mouse.x, mouse.y, 1)){
					if(!circlesCollide(this.xDraw, this.yDraw, this.radius, mouse.x, mouse.y, 1)){
						this.selected = true;
						this.insideColor = "yellow";
						return;
					}
				}
			}

			
		}else{
			if(circlesCollide(this.xDraw, this.yDraw, this.radius, mouse.x, mouse.y, 1)){
				console.log("iinside circle clicked not action mode");
				if(!isset(mpi.obj)){
					mpi.pickUpObj(this);
					return true;
				}else{
					console.log("mpi is set ready to attach");
					this.setAttach(mpi.obj);
					mpi.dropObj(mouse);
					return true;
				}
			}else{
				return false;
			}
		}
		
		
	};

	this.isFocused = function(mouse){
		if(ACTION_MODE){
			if(this.selected){
				this.move(mouse.x, mouse.y);
			}else{
				if(circlesCollide(this.xDraw, this.yDraw, this.radius, mouse.x, mouse.y, 1) || circlesCollide(this.xDraw, this.yDraw - move_box_height, move_box_radius, mouse.x, mouse.y, 1)){
						this.showEdges = true;
	
				}else{
					this.showEdges = false;	
				}
			}
		}else{
			if(circlesCollide(this.xDraw,this.yDraw, this.radius, mouse.x, mouse.y, 1)){
				return true;
			}else{return false;}
		}
		
	};

	this.update = function(){

	};

	this.move = function(x, y){
		this.xDraw = x;
		this.yDraw = y;
	};

	this.confirmMove = function(){
		this.x = this.xDraw;
		this.y = this.yDraw;
	}

	this.setAttach = function(attachment_gate){
		if(isset(attachment_gate)){
			if(attachment_gate instanceof GateInput){
				if(!isset(this.attach)){
					this.attach = attachment_gate;
					attachment_gate.attach = this;
				}else{
					if(this.attach instanceof Gate){
						this.attach.output = undefined;
					}
					if(this.attach instanceof InputGate){
						this.attach.attach = undefined;
					}
					
					this.attach = undefined;

					this.attach = attachment_gate;
					attachment_gate.attach = this;
				}
			}
		}

	}

	this.passInVal = function(val){
		this.value = val;
	}	
};

var Gate = function(){
	this.x = 0;
	this.y = 0;
	this.xDraw = 0;
	this.yDraw = 0;

	this.width = 64;
	this.height = 64;

	this.value = 0;
	this.gateType = undefined;
	this.gateTypetxt = "";
	this.img = new Image();
	this.img.src = "Assets/and_gate.png";

	this.inputA = undefined;
	this.inputB = undefined;
	this.output = undefined;

	this.isInitiated = false;
	this.selected = false;
	this.insideColor = "white";
	this.showEdges = false;
	this.overlayInsideColor = "lightgreen";
	this.showOverlayTL = false;
	this.showOverlayBL = false;
	this.showOverlayRH = false;

	var move_box_xOff = -1;
	var move_box_yOff = -7;
	var move_box_wOff = 2;
	var move_box_height = 7;

	this.confirmMove = function(){
		this.x = this.xDraw;
		this.y = this.yDraw;
		console.log("move confirmed " + this.x + "  " + this.y);
	};

	this.init = function(xa, ya, type){
		this.xDraw = xa;
		this.yDraw = ya;
		this.gateType = type;


		this.img = new Image(100,50);
		switch(this.gateType){
			case "and_gate":
			
				this.img.src = "Assets/and_gate.png";
				this.gateTypetxt = "AND GATE";
				break;

			case "or_gate":
		//	this.img = new Image();
				this.img.src = "Assets/or_gate.png";
				this.gateTypetxt = "OR GATE";
				break;

			case "not_gate":
			//this.img = new Image();
				this.img.src = "Assets/not_gate.png";
				this.gateTypetxt = "NOT_GATE";
				break;

			case "xor_gate":
			//this.img = new Image();
				this.img.src = "Assets/xor_gate.png";
				this.gateTypetxt = "XOR GATE";
				break;
			default:
			//this.img = new Image();
				this.img.src = "Assets/xor_gate.png";
				this.gateTypetxt = "XOR GATE";
		}

		console.log("init for " + this.gateTypetxt);

		this.width = this.img.width;
		this.height = this.img.height;

		//console.log("init for " + this.gateTypetxt);


		this.isInitiated = true;
		this.confirmMove();
		this.x = this.xDraw;
		this.y = this.yDraw;
		console.log("after confirm");
		console.log(this.gateTypetxt);
		console.log(this.xDraw +" " + this.yDraw + "  " + this.width + " " +this.height);
	};



	this.draw = function(context){
		var xlim = this.xDraw + this.width/2;
		
		if(isset(this.output)){		
			if(xlim <= this.output.xDraw){
				if(this.output instanceof Gate){
					if(this === this.output.inputA){
						drawLine(context,this.xDraw + this.width, this.yDraw + this.height*0.50, this.output.xDraw, this.output.yDraw + this.output.height*0.25);
					}
					if(this === this.output.inputB){
						drawLine(context, this.xDraw + this.width, this.yDraw + this.height*0.50, this.output.xDraw, this.output.yDraw + this.output.height*0.75);	
					}	
				}else{
					drawLine(context, this.xDraw + this.width, this.yDraw + this.height*0.50, this.output.xDraw - this.output.radius, this.output.yDraw );
				}
				
			}else{
				drawLine(context,this.xDraw + this.width, this.yDraw + this.height/2, this.output.xDraw + this.output.radius, this.output.yDraw);
			}
			

		}

		if(ACTION_MODE && this.showEdges){
			context.beginPath();
			context.rect(this.xDraw + move_box_xOff, this.yDraw + move_box_yOff, this.width + move_box_wOff , move_box_height);
			context.fillStyle = "red";
			context.fill();
			context.closePath();
		}

		// context.beginPath();
		// 	//console.log(this.xDraw)
		// 	//console.log(this.yDraw)
		// 	//console.log(this.width)
		// 	//console.log(this.height);
		// context.rect(this.xDraw, this.yDraw, this.width, this.height);
		// context.fillStyle = this.insideColor;
		// context.fill();
		// context.linewidth = 2;
		// context.strokeStyle = "grey";
		// context.stroke();
		// context.closePath();

				context.beginPath();
				//console.log(this.xDraw +" " + this.yDraw + "  " + this.width + " " +this.height);
		context.rect(this.xDraw, this.yDraw, this.width, this.height);
		context.fillStyle = this.insideColor;
		context.fill();
		context.linewidth = 2;
		context.strokeStyle = "black";
		context.stroke();
		context.closePath();

		
		// context.font = '' + this.fontSize + 'pt Calibri';
		// context.fillStyle = 'black';
		
		// if(isset(this.attach)){
		// 	context.fillText(this.attach.value, this.xDraw - this.fontSize/3, this.yDraw + this.fontSize/2);
		// }else{
		// 	context.fillText(this.value, this.xDraw - this.fontSize/3, this.yDraw + this.fontSize/2);	
		// }	
		


		if(isset(this.img)){
	

			context.drawImage(this.img, this.xDraw, this.yDraw);
		}

		if(this.showOverlayRH && !ACTION_MODE){
			context.beginPath();
			context.rect(this.xDraw + this.width/2, this.yDraw , this.width/2, this.height);
			context.fillStyle = this.overlayInsideColor;
			context.fill();
			context.stroke();
			context.closePath();
			context.font = '9pt Calibri';
			context.fillStyle = 'black';
			context.fillText("Output",this.xDraw + 5 + this.width/2, this.yDraw + 30);
			if(isset(this.output)){
				this.output.insideColor = "lightgreen";	
			}
		}
		if(this.showOverlayBL  && !ACTION_MODE && this.gateTypetxt != "NOT_GATE"){
			context.beginPath();
			context.rect(this.xDraw, this.yDraw + this.height/2, this.width/2, this.height/2);
			context.fillStyle = this.overlayInsideColor;
			context.fill();
			context.stroke();
			context.closePath();

			context.font = '9pt Calibri';
			context.fillStyle = 'black';
			context.fillText("Input B", this.xDraw + 4, this.yDraw + this.height/2 + 17);
			if(isset(this.inputB)){
				this.inputB.insideColor = "lightgreen";	
			}
		}
		if(this.showOverlayTL && !ACTION_MODE){
			context.beginPath();
			context.rect(this.xDraw, this.yDraw, this.width/2, this.height/2);
			context.fillStyle = this.overlayInsideColor;
			context.fill();
			context.stroke();
			context.closePath();
			context.font = '9pt Calibri';
			context.fillStyle = 'black';
			context.fillText("Input A", this.xDraw + 4, this.yDraw + 17);	
			
			if(isset(this.inputA)){
				this.inputA.insideColor = "lightgreen";	
			}
		}


	};

	this.isClicked = function(mouse, mpi){
		if(ACTION_MODE){
			if(pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){
				if(this.selected){
					this.selected = false;
					this.insideColor = "white";
					this.confirmMove();
					return true;
				}
				console.log("clicked");
				//return;
			}

			if(pointInBox(this.xDraw + move_box_xOff, this.yDraw + move_box_yOff, this.width + move_box_wOff, move_box_height, mouse)){
				if(!pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){
					this.selected = true;
					this.insideColor = "yellow";
					return;
				}
			}
		}else{
			if(pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){
				if(isset(mpi.obj)){
					if(mpi.obj != this){
						//left top corner - INPUT A
						if(pointInBox(this.xDraw, this.yDraw, this.width/2, this.height/2, mouse)){
							this.setAttach(mpi.obj, "a");
						}//left bottom corner - INPUT B
						else if(this.gateTypetxt != "NOT_GATE" && pointInBox(this.xDraw, this.yDraw + this.height/2, this.width/2, this.height/2, mouse)){
							
								this.setAttach(mpi.obj, "b");	
					
							
						}//right half - OUTPUT
						else{
							this.setAttach(mpi.obj, "o");
							
						}
						mpi.dropObj(mouse);				
					}
				}else{
					if(pointInBox(this.xDraw + this.width/2, this.yDraw, this.width/2, this.height, mouse)){
						mpi.pickUpObj(this);
						return;
					}
				}
			}
		}
		
	};

	this.isFocused = function(mouse){
		
		if(ACTION_MODE){
			if(this.selected){
				this.move(mouse.x - this.width/2, mouse.y - this.height/2);
				this.confirmMove();
				this.showOverlayTL = false;
				this.showOverlayBL = false;
				this.showOverlayRH = false;
				return true;
			}else{
				if(pointInBox(this.xDraw + move_box_xOff, this.yDraw + move_box_yOff, this.width, this.height + move_box_height, mouse)){
					this.showEdges = true;
					//left top overlay
					return true;
				}else{
					this.showEdges = false;
					this.showOverlayTL = false;
					this.showOverlayBL = false;
					this.showOverlayRH = false;
					return false;
				}
			}
		}else{
			if(pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){

				if(pointInBox(this.xDraw, this.yDraw, this.width/2, this.height/2, mouse)){
						this.showOverlayTL = true;
						this.showOverlayBL = false;
						this.showOverlayRH = false;
					}//bottom left overlay
					else if(pointInBox(this.xDraw, this.yDraw + this.height/2, this.width/2, this.height/2, mouse)){
						this.showOverlayTL = false;
						if(this.gateTypetxt != "NOT_GATE"){
							this.showOverlayBL = false;
						}else{
							this.showOverlayBL = true;
						}	
						this.showOverlayRH = false;
					}//right half ovverlay
					else{
						this.showOverlayTL = false;
						this.showOverlayBL = false;
						this.showOverlayRH = true;
					}
				return true;
			}else{ return false;}
		}
	};

	this.isFocused = function(mouse, status){			
		if(ACTION_MODE){
			if(this.selected){
				this.move(mouse.x - this.width/2, mouse.y - this.height/2);
				this.confirmMove();
				this.showOverlayTL = false;
				this.showOverlayBL = false;
				this.showOverlayRH = false;
			}else{
				if(pointInBox(this.xDraw + move_box_xOff, this.yDraw + move_box_yOff, this.width, this.height + move_box_height, mouse)){
					this.showEdges = true;

					this.updateStatus(status);
				}else{
					this.showEdges = false;
					this.showOverlayTL = false;
					this.showOverlayBL = false;
					this.showOverlayRH = false;
					this.insideColor = "white";
				}
			}
		}else{
			if(pointInBox(this.xDraw, this.yDraw, this.width, this.height, mouse)){

				this.updateStatus(status);
				if(pointInBox(this.xDraw, this.yDraw, this.width/2, this.height/2, mouse)){
						this.showOverlayTL = true;
						this.showOverlayBL = false;
						this.showOverlayRH = false;
					}//bottom left overlay
					else if(pointInBox(this.xDraw, this.yDraw + this.height/2, this.width/2, this.height/2, mouse)){
						this.showOverlayTL = false;
						this.showOverlayBL = true;
						this.showOverlayRH = false;
					}//right half ovverlay
					else{
						this.showOverlayTL = false;
						this.showOverlayBL = false;
						this.showOverlayRH = true;
					}
				return true;
			}else{ return false;}
		}	
	};

	this.updateStatus = function(status){
		var text = "<div style='text-align:center;'><strong>Gate</strong>: <span style='color:blue'>" + this.gateTypetxt + "</span></div>";
		text += "<div style='text-align:center;'>";
		text += "<strong>Input A</strong>: ";
		
		if(isset(this.inputA)){
			text += this.inputA.value; 
		}else{
			text += "N/A";
		}

		text += " <strong>Input B</strong>: ";
		if(isset(this.inputB)){
			text += this.inputB.value;
		}else{
			text += "N/A";
		}

		text += " Output: " + this.value + "</div>";

		status.innerHTML = text;
	}
	this.update = function(){

	};


	this.setAttach = function(attachment_gate, pos){
		if(isset(attachment_gate)){
			switch(pos){
				case "a":
					if(isset(attachment_gate.attach)){
						if(attachment_gate.attach instanceof Gate){
							attachment_gate.attach.output = undefined;
							attachment_gate.attach = undefined;
						}
						if(attachment_gate.attach instanceof GateInput){
							attachment_gate.attach.attach = undefined;
							attachment_gate.attach = undefined;
						}
						if(attachment_gate.attach instanceof Display){
							attachment_gate.attach.attach = undefined;
							attachment_gate.attach = undefined;
						}
					}
					if(attachment_gate instanceof GateInput){
						if(!isset(this.inputA)){
							this.inputA = attachment_gate;
							attachment_gate.attach = this;
						}else{
							if(this.inputA instanceof GateInput){
								this.inputA.attach = undefined;					
							}
							if(this.inputA instanceof Gate){
								this.inputA.output = undefined;		
							}
							this.inputA = undefined;

							this.inputA = attachment_gate;
							attachment_gate.attach = this;
						}
					}
					if(attachment_gate instanceof Gate){
						if(!isset(this.inputA)){
							this.inputA = attachment_gate;
							attachment_gate.output = this;
						}else{
							if(this.inputA instanceof GateInput){
								this.inputA.attach = undefined;
							}
							if(this.inputA instanceof Gate){
								this.inputA.output = undefined;
							}
							this.inputA = undefined;

							this.inputA = attachment_gate;
							attachment_gate.output = this;
						}
					}
					break;

				case "b":
					if(isset(attachment_gate.attach)){
						if(attachment_gate.attach instanceof Gate){
							attachment_gate.attach.output = undefined;
							attachment_gate.attach = undefined;
						}
						if(attachment_gate.attach instanceof GateInput){
							attachment_gate.attach.attach = undefined;
							attachment_gate.attach = undefined;
						}
						if(attachment_gate.attach instanceof Display){
							attachment_gate.attach.attach = undefined;
							attachment_gate.attach = undefined;
						}
					}
					if(attachment_gate instanceof GateInput){
						if(!isset(this.inputB)){
							this.inputB = attachment_gate;
							attachment_gate.attach = this;
						}else{
							if(this.inputB instanceof GateInput){
								this.inputB.attach = undefined;					
							}
							if(this.inputB instanceof Gate){
								this.inputB.output = undefined;		
							}
							this.inputB = undefined;

							this.inputB = attachment_gate;
							attachment_gate.attach = this;
						}
					}
					if(attachment_gate instanceof Gate){
						if(!isset(this.inputB)){
							this.inputB = attachment_gate;
							attachment_gate.output = this;
						}else{
							if(this.inputB instanceof GateInput){
								this.inputB.attach = undefined;
							}
							if(this.inputB instanceof Gate){
								this.inputB.output = undefined;
							}
							this.inputB = undefined;

							this.inputB = attachment_gate;
							attachment_gate.output = this;
						}
					}
					break;

				case "o":
					if(attachment_gate instanceof Display){
						if(isset(attachment_gate.attach)){
							if(attachment_gate.attach instanceof Gate){
								attachment_gate.attach.output = undefined;
								attachment_gate.attach = undefined;
							}
							if(attachment_gate.attach instanceof GateInput){
								attachment_gate.attach.attach = undefined;
								attachment_gate.attach = undefined;
							}
						}
						if(!isset(this.output)){
							this.output = attachment_gate;
							attachment_gate.attach = this;
						}else{
							if(this.output instanceof Display){
								this.output.attach = undefined;
							}
							if(this.output instanceof Gate){
								//TODO: FIX THIS LATER
								if(this === this.output.inputA){
									this.output.inputA = undefined;
								}else{
									this.output.inputB = undefined;
								}
							}
							this.output = undefined;

							this.output = attachment_gate;
							attachment_gate.attach = this;
						}
					}
					break;
			}
		}
		
		this.calculate();
	}

	

	this.move = function(x, y){
		this.xDraw = x;
		this.yDraw = y;
	};

	this.confirmMove = function(){
		this.x = this.xDraw;
		this.y = this.yDraw;
	}

	this.setOutput = function(output){
		this.output = output;
		output.attach = this;
	}

	this.passInVal = function(val){
		this.calculate();
	}

	this.calculate = function(){
		var in1;
		var in2;
		if(isset(this.inputA)){
			in1 = this.inputA.value;			
		}else{
			in1 = 0;
		}
		if(isset(this.inputB)){
			in2 = this.inputB.value;
		}else{
			in2 = 0;
		}

		switch(this.gateType){
			case "and_gate":
				this.value = in1 && in2;
				break;
			case "or_gate":
				this.value = in1 || in2;
				break;
			case "not_gate":
				this.value = invertBit(in1);
				break;
			case "xor_gate":
				if(in1 === in2){
					this.value = 0;
				}else{
					this.value = in1 || in2;
				}
				break;
			default:
				this.value = -1;
				break;
		}

		

		if(isset(this.output)){
			//this.output.passInVal(this.value);
			this.output.value = this.value;
		}
	}

	this.truthTable = function(){
		//if(isset(this.inputA) && isset(this.inputB)){
			switch(this.gateType){
				case "and_gate":
					for(var i = 0; i < 2; i++){
						this.inputA = i;
						for(var j = 0; j < 2; j++){
							this.inputB = j;
							this.output = this.inputA && this.inputB;
							console.log(this.inputA + " <AND> " + this.inputB + " :: " + this.output);
						}
					}
				break;
				case "or_gate":
					for(var i = 0; i < 2; i++){
						this.inputA = i;
						for(var j = 0; j < 2; j++){
							this.inputB = j;
							this.output = this.inputA || this.inputB;
							console.log(this.inputA + " <OR> " + this.inputB + " :: " + this.output);
						}
					}
				break;
				case "xor_gate":
					for(var i = 0; i < 2; i++){
						this.inputA = i;
						for(var j = 0; j < 2; j++){
							this.inputB = j;
							if(this.inputA === this.inputB){
								this.output = 0;
							}else{
								this.output = this.inputA || this.inputB;
							}
							
							console.log(this.inputA + " <XOR> " + this.inputB + " :: " + this.output);
						}
					}
				break;
				case "not_gate":
					for(var i = 0; i < 2; i++){
						this.inputA = i;
						this.output = invertBit(this.inputA);
						console.log("<NOT> "  + this.inputA + " :: " + this.output);
					}	
				break;
			}
			
			
		//}
	};
};
