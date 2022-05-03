/*******************************/
/*Begin quiz by validating name*/
/*******************************/

//on click validate name and display quiz
$("#startquiz").click(function(){
	
	var usersName = document.getElementById('username').value;
	var nameCheck = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g);
	
	if(nameCheck.test(usersName)){
		$("#homepage").hide();
		$("#container").fadeIn(1000);
		document.getElementById("greeting").innerHTML = `<br><b>Welcome ${usersName}. Good Luck!</b>`;
	}else{
		alert("Enter your name");
	}
});


/********************/
/*on hover show hint*/
/********************/

//hint 1
$("#hintdiv1").hover(function(){
	$("#q1hint").fadeIn();
	}, function(){
	$("#q1hint").fadeOut();
});

//hint 2
$("#hintdiv2").hover(function(){
	$("#q2hint").fadeIn();
	}, function(){
	$("#q2hint").fadeOut();
});

//hint 3
$("#hintdiv3").hover(function(){
	$("#q3hint").fadeIn();
	}, function(){
	$("#q3hint").fadeOut();
});

//hint 4
$("#hintdiv4").hover(function(){
	$("#q4hint").fadeIn();
	}, function(){
	$("#q4hint").fadeOut();
});

//hint 5
$("#hintdiv5").hover(function(){
	$("#q5hint").fadeIn();
	}, function(){
	$("#q5hint").fadeOut();
});


/**********************/
/*dealing with answers*/
/**********************/
var q1answ = "";
var q2answ = "";
var q3answ = "";
var q4answ = "";
var q5answ = "";

//recording answers
function question1Answer(questionNum){
	q1answ = questionNum;
}

function question2Answer(questionNum){
	q2answ = questionNum;
}

function question3Answer(questionNum){
	q3answ = questionNum;
}

function question4Answer(questionNum){
	q4answ = questionNum;
}

function question5Answer(questionNum){
	q5answ = questionNum;
}


//all questions answered check
function submitAnswers(){
	if(q1answ == "" ||
		 q2answ == "" ||
		 q3answ == "" ||
		 q4answ == "" ||
		 q5answ == "") {
		alert("Make sure all questions have been answered.")
	} else {
		document.getElementById("results").innerHTML = `<br><b>You scored ${getGrade()} out of 5</b>`;
		document.getElementById("resultsBottom").innerHTML = `RESULTS for ${document.getElementById('username').value}: You scored ${getGrade()} out of 5`;
		if(getGrade() == 5){
			document.getElementById("perfectScore").innerHTML = `You scored 5/5. Perfect!`;
		}
	}
}

//checking right answers
function getGrade(){
	let rightAnswers = 0;
	if(q1answ == "a"){++rightAnswers;}
	if(q2answ == "b"){++rightAnswers;}
	if(q3answ == "d"){++rightAnswers;}
	if(q4answ == "b"){++rightAnswers;}
	if(q5answ == "c"){++rightAnswers;}
	return rightAnswers;
}






