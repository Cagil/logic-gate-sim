var HexBit = function(index){
		this.index = index;
		
		this.disabled = false;
		this.showIndex = true;
		this.showDecimal = false;
		
		this.base;
		this.value = 0;
		this.realValue = 0;

		this.MAX_VALUE;
		
		this.x = 0;
		this.y = 0;	

		
		
		this.scale = 1;
		
		this.width = 16*1*(1 + this.scale);
		this.height = 24*1*(1 + this.scale);
		
		this.setPosition = function(x,y){
			this.x = x;		
			this.y = y;
		}
		
		this.setBase = function(val){
			this.base = val;
			this.MAX_VALUE = this.base - 1;
		}
		
		this.toggle = function(){
			if(this.base === 2){
				console.log('base 2');
				if(this.value === 1){
					this.value = 0;
				}else if(this.value === 0){
					this.value = 1;
				}
				this.realValue = this.value;
			}else if(this.base === 8){
				console.log('base 8- ' + this.MAX_VALUE);
				if(this.value < this.MAX_VALUE && this.value >= 0){
					this.value++;
				}else{
					this.value = 0;
				}
				this.realValue = this.value;
			}else if(this.base === 10){
				console.log('base 10');
				if(this.value < this.MAX_VALUE && this.value >= 0){
					this.value++;
				}else{
					this.value = 0;
				}
				this.realValue = this.value;
			}else if(this.base === 16){
				console.log('base 16');
				if(this.value < this.MAX_VALUE && this.value >= 0){
					this.value++;
					//console.log('increamented:' + this.value)
				}else{
					//console.log('SIFIRLANDIpanpaaaa ' + this.value)
					this.value = 0;
					//console.log('panpaaaaaaa');
				}
				this.realValue = getHexValue(this.value);
			}
		};
		
		this.getValue = function(){
			return this.value;
		}

		this.getRealValue = function(){
			return this.realValue;
		}
		
		this.setScale = function(val){
			if(val > 1){
				this.scale = 1;
			}else if(val < 0){
				this.scale = 0.1;
			}else{
				this.scale = val;
			}
			
			this.width = 16*1*(1 + this.scale);
			this.height = 24*1*(1 + this.scale);			
		}
		
		this.isClicked = function(mouse){
			//var old = this.value;
			if(!this.disabled){
				if(mouse.x >= this.x && mouse.x <= (this.x + this.width) && mouse.y >= this.y && mouse.y <= (this.y + this.height)){
					console.log('clicked hex bit');
					this.toggle();
					//alert('Old value: ' + old + '  New value is: ' + this.value);
					return true;
				}
					return false;
			}
			return false;
		}

		this.isFocused = function(mouse){
			if(!this.disabled){
				if(mouse.x >= this.x && mouse.x <= (this.x + this.width) && mouse.y >= this.y && mouse.y <= (this.y + this.height)){
					//this.showDecimal = true;
					//alert('Old value: ' + old + '  New value is: ' + this.value);
					return true;
				}
					//this.showDecimal = false;
					return false;
			}
			//this.showDecial = false;
			return false;
		}
		
		this.draw = function(context){
			context.beginPath();
			
			context.rect(this.x,this.y, this.width, this.height);
			if(this.disabled){
				context.fillStyle = "rgb(200,0,0)";
				context.fillRect(this.x, this.y, this.width, this.height);
			}
			context.linewidth = 2;
			context.strokeStyle = "black";
			context.stroke();
				
			context.font = '10pt Calibri';
			context.fillStyle = 'black';
			context.fillText(this.realValue, this.x + (this.width/2) - 4, this.y + (this.height/2) + 4);
			
		
			if(this.showIndex){
				context.font = '7pt Calibri';
				context.fillStyle = 'black';
				context.fillText(this.index, this.x + (this.width/2) - 8, this.y - 5);
			}

			if(this.showDecimal){
				context.font = '10pt Calibri';
				context.fillStyle = 'red';
				context.fillText(this.value, this.x + (this.width + 10), this.y + (this.height/2) + 4);
			}
			
		}
}


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


var Hex8 = function(base, size){	
		this.base = base;
		this.size = size;
		
		this.signed_magnitude = false;
		this.negative = false;
		
		this.twosComplement = false;
		
		
		this.bits = [];
		
		this.decimal = 0;
		
		this.x = 0;
		this.y = 0;	
		
		this.showDecimal = true;
		this.showDetail = true;
		this.showIndecies = false;
		
		this.name = '';
		
		this.scale = 1;
		
		this.minHeight = 24;
		this.minWidth = 16;
		this.width = 128*1*(1 + this.scale);
		this.height = 24*1*(1 + this.scale);
		
		//properties must be set before calling init.
		//init function has to be called before anything else can be used with the instance.
		this.init = function(x, y){
			this.x = x;
			this.y = y;
			
			//Creating the bits.
			var totalSize = this.size;
			//if(this.extraBit){
			//	totalSize += 1;
			//}

			if(this.base === 2){
				for(var i = 0; i < this.size; i++){
					this.bits[i] = new bit(i);
					
					this.bits[i].base = this.base;
					//console.log('earlybit(' + i + '):: ' + this.bits[i]);
				}
			}else if(this.base === 8){
				for(var i = 0; i < this.size; i++){
					this.bits[i] = new HexBit(i);
					this.bits[i].setBase(this.base);
				}
			}else if(this.base === 10){
				for(var i = 0; i < this.size; i++){
					this.bits[i] = new HexBit(i);
					this.bits[i].setBase(this.base);
				}
			}else if(this.base === 16){
				for(var i = 0; i < this.size; i++){
					this.bits[i] = new HexBit(i);
					
					this.bits[i].setBase(this.base);
					//console.log('earlybit(' + i + '):: ' + this.bits[i]);
				}	
			}
			
			
			//for binaries using signed magnitude system
			if(this.signed_magnitude){
				this.bits[this.size - 1].disabled = true;
				if(this.negative){
					this.bits[this.size - 1].value = 1;				
				}
			}

			// for tutorial purposes, ONLY used in conversion from decimal to binary
			if(this.showIndecies){
				for(var i = 0; i< this.bits.length; i++){
					this.bits[i].showIndex = true;
				}
			}

			/*if(this.twosComplement){
				if(this.extraBit){
					this.bits[this.size].disabled = true;
				}else{
					this.bits[this.size - 1].disabled = true;
				}			
			}*/
			

			//TODO fix dimensions
			var temp_bit_width = this.bits[0].width;
			var temp_bit_height = this.bits[0].height;
			
			//console.log('temp_bit_width:'+temp_bit_width);
			temp_bit_width = temp_bit_width* this.size;
			
			//console.log('temp_bit_width*size:'+temp_bit_width);
			
			this.width = temp_bit_width ;//* 1 * (1+this.scale);
			
			//this.width = temp_bit_width * 1 * (1 + this.scale);
			//this.height = temp_bit_height * 1 * (1 + this.scale);
			
			//adjusting the position for the first bit box to be placed
			//-1: 1units from left and right empty spaces
			//-bit.width: is the offset of the bit box, otherwise first box would be placed outside of the 8bit container box.
			//var horizatan_offset = ((this.width/16))/2;
			var vertical_offset = (this.height/24)/2;
			var posx = this.x + this.width - this.bits[0].width;
			var posy = this.y + vertical_offset;
			console.log(this.bits);
			for(var i = 0; i < this.bits.length; i++){
				this.bits[i].setPosition(posx, posy);
				this.bits[i].setScale(this.scale);
				posx -= this.bits[i].width;		
			//console.log('laterbit(' + i + '):: ' + this.getBit[i]);				
			}	
			
			this.calculate();
		}
		
		this.getBit = function(index){
			console.log('->in getBit(' + index + ') / ' + this.bits.length);
			if(index <= this.bits.length){
				console.log('getBit IF:' + index >= 0 && index < this.bits.length);
				console.log('return:' + this.bits[index]);
				return this.bits[index];
			}
		}
			
		this.draw = function(context){
			context.beginPath();		
			context.rect(this.x,this.y, this.width, this.height);
			//context.fillStyle = "blue";
			context.linewidth = 2;
			context.strokeStyle = "grey";
			context.stroke();
			
			var string = '';	
			for(var i = 0; i < this.bits.length; i++){
				//console.log(i+' inDraw::' + this.bits[i]);
				
				this.bits[i].draw(context);
				//var current_bit = this.getBit(i);
				//current_bit.draw(context);
				
				//DRAWING NEGATIVE / POSITIVE / TWOS COMPLEMENT LABELS
				if(this.showDetail){
					context.font = '9pt Calibri';
					context.fillStyle = 'red';
					if(this.bits[i].disabled){
						if(!this.twosComplement){							
							if(this.bits[i].value === 1){
								string = 'negative';
							}else if(this.bits[i].value === 0){
								string = 'positive';
							}	
						}else{
							string = 'Discarded';
						}			
						context.fillText(string, this.bits[i].x, this.bits[i].y + (this.bits[i].height) + 10);
					}
					
				}
			}
			
			//resetting string value
			string = '';
			context.font = '12pt Calibri';
			context.fillStyle = 'red';
			
			//if(this.name != undefined){				
				string = this.name.toUpperCase() + ' ';			
			//}
			if(this.showDecimal){
				//rendering the decimal value
				if(this.name.toUpperCase() != 'carry'.toUpperCase()){
					string = string + '= ' + this.decimal;	
				}						
			}
			context.fillText(string, this.x + this.width + 5, this.y + (this.height/2) + 4);
		};
		
		this.isClicked = function(mouse){
			if(mouse.x >= this.x && mouse.x <= (this.x + this.width) && mouse.y >= this.y && mouse.y <= (this.y + this.height)){
				console.log('mouse in side binary box');
				var loopLength = this.bits.length;
				if(this.signed_magnitude){
					loopLength = this.bits.length - 1;
				}
				for(var i = 0; i<this.bits.length; i++){
					if(this.bits[i].isClicked(mouse) == true){
						console.log('toggling bit bitch');
						this.calculate();
						return true;
					}
				}
			}else{
				return false;
			}
		}
		
		this.isFocused = function(mouse){
			if(mouse.x >= this.x && mouse.x <= (this.x + this.width) && mouse.y >= this.y && mouse.y <= (this.y + this.height)){
				return true;
			}else{
				return false;
			}
		}
		
		this.calculate = function(){			
			var sum = 0;
			if(this.base === 16){
				for(var i = 0; i < this.size; i++){
					if(!this.bits[i].disabled){				
						if(this.bits[i].value <= this.bits[i].MAX_VALUE && this.bits[i].value > 0){
							var index_value = this.bits[i].value*(Math.pow(this.base,this.bits[i].index));												
								sum += index_value;										
						}else{
							continue;
						}
					}
				}

				this.decimal = sum;

				return sum;
			}else if(this.base === 10){
				for(var i = 0; i < this.size; i++){
					if(!this.bits[i].disabled){
						if(this.bits[i].value <= this.bits[i].MAX_VALUE && this.bits[i].value > 0){
							var index_value = this.bits[i].value*(Math.pow(this.base, this.bits[i].index));
							sum += index_value;
						}
					}
				}
				this.decimal = sum;
				return sum;
			}else if(this.base === 8){
				for(var i = 0; i < this.size; i++){
					if(!this.bits[i].disabled){
						if(this.bits[i].value <= this.bits[i].MAX_VALUE && this.bits[i].value > 0){
							var index_value = this.bits[i].value*(Math.pow(this.base,this.bits[i].index));
							sum += index_value;
						}else{
							continue;
						}
					}
				}
				this.decimal = sum;
				return sum;
			}
	

			if(!this.twosComplement){
				console.log('calculate func: bit length '+this.bits.length);
				for(var i = 0; i < this.size; i++){
					if(!this.bits[i].disabled){				
						if(this.bits[i].value === 1){
							var index_value = Math.pow(this.base,this.bits[i].index);												
								sum += index_value;										
						}else{
							continue;
						}
					}else{				
						//checks if signed_magnitude is set TRUE
						//checks if negative is set TRUE
						//then checks if ONLY the last bit ( left most, sign indicating bit) where the pointer(i) is at)
						if(this.signed_magnitude && this.negative && (i === (this.size - 1))){
							//var index_value = Math.pow(this.base,this.bits[i].index);
							//sum -= index_value;	
							sum *= -1;
							break;
						}
					}
				}				
			}else{
				var discarded = [this.size -1,this.bits[this.size - 1].disabled];
				for(var i = 0; i < this.size; i++){
					if(!this.bits[i].disabled){
						if(discarded[1] === true && i === discarded[0] - 1){
							var sign_val = -1 * this.bits[i].value * Math.pow(this.base, this.bits[i].index);
						console.log('bitch im fucking this up');
						sum += sign_val;	

						}else if(discarded[1] === false && i === this.size - 1){
							var sign_val = -1 * this.bits[i].value * Math.pow(this.base, this.bits[i].index);
							console.log('bitch im fucking this up');
							sum += sign_val;
						}
						else if(this.bits[i].value === 1){
							var index_value = Math.pow(this.base, this.bits[i].index);
							sum += index_value;
						}else{
							continue;
						}
					}else{
						/*//normal binary signed but not negative place weighted
						if(i === (this.size - 2)){
						var sign_val = -1 * this.bits[i].value * Math.pow(this.base, this.bits[i].index);
						//console.log('twooos complement hellooooo');
						sum += sign_val;
						break;
					}*/
				}
				}

			}

			this.decimal = sum;
			console.log('DECIMAL: ' + this.decimal);
			console.log('SUM: ' + sum);
			return sum;
		}
		
		this.increamentSize = function(){
			this.size++;
			this.bits.push(new bit(this.size-1));
			var index = this.size - 1;
			this.bits[index].base = this.base;
			this.positionBits();
		}
		
		this.positionBits = function(){
			var temp_bit_width = this.bits[0].width;
			var temp_bit_height = this.bits[0].height;
			
			//console.log('temp_bit_width:'+temp_bit_width);
			temp_bit_width = temp_bit_width* this.size;
			
			//console.log('temp_bit_width*size:'+temp_bit_width);
			
			this.width = temp_bit_width ;//* 1 * (1+this.scale);
			
			//this.width = temp_bit_width * 1 * (1 + this.scale);
			//this.height = temp_bit_height * 1 * (1 + this.scale);
			
			//adjusting the position for the first bit box to be placed
			//-1: 1units from left and right empty spaces
			//-bit.width: is the offset of the bit box, otherwise first box would be placed outside of the 8bit container box.
			//var horizatan_offset = ((this.width/16))/2;
			var vertical_offset = (this.height/24)/2;
			var posx = this.x + this.width - this.bits[0].width;
			var posy = this.y + vertical_offset;
			for(var i = 0; i < this.bits.length; i++){
				this.bits[i].setPosition(posx, posy);
				this.bits[i].setScale(this.scale);
				posx -= this.bits[i].width;		
			//console.log('laterbit(' + i + '):: ' + this.getBit[i]);				
			}	
		}
		
		this.calculateBinary = function(dec){
			var start_point;
			//reset the values
			for(var i = 0; i < this.bits.length; i++){
				this.bits[i].value = 0;				
			}
			
			console.log('RESET FINISHED!');
			for(var i = this.bits.length-1; i>-1; i--){
				if(dec === 0){
					this.bits[i].value = 0;
					continue;
				}
				var pow = Math.pow(this.bits[i].base, this.bits[i].index);
				console.log('i:' + i + ' pow:' + pow);
				//console.log();
				if(pow <= dec){
					dec -= pow;
					console.log('i:'+i + ' pow:'+pow + ' remainder:'+dec);
					this.bits[i].value = 1;
					this.calculate();
				}
			}
			this.calculate();
		}

		this.setTo = function(dec){
			switch(this.base){
				case 2: 
					for(var i = 0; i < this.bits.length; i++){
						this.bits[i].value = 0;				
					}
					
					console.log('RESET FINISHED!');
					for(var i = this.bits.length-1; i > -1; i--){
						if(dec === 0){
							this.bits[i].value = 0;
							continue;
						}
						var pow = Math.pow(this.bits[i].base, this.bits[i].index);
						console.log('i:' + i + ' pow:' + pow);
						//console.log();
						if(pow <= dec){
							dec -= pow;
							console.log('i:'+i + ' pow:'+pow + ' remainder:'+dec);
							this.bits[i].value = 1;
							this.bits[i].realValue = 1;
							this.calculate();
						}
					}
					this.calculate();
					break;
					
				case 8: 
				case 10:
				case 16:
					for(var i = 0; i < this.bits.length; i++){
						this.bits[i].value = 0;
					}

					for(var i = this.bits.length - 1; i > -1; i--){
						if(dec === 0){
							this.bits[i],value = 0;
							continue;
						}

						var pow = Math.pow(this.bits[i].base, this.bits[i].index);
						if(pow <= dec){
							var rem = Math.floor(dec / pow);
							dec -= (pow*rem);

							this.bits[i].value = rem;
							this.bits[i].realValue = getHexValue(rem);
							console.log(i+'..' + this.bits[i].realValue + "/ " + rem);
						}else{
							continue;
						} 
					}
					this.calculate();
					break;
				default: 
					console.log('DEFAULT CALL!!!!!');
				return null;
			}
		}
	}



	var BinaryToHexOct = function(){
		this.x = 0;
		this.y = 0;

		this.width = 0;
		this.height = 0;

		this.size = 16;

		var octal_size = (this.size/3) + (this.size - 3*(this.size/3));
		var hexa_size = (this.size/4) + (this.size - 4*(this.size/4));
		var deci_size = this.size/2;

		this.binary = new Hex8(2, this.size);
		this.octal = new Hex8(8, octal_size);
		this.hexa = new Hex8(16, hexa_size);
		this.decimal = new Hex8(10, this.size/2);


		this.init = function(x, y){
			this.x = x;
			this.y = y;
			
			var xpos = this.x;
			var ypos = this.y;
			
			this.binary.init(this.x, this.y);
			this.binary.showDecimal = true;
			this.binary.name = 'Binary';			
						
			ypos += this.binary.height + 3;
			xpos += (this.binary.size - this.octal.size)*32;
			
			this.octal.init(xpos, ypos);
			this.octal.showDecimal = true;
			this.octal.name = 'Octal';

			ypos += this.octal.height + 3;
			xpos = this.x;
			xpos += (this.binary.size - this.hexa.size)*32;

			this.hexa.init(xpos, ypos);
			this.hexa.showDecimal = true;
			this.hexa.name = 'Hexadecimal';

			ypos += this.hexa.height + 3;
			xpos = this.x;
			xpos += (this.binary.size - this.decimal.size)*32;

			this.decimal.init(xpos, ypos);
			this.decimal.showDetail = false;
			this.decimal.showDecimal = true;
			this.decimal.name = 'Decimal';

			console.log('HEXA WIDTH:' + this.binary.width);
			this.width = this.binary.width;
			//getting rid of the y position offset used in positioning the binaries
			this.height = ypos - this.y;
		}

		this.draw = function(context){
			this.binary.draw(context);
			this.octal.draw(context);
			this.hexa.draw(context);
			this.decimal.draw(context);
		}

		this.isClicked = function(mouse){
			if(mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this. y && mouse.y <= this.y + this.height){
				for(var i = 0; i < this.binary.bits.length; i++){
					if(this.binary.bits[i].isClicked(mouse)){
						this.binary.calculate();
						this.calculate();
						return true;
					}else{
						continue
					}
				}
				return false;
			}
			return false;
		}

		this.isFocused = function(mouse){

		}

		this.calculate = function(){
			var hexaBits = [];
			var octaBits = [];

			var counter = 1;
			var index_counter = 0;
			var temp_bit;
			var temp_bit_array = [];

			for(var i = 0; i < this.binary.bits.length; i++, counter++){

				if(this.binary.bits.length - i >= 4){
					console.log("counter->" + counter);
					if(counter === 4){		
						for(var j = i - (counter - 1); j < i + 1; j++, index_counter++){
							console.log("i-> " + j);
							
							//if(this.binary.bits[j].value === 1){
								temp_bit = new HexBit(index_counter);
								temp_bit.setBase(this.binary.base);
								temp_bit.value = this.binary.bits[j].value;
								temp_bit_array.push(temp_bit);
							//}else continue;
							
						}
						console.log('hellooooaaaa');
						if(temp_bit_array.length > 0){
							hexaBits.push(temp_bit_array);
						}
						temp_bit_array = [];
						index_counter = 0;
						counter = 0;
					}else{
						continue;
					}
				}else{			
					for(var j = i - 1; j < this.binary.bits.length; j++, index_counter++){
						console.log("i-> " + j);
						//if(this.binary.bits[j].value === 1){
							temp_bit = new HexBit(index_counter);
							temp_bit.setBase(this.binary.base);
							temp_bit.toggle();
							temp_bit_array.push(temp_bit);
						//}
					}

					if(temp_bit_array.length > 0){
						hexaBits.push(temp_bit_array);
					}
					temp_bit_array = [];
					index_counter = 0;
					counter = 1;
					break;
				}
			}

			//resetting variables
			temp_bit_array = [];
			index_counter = 0;
			counter = 1;

			for(var i = 0; i < this.binary.bits.length; i++,counter++){
				
				if(this.binary.bits.length - i >= 3){
					if(counter ===  3){
						
						for(var j = i - (counter - 1); j < i + 1; j++, index_counter++){
							
							if(this.binary.bits[j].value === 1){
								temp_bit = new HexBit(index_counter);
								temp_bit.setBase(this.binary.base);
								temp_bit.toggle();
								temp_bit_array.push(temp_bit);	
							}else continue;
						}

						if(temp_bit_array.length > 0){
							octaBits.push(temp_bit_array);
						}	
						temp_bit_array = [];
						index_counter = 0;
						counter = 0;
					}else{
						continue;
					}
				}else{
					//j = i - 1, to go back to where we were before checking the binary.bits.length
					for(var j = i - 1; j < this.binary.bits.length; j++, index_counter++){
						
						if(this.binary.bits[j].value === 1){
							temp_bit = new HexBit(index_counter);
							temp_bit.setBase(this.binary.base);
							temp_bit.value = this.binary.bits[j].value;
							temp_bit_array.push(temp_bit);
						}
					}

					if(temp_bit_array.length > 0){
						octaBits.push(temp_bit_array);
					}
					
					temp_bit_array = [];
					index_counter = 0;
					counter = 0;
				}
			}

			//TODO fix this
			var sum = 0;
			console.log('hexlength::' + hexaBits.length);
			for(var i = 0; i < hexaBits.length; i++){
				//console.log('hexabit' + hexaBits[i]);
				var pow = 0;
				for(var j = 0; j < hexaBits[i].length; j++){
					console.log("hexabitvalue:::" + hexaBits[i][j].value);
					pow += hexaBits[i][j].value * (Math.pow(hexaBits[i][j].base,hexaBits[i][j].index));
					sum += pow;
				}
				console.log('HEXA SUM::' + pow);
				this.hexa.bits[i].value = pow;
				this.hexa.bits[i].realValue = getHexValue(pow);
			}
			this.hexa.calculate();
			
			//this.hexa.setTo(sum);
			sum = 0;

			for(var i = 0; i < octaBits.length; i++){
				for(var j = 0; j < octaBits[i].length; j++){
					var pow = octaBits[i][j].value * (Math.pow(octaBits[i][j].base, octaBits[i][j].index));
					sum += pow;
				}
			}	

			console.log('OCTA SUM::' + sum);
			this.octal.setTo(sum);

			sum = this.binary.decimal;
			this.decimal.setTo(sum);
			this.decimal.decimal = sum;
		}
	}