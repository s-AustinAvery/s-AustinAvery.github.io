//event listeners
document.querySelector("#submit").addEventListener("click", gradeQuiz);
document.querySelector("#q10btn").addEventListener("click", markTrue);


//global variables
var score = 0;
var attempts = Number(localStorage.getItem("total_attempts")) || 0;
var q10answer = false;

displayQ4Choices();
displayQ7Choices();

function displayQ4Choices() {
  //choices for Q4 randomized
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  q4ChoicesArray = _.shuffle(q4ChoicesArray);

  const container = document.querySelector("#q4Choices");
  container.innerHTML = "";
  for (let i = 0; i < q4ChoicesArray.length; i++) {
    const val = q4ChoicesArray[i];
    container.innerHTML += `
      <input type="radio" name="q4" id="${val}" value="${val}">
      <label for="${val}">${val}</label>
    `;
  }
}

function displayQ7Choices() {
  //choices for Q7 randomized
  let q7ChoicesArray = ["Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario"];
  q7ChoicesArray = _.shuffle(q7ChoicesArray);

  const container = document.querySelector("#q7Choices");
  container.innerHTML = "";

  for (let i = 0; i < q7ChoicesArray.length; i++) {
    const val = q7ChoicesArray[i];
    container.innerHTML += `
      <input type="radio" name="q7" id="${val}" value="${val}">
      <label for="${val}">${val}</label>
    `;
  }
}

function hookRangeDisplay() {
  const range = document.querySelector("#q8");
  const out = document.querySelector("#q8Val");
  const sync = () => (out.textContent = range.value);
  range.addEventListener("input", sync);
  sync();
}

function isFormValid() {
  let isValid = true;
  let notAnsweredString = "Question(s): ";
  document.querySelector("#validationFdbk").textContent = "";

  let unanswered = [];

  // q1
  if (document.querySelector("#q1").value.trim() === "") unanswered.push("1");

  // q2
  if (document.querySelector("#q2").value === "") unanswered.push("2");

  // q3
  if (
    !document.querySelector("#Jackson").checked &&
    !document.querySelector("#Franklin").checked &&
    !document.querySelector("#Jefferson").checked &&
    !document.querySelector("#Roosevelt").checked
  )
    unanswered.push("3");

  // q4
  if (!document.querySelector('input[name="q4"]:checked'))
    unanswered.push("4");

  // q5
  if (document.querySelector("#q5").value === "") unanswered.push("5");

  // q6
  if (document.querySelector("#q6").value === "") unanswered.push("6");

  // q7
  if (!document.querySelector('input[name="q7"]:checked'))
    unanswered.push("7");

  // q8
  if (document.querySelector("#q8").value === "")
    unanswered.push("8");

  // q9
  if (
    !document.querySelector("#Virginia").checked &&
    !document.querySelector("#Pennsylvania").checked &&
    !document.querySelector("#NewJersey").checked &&
    !document.querySelector("#Oregon").checked
  )
    unanswered.push("9");

  if (unanswered.length > 0) {
    isValid = false;
    notAnsweredString += unanswered.join(", ") + " were not answered.";
    document.querySelector("#validationFdbk").textContent = notAnsweredString;
  }

  return isValid;
}

function rightAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
  document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
  document.querySelector(`#markImg${index}`).innerHTML = `<img src="img/checkmark.png" alt="checkmark">`;
  score += 10;
}

function wrongAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
  document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white";
  document.querySelector(`#markImg${index}`).innerHTML = `<img src="img/xmark.png" alt="xmark">`;
}

function gradeQuiz(e) {
  e.preventDefault();

  //reset persubmit state
  document.querySelector("#validationFdbk").textContent = "";
  score = 0;

  //validate
  if (!isFormValid()) return;

  //read answers
  const q1Response = document.querySelector("#q1").value.trim().toLowerCase();
  const q2Response = document.querySelector("#q2").value;

  //q4 may be unset if nothing selected; guard it
  const q4Checked = document.querySelector('input[name="q4"]:checked');
  const q4Response = q4Checked ? q4Checked.value : "";

  // --- grade Q1 ---
  if (q1Response === "sacramento") rightAnswer(1);
  else wrongAnswer(1);

  // --- grade Q2 ---
  if (q2Response === "mo") rightAnswer(2);
  else wrongAnswer(2);

  // --- grade Q3 ---
  const jeff = document.querySelector("#Jefferson").checked;
  const roos = document.querySelector("#Roosevelt").checked;
  const jack = document.querySelector("#Jackson").checked;
  const frank = document.querySelector("#Franklin").checked;

  if (jeff && roos && !jack && !frank) rightAnswer(3);
  else wrongAnswer(3);

  // --- grade Q4 ---
  if (q4Response === "Rhode Island") rightAnswer(4);
  else wrongAnswer(4);

  // --- grade Q5 ---
  const q5Val = document.querySelector("#q5").value;
  let q5Year = "";
  if (q5Val) {
    q5Year = q5Val.split("-")[0];
  }
  if (q5Year === "1803") rightAnswer(5)
  else wrongAnswer(5);

  // --- grade Q6 ---
  const q6Num = Number(document.querySelector("#q6").value);
  if (q6Num === 3) rightAnswer(6);
  else wrongAnswer(6);
  
  // --- grade Q7 ---
  const q7Checked = document.querySelector('input[name="q7"]:checked');
  const q7Resp = q7Checked ? q7Checked.value : "";
  if (q7Resp === "Lake Superior") rightAnswer(7);
  else wrongAnswer(7);

  // --- grade Q8 ---
  const q8Val = Number(document.querySelector("#q8").value);
  if (q8Val === 134) rightAnswer(8);
  else wrongAnswer(8);

  // --- grade Q9 ---
  const vA = document.querySelector("#Virginia").checked;
  const pA = document.querySelector("#Pennsylvania").checked;
  const nj = document.querySelector("#NewJersey").checked;
  const oR = document.querySelector("#Oregon").checked;
  if (vA && !pA && !nj && !oR) rightAnswer(9);
  else wrongAnswer(9);

  // --- grade Q10 ---
  if (!q10answer) rightAnswer(10); 
  else wrongAnswer(10);

  if (score < 80) {
    document.querySelector("#totalScore").className = "bg-warning text-danger";
  }
  else {
    document.querySelector("#totalScore").className = "bg-success text-white";
    document.querySelector("#resultsMessage").innerHTML = "Congratulations, you've passed!";
    document.querySelector("#resultsMessage").className = "bg-success text-white";
  }
  //display totals
  document.querySelector("#totalScore").innerHTML = `Total Score: ${score}`;

  //attempts (increment, display, and persist)
  attempts += 1;
  document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${attempts}`;
  localStorage.setItem("total_attempts", attempts);
}

function markTrue () {
    q10answer = true;
}

