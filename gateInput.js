
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
