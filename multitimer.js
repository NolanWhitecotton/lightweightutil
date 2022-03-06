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

//adds a timer to the dom
function mt_addTimer(){
	console.log("added timer.");
	
	//timer div
	let timerDiv = document.createElement("span");
	document.getElementById("timers").appendChild(timerDiv);
	
	//the name of the timer
	let timerName = document.createElement("input");
	timerName.type = "span";
	timerName.value = "Timer";
	timerDiv.appendChild(timerName);
	
	//the timer delete button
	let timerDelete = document.createElement("input");
	timerDelete.type = "button";
	timerDelete.value = "x";
	timerDelete.addEventListener("click",function(){
		if(timerPause.value == "start"){
			mt_deleteTimer(this.parentNode);
		}else{
			timerPause.value = "start";
			timerPause.msOffset = 0;
			timerPause.startdate = null;
			clearInterval(timerDiv.interval);
			stoppedTimerInput.hidden = false;
			runningTimerText.hidden = true;
		}
	});
	timerDiv.appendChild(timerDelete);
	
	//line break
	let timerBreak = document.createElement("br");
	timerDiv.appendChild(timerBreak);
	
	//pause/start/reset/resume button
	let timerPause = document.createElement("input");
	timerPause.type = "button";
	timerPause.value = "start";
	timerPause.msOffset = 0;
	timerPause.startdate = null;
	timerPause.duration = 1000*60;
	timerPause.addEventListener("click", function(){
		if(timerPause.value == "start" || timerPause.value == "resume"){
			
			if(timerPause.value == "start"){
				timerPause.duration=createDuration(hrInput.value, minInput.value, secInput.value).totalMS;
				runningTimerText.innerHTML = getDurationAsString(timerPause.duration);
				stoppedTimerInput.hidden = true;
				runningTimerText.hidden = false;
			}
			
			timerPause.value = "pause";
			
			timerPause.startDate = new Date();
			timerDiv.interval = setInterval(function(){//TODO this could be done in a batches, where you iterate through all the timers in a single interval, and then update the time to save on cpu time
				let difference = new Date()-timerPause.startDate;
				let timeRemaining = timerPause.duration-(difference+timerPause.msOffset);
				
				if(timeRemaining > 0){
					runningTimerText.innerHTML = getDurationAsString(timeRemaining);
				} else {
					runningTimerText.innerHTML = "Timer over!";
					timerPause.value = "reset";
					clearInterval(timerDiv.interval);
				}
			}, 100);
		}else if(timerPause.value == "pause"){
			timerPause.msOffset += new Date()-timerPause.startDate;
			timerPause.value = "resume";
			clearInterval(timerDiv.interval);
		}else if(timerPause.value == "reset"){

			timerPause.value = "start";
			timerPause.msOffset = 0;
			timerPause.startdate = null;
			clearInterval(timerDiv.interval);
			stoppedTimerInput.hidden = false;
			runningTimerText.hidden = true;
		}
	});
	timerDiv.appendChild(timerPause);
	
	//text that displays the current time left 
	let runningTimerText = document.createElement("span");
	runningTimerText.innerHTML = "";
	runningTimerText.hidden = true;
	timerDiv.appendChild(runningTimerText);
	
	//input field for the time
	let stoppedTimerInput = document.createElement("span");
	timerDiv.appendChild(stoppedTimerInput);
	
	let hrInput = document.createElement("input");
	hrInput.type = "text";
	hrInput.placeholder = "HH";
	hrInput.style.width = "3ch";
	stoppedTimerInput.appendChild(hrInput);
	
	let colon1 = document.createElement("span");
	colon1.innerHTML = ":";
	stoppedTimerInput.appendChild(colon1);
	
	let minInput = document.createElement("input");
	minInput.type = "text";
	minInput.placeholder = "MM";
	minInput.style.width = "3ch";
	minInput.value = 1;
	stoppedTimerInput.appendChild(minInput);
	
	let colon2 = document.createElement("span");
	colon2.innerHTML = ":";
	stoppedTimerInput.appendChild(colon2);
	
	let secInput = document.createElement("input");
	secInput.type = "text";
	secInput.placeholder = "SS";
	secInput.style.width = "3ch";
	stoppedTimerInput.appendChild(secInput);
}

//removes the element passed to it, called by the delete button on the timer
function mt_deleteTimer(element){
	clearInterval(element.interval);
	element.parentNode.removeChild(element);
}
