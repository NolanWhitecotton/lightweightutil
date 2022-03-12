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

var timers = [];//list of all the timers
var timerTickInterval = null; //the interval set if any timers exist
var timerRingInterval = null; //the interval to check if any alarms are ringing
var ringingTimers = 0;

class Timer{
	tick(){
		if(this.startDate != null){
			let difference = new Date()-this.startDate;
			let timeRemaining = this.duration-(difference+this.msOffset);
			
			if(timeRemaining > 0){
				this.timeDisplay.innerHTML = getDurationAsString(timeRemaining);
			} else {
				this.timeDisplay.innerHTML = "Timer over!";
				this.startButton.value = "reset";
				console.log("asd?");
				
				
			}

			//ringing
			//TODO make it so that the ringing can end either when you click [x] or [reset]
			//TODO make it so that ringing continues if a timer is reset but there is still another
			//TODO add options to change sound via url
			//TODO add option to change how much the sound loops
			if(this.timeDisplay.innerHTML == "Timer over!"){
				if(timerRingInterval == null){
					clearInterval(timerRingInterval);
					timerRingInterval = setInterval(function(){
						console.log("ring");
						var audio = new Audio("pixbay-alarm-clock-short.mp3");
						audio.play();//TODO make audio play only when nessacary 
						
					}, 1000);
				}
			}
		}
	}

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
		this.startDate = null;
		this.duration = 1000*60;
		
		//references to this object for eventlisteners
		let _this = this;

		//event listeners
		this.xButton.addEventListener("click", function(){
			if(_this.startButton.value == "start"){
				mt_deleteTimer(_this);
			}else{
				_this.startButton.value = "start";
				_this.msOffset = 0;
				_this.startDate = null;
				_this.timeInput.hidden = false;
				_this.timeDisplay.hidden = true;
			}
		});

		this.startButton.addEventListener("click", function(){
			test();
			if(_this.startButton.value == "start" || _this.startButton.value == "resume"){
				
				if(_this.startButton.value == "start"){
					_this.duration=createDuration(_this.hInput.value, _this.mInput.value, _this.sInput.value).totalMS;
					_this.timeDisplay.innerHTML = getDurationAsString(_this.duration);
					_this.timeInput.hidden = true;
					_this.timeDisplay.hidden = false;
				}
				
				_this.startButton.value = "pause";
				_this.startDate = new Date();
			}else if(_this.startButton.value == "pause"){
				_this.msOffset += new Date()-_this.startDate;
				_this.startButton.value = "resume";
				_this.startDate = null;
			}else if(_this.startButton.value == "reset"){
				clearInterval(timerRingInterval);
				_this.startButton.value = "start";
				_this.msOffset = 0;
				_this.startDate = null;
				_this.timeInput.hidden = false;
				_this.timeDisplay.hidden = true;
			}
		});
	}

}

//adds a timer
function mt_addTimer(){
	//create timer object
	timers.push(new Timer());
	
	//set timertick interval if its not set already
	if(timerTickInterval == null){
		timerTickInterval = setInterval(function(){
			for(let i=0;i<timers.length; i++){
				timers[i].tick();
			}
		}, 100);
	}

	console.log("added timer.");
}

//removes the element passed to it, called by the delete button on the timer
function mt_deleteTimer(element){
	//remove element from the timers array
	let pos = timers.indexOf(element);
	timers.splice(pos, 1);
	
	//delete from DOM
	element.timer.parentNode.removeChild(element.timer);

	//clear timer interval if there are no more timers
	if(timers.length == 0){
		clearInterval(timerTickInterval);
		timerTickInterval = null;
	}
}
