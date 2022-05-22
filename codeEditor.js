function evalTextBox(){
	let shouldContinue = confirm("Eval can be unsafe, do not use this function unless you know exactly what the code is doing. Would you like to proceed?");
	//let shouldContinue = true;//skip the confirmation

	if(shouldContinue){
		//define functions
		let outputDiv = document.getElementById("codeEditorOutput");
		//output(str) - prints str below the textbox
		var output = function(value){
			outputDiv.innerHTML += value + "<br/>";
		}
		
		let input = document.getElementById("codeEditorTextarea").value;
		//reset output span
		outputDiv.innerHTML = "";
		outputDiv.style.color = "white";
		
		//eval, catch errors and set output to red
		let retunVal;
		try{
			returnVal = eval(input);
		}catch(error){
			outputDiv.style.color = "red";
			output(error);
		}

		//display the return value
		let retValueSpan = document.getElementById("codeEditorReturnValue");
		if(returnVal != undefined)
			retValueSpan.innerHTML = "Return value: " + returnVal;
		else
			retValueSpan.innerHTML = "";
	}
}

function initCodeEditorListeners(){
	let codeEditor = document.getElementById("codeEditorTextarea");
	codeEditor.addEventListener("keydown", function(e){
		//allow typing tabs without changing the focus
		if(e.code == "Tab"){
			e.preventDefault();

			if(codeEditor.selectionStart == codeEditor.selectionEnd){
				let selectionStart = codeEditor.selectionStart;
				let selectionEnd = codeEditor.selectionEnd;

				let start = codeEditor.value.substring(0,selectionStart);
				let end = codeEditor.value.substring(selectionEnd, codeEditor.value.length);

				codeEditor.value = start + "\t" + end;
				codeEditor.selectionEnd = selectionEnd+1;
			}else{
				//TODO multi line tab
			}
		}
		//allow ctrl+d to duplicate the currently selected lines
		else if(e.code == "KeyD" && e.ctrlKey){
			e.preventDefault();
			//calculate the begining and end of the line
			let lastOffset = 0;//fixes issue where selecting the end of the line selects after the newline
			if(codeEditor.value[codeEditor.selectionStart] == "\n"){
				lastOffset = -1
			}
			let lastNewLinePos = codeEditor.selectionStart + lastOffset;
			while(lastNewLinePos>=0 && codeEditor.value[lastNewLinePos] != "\n"){
				lastNewLinePos--;
			}
			lastNewLinePos+=1;//adjust to be after the last newline

			let nextNewLinePos = codeEditor.selectionEnd;
			while(nextNewLinePos<codeEditor.value.length && codeEditor.value[nextNewLinePos] != "\n"){
				nextNewLinePos++;
			}

			let startPos = lastNewLinePos;
			let endPos = nextNewLinePos;

			let start = codeEditor.value.substring(0,endPos);
			let end = codeEditor.value.substring(endPos, codeEditor.value.length);

			let newCursorPos = codeEditor.selectionStart;

			//add brackets around the selected line
			/*
			codeEditor.value = codeEditor.value.substring(0,lastNewLinePos) + "[" + 
				codeEditor.value.substring(lastNewLinePos, nextNewLinePos) + "]" + codeEditor.value.substring(nextNewLinePos, codeEditor.value.length);
			*/

			//duplicate the line right after the current line
			codeEditor.value = start + "\n" + codeEditor.value.substring(startPos, endPos) + end;
			codeEditor.selectionEnd = newCursorPos;
		}
	});	
}

function parenWrap(){
    let codeEditor = document.getElementById("codeEditorTextarea");
    codeEditor.value = "(" + codeEditor.value + ")";
}