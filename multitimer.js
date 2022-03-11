console.log("multitimer loaded.");

//adds 0s to the begining of a number such that the minimum width is width
function leftPadNumber(num, width){
	let string = "" + num;
	
	let output = "";
	for(let i=string.length;i<width;i++){
		output += "0";
	}
	output += string;
	
	return output;
}

function createDuration(h,m,s){
	let ms = s * 1000 + m * 1000*60 + h*1000*60*60;
	return {hours: h, minutes: m, seconds: s, totalMS: ms};
}

//converts a duration in ms to a duration object
function getDurationFromMS(ms){
	let secConstant = 1000;
	let minConstant = secConstant*60;
	let hourConstant = minConstant*60;

	let hours = Math.floor(ms / hourConstant);
	ms %= hourConstant;
	
	let minutes = Math.floor(ms / minConstant);
	ms %= minConstant;
	
	let seconds = Math.floor(ms / secConstant);
	ms %= secConstant;
	
	return createDuration(hours, minutes, seconds);
}

//converts a duration in ms to a string in HH:MM:SS
function getDurationAsString(duration){
	let dur = getDurationFromMS(duration);
	
	let output = "";
	output += leftPadNumber(dur.hours, 2);
	output += ":";
	output += leftPadNumber(dur.minutes, 2);
	output += ":";
	output += leftPadNumber(dur.seconds, 2);
	
	return output;
}

var timers = [];

class Timer{
	constructor(){
		//init element fragment
		let element = timer_tmplt.content.cloneNode(true);
		this.timer = element.querySelector(".timer");//the element that this timer object corresponds to
		
		//add element to dom
		document.getElementById("timers").appendChild(element);
		
		//element references
		this.xButton = this.timer.querySelector(".x-button");
		this.startButton = this.timer.querySelector(".start-button");
		this.timeDisplay = this.timer.querySelector(".time-display");
		this.timeInput = this.timer.querySelector(".time-input");
		this.hInput = this.timer.querySelector(".h-input");
		this.mInput = this.timer.querySelector(".m-input");
		this.sInput = this.timer.querySelector(".s-input");
		
		//default variable values
		this.msOffset = 0;
		this.startdate = null;
		this.duration = 1000*60;
		this.interval = null;//TODO this could be done in a batches, where you iterate through all the timers in a single interval, and then update the time to save on cpu time
		
		//references to this object for eventlisteners
		let _this = this;
		
		//event listeners
		this.xButton.addEventListener("click", function(){
			if(_this.startButton.value == "start"){
				mt_deleteTimer(_this);
			}else{
				_this.startButton.value = "start";
				_this.msOffset = 0;
				_this.startdate = null;
				clearInterval(_this.interval);
				_this.timeInput.hidden = false;
				_this.timeDisplay.hidden = true;
			}
		});

		this.startButton.addEventListener("click", function(){
			if(_this.startButton.value == "start" || _this.startButton.value == "resume"){
				
				if(_this.startButton.value == "start"){
					_this.duration=createDuration(_this.hInput.value, _this.mInput.value, _this.sInput.value).totalMS;
					_this.timeDisplay.innerHTML = getDurationAsString(_this.duration);
					_this.timeInput.hidden = true;
					_this.timeDisplay.hidden = false;
				}
				
				_this.startButton.value = "pause";
				
				_this.startDate = new Date();
				_this.interval = setInterval(function(){//TODO this could be done in a batches, where you iterate through all the timers in a single interval, and then update the time to save on cpu time
					let difference = new Date()-_this.startDate;
					let timeRemaining = _this.duration-(difference+_this.msOffset);
					
					if(timeRemaining > 0){
						_this.timeDisplay.innerHTML = getDurationAsString(timeRemaining);
					} else {
						_this.timeDisplay.innerHTML = "Timer over!";
						_this.startButton.value = "reset";
						clearInterval(_this.interval);
					}
				}, 100);
			}else if(_this.startButton.value == "pause"){
				_this.msOffset += new Date()-_this.startDate;
				_this.startButton.value = "resume";
				clearInterval(_this.interval);
			}else if(_this.startButton.value == "reset"){
	
				_this.startButton.value = "start";
				_this.msOffset = 0;
				_this.startdate = null;
				clearInterval(_this.interval);
				_this.timeInput.hidden = false;
				_this.timeDisplay.hidden = true;
			}
		});
	}
}

//adds a timer to the dom
function mt_addTimer(){
	timers.push(new Timer());
	console.log("added timer.");
}

//removes the element passed to it, called by the delete button on the timer
function mt_deleteTimer(element){
	//remove element from the timers array
	let pos = timers.indexOf(element);
	timers.splice(pos, 1);
	
	//clear its interval
	clearInterval(element.interval);
	
	//delete from DOM
	element.timer.parentNode.removeChild(element.timer);
}
