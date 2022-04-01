console.log("multitimer loaded.");

//adds 0s to the begining of a number such that the minimum width is width
function LeftZeroFillNumber(num, width){
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
	let MS_PER_SEC = 1000;
	let MS_PER_MIN = MS_PER_SEC*60;
	let MS_PER_HOUR = MS_PER_MIN*60;

	let hours = Math.floor(ms / MS_PER_HOUR);
	ms %= MS_PER_HOUR;

	let minutes = Math.floor(ms / MS_PER_MIN);
	ms %= MS_PER_MIN;

	let seconds = Math.floor(ms / MS_PER_SEC);
	ms %= MS_PER_SEC;

	return createDuration(hours, minutes, seconds);
}

//converts a duration in ms to a string in HH:MM:SS
function getDurationAsString(duration){
	let dur = getDurationFromMS(duration);

	let output = LeftZeroFillNumber(dur.hours, 2);
	output += ":";
	output += LeftZeroFillNumber(dur.minutes, 2);
	output += ":";
	output += LeftZeroFillNumber(dur.seconds, 2);

	return output;
}

var timers = [];//list of all the timers
var timerTickInterval = null; //the interval set if any timers exist

var timerRingInterval = null; //the interval to check if any alarms are ringing
var numberOfRingingTimers = 0; //the count of currently ringing timers
var loadedAudio = new Audio("pixbay-alarm-clock-short.mp3"); //the audio that is played when ringing

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
		this.startDate = null;
		this.duration = 1000*60;

		//references to this object for eventlisteners
		let _this = this;

		//event listeners
		this.xButton.addEventListener("click", function(){
			_this.resetEvent(_this);
		});

		this.startButton.addEventListener("click", function(){
			_this.startButtonEvent(_this);
		});
	}

	//toggles between showing the time left and editing the duration
	toggleEditMode(_this){
		_this.timeInput.hidden = !_this.timeInput.hidden;
		_this.timeDisplay.hidden = !_this.timeInput.hidden;
	}

	//function that is called when the x button is clicked
	resetEvent(_this){
		if(_this.startButton.value == "start"){
			mt_deleteTimer(_this);
		}else{
			//remove from ringing timers if ringing
			if(_this.startButton.value == "reset"){
				_this.updateRinger(false);
				this.timeDisplay.style.color = "black";
			}

			//go to edit mode
			_this.startButton.value = "start";
			_this.msOffset = 0;
			_this.startDate = null;
			_this.toggleEditMode(_this);
		}
	}

	//function that updates the ringer when a timer is reset or deleted while ringing
	//turnOn is weather the timer is starting ringing or stopping ringing
	//TODO add options to change sound via url
	//TODO add option to change how much the sound loops
	updateRinger(turnOn){
		if(turnOn){
			numberOfRingingTimers++;
		}else{
			numberOfRingingTimers--;
		}

		//start ringing
		if(numberOfRingingTimers>0){
			if(timerRingInterval == null){
				timerRingInterval = setInterval(function(){
					loadedAudio.play();
				}, 1000);
			}
		}else{
			clearInterval(timerRingInterval);
			timerRingInterval = null;
			loadedAudio.pause();
			loadedAudio.currentTime = 0;
		}
	}

	//function that is called when the start button is clicked
	startButtonEvent(_this){
		if(_this.startButton.value == "start" || _this.startButton.value == "resume"){//if timer should resume
			if(_this.startButton.value == "start"){//if timer needs to read duration
				_this.duration=createDuration(_this.hInput.value, _this.mInput.value, _this.sInput.value).totalMS;
				_this.timeDisplay.innerHTML = getDurationAsString(_this.duration);
				_this.toggleEditMode(_this);
			}

			_this.startButton.value = "pause";
			_this.startDate = new Date();
		}else if(_this.startButton.value == "pause"){//if timer needs to pause
			_this.msOffset += new Date()-_this.startDate;
			_this.startButton.value = "resume";
			_this.startDate = null;
		}else if(_this.startButton.value == "reset"){//if timer needs to reset
			_this.updateRinger(false);
			_this.startButton.value = "start";
			_this.msOffset = 0;
			_this.startDate = null;
			this.timeDisplay.style.color = "black";
			_this.toggleEditMode(_this);
		}
	}

	//function that is called periodically to update the timer
	tick(){
		if(this.startDate != null){
			let difference = new Date()-this.startDate;
			let timeRemaining = this.duration-(difference+this.msOffset);

			if(timeRemaining > 0){
				this.timeDisplay.innerHTML = getDurationAsString(timeRemaining);
			} else if(this.timeDisplay.innerHTML != "Timer over!"){
				this.timeDisplay.innerHTML = "Timer over!";
				this.startButton.value = "reset";
				this.timeDisplay.style.color = "red";
				this.updateRinger(true);
			}
		}
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
