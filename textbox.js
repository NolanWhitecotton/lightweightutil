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
