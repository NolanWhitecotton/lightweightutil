//updates the character and word counts of the text area
//words are considered any string of non-whitespace seperated by whitespace on either side
function tb_updateCharacterCounts(){
	let input = document.getElementById("textarea").value;
	
	//character count
	document.getElementById("characterCount").innerHTML = input.length;
	
	//word count
	let truncatedInput = input.trim();
	let words = truncatedInput.split(new RegExp(/\s+/));
	
	let wordCount = 0;
	if(truncatedInput!="")
		wordCount = words.length;
	
	document.getElementById("wordCount").innerHTML = wordCount;
}

//sorts all of the lines in the textbox alphabetically (does not ignore case)
function tb_alphabetizeLines(){
	let input = document.getElementById("textarea");
	let lines = input.value.split("\n");
	lines.sort();

	let output = "";
	for(let i=0; i<lines.length; i++){
		output += lines[i];
		if(i != lines.length-1){//if not the last line
			output += "\n";
		}
	}

	input.value = output;
}
