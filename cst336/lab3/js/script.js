document.addEventListener("DOMContentLoaded", () => {
  loadStates();
});

document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("focus", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", function (event) {
  validateForm(event);
});

let usernameAvailable = null;

async function displayCity() {
  const zipCode = document.querySelector("#zip").value.trim();
  const zipError = document.querySelector("#zipError");
  const cityEl = document.querySelector("#city");
  const latEl = document.querySelector("#latitude");
  const lonEl = document.querySelector("#longitude");
  
  //clear first
  zipError.textContent = "";
  cityEl.textContent = "";
  latEl.textContent = "";
  lonEl.textContent = "";

  if (!zipCode) return;

  try {
    const url = `https://csumb.space/api/cityInfoAPI.php?zip=${encodeURIComponent(zipCode)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.city) {
      cityEl.textContent = data.city || "";
      latEl.textContent = data.latitude || "";
      lonEl.textContent = data.longitude || "";
    }
    else {
        zipError.textContent = "Zip code not found";
    }
  } catch (e) {
    zipError.textContent = "Zip code not found";
  }
}

async function displayCounties() {
  const state = document.querySelector("#state").value;
  const countyList = document.querySelector("#county");

  countyList.innerHTML = "<option>Select County</option>";

  if (!state) return;

  try {
    const url = `https://csumb.space/api/countyListAPI.php?state=${encodeURIComponent(state)}`;
    const response = await fetch(url);
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
      countyList.innerHTML += `<option>${data[i].county}</option>`;
    }
  } catch (e) {

  }
}

async function loadStates() {
  const stateSelect = document.querySelector("#state");
  if (!stateSelect) return;

  try {
    const response = await fetch("https://csumb.space/api/allStatesAPI.php");
    if (!response.ok) return;

    const data = await response.json();

    let options = "";
    for (const item of data) {
      const name = item.state;
      const abbr = (item.usps || "").toLowerCase();
      if (name && abbr) {
        options += `<option value="${abbr}">${name}</option>`;
      }
    }
    stateSelect.innerHTML = `<option value="">Select One</option>${options}`;
  } catch (e) {

  }
}

async function checkUsername() {
  const usernameEl = document.querySelector("#username");
  const usernameError = document.querySelector("#usernameError");
  const username = usernameEl.value.trim();

  //clear previous message
  usernameError.textContent = "";
  usernameAvailable = null;

  if (!username) {
    usernameAvailable = false;
    usernameError.textContent = " Username required!";
    usernameError.style.color = "red";
    return;
  }

  try {
    const url = `https://csumb.space/api/usernamesAPI.php?username=${encodeURIComponent(username)}`;
    const response = await fetch(url);
    const data = await response.json();

    usernameAvailable = !!data.available;

    if (usernameAvailable) {
      usernameError.textContent = " Username available!";
      usernameError.style.color = "green";
      toggleAlert("username", false);
    } else {
      usernameError.textContent = " Username taken";
      usernameError.style.color = "red";
      toggleAlert("username", true);
    }
  } catch (e) {
    usernameAvailable = false;
    usernameError.textContent = " Could not verify username. Try again.";
    usernameError.style.color = "red";
    toggleAlert("username", true);
  }
}

function checkPassword() {
  const password = document.querySelector("#password").value;
  const passwordAgain = document.querySelector("#passwordAgain").value;
  const passwordError = document.querySelector("#passwordError");

  passwordError.textContent = "";

  if (password.length < 6) {
    passwordError.textContent = " Password must be at least 6 characters";
    passwordError.style.color = "red";
    return false;
  }
  if (password !== passwordAgain) {
    passwordError.textContent = " Passwords do not match";
    passwordError.style.color = "red";
    return false;
  }
  return true;
}

async function suggestPassword() {
  const target = document.querySelector("#suggestedPwd");
  target.textContent = "";
  try {
    const url = "https://csumb.space/api/suggestedPassword.php?length=8";
    const response = await fetch(url);
    const data = await response.json();
    const pwd = data?.password ?? data?.suggested ?? "";
    if (pwd) {
      target.textContent = ` Suggested: ${pwd}`;
    }
  } catch {

  }
}

function validateForm(e) {
  let isValid = true;

  document.querySelectorAll(".alert-icon").forEach(i => i.classList.remove("visible"));

  const firstName = document.querySelector("#fName").value.trim();
  const lastName = document.querySelector("#lName").value.trim();
  const gender = document.querySelector('input[name="gender"]:checked');
  const zip = document.querySelector("#zip").value.trim();
  const city = document.querySelector("#city").textContent.trim();
  const state = document.querySelector("#state").value;
  const county = document.querySelector("#county").value;
  const username = document.querySelector("#username").value.trim();

  if (!firstName) { toggleAlert("fName", true); isValid = false; }
  if (!lastName) { toggleAlert("lName", true); isValid = false; }
  if (!gender) { toggleAlert("gender", true); isValid = false; }
  if (!zip) { toggleAlert("zip", true); isValid = false; }
  if (!city) {
    toggleAlert("zip", true);
    document.querySelector("#zipError").textContent = "Zip code not found";
    isValid = false;
  }
  if (!state) { toggleAlert("state", true); isValid = false; }
  if (!county || county === "Select County") { toggleAlert("county", true); isValid = false; }
  if (!username) { toggleAlert("username", true); isValid = false; }

  //username availability check
  if (usernameAvailable !== true) {
    toggleAlert("username", true);
    isValid = false;
  }

  //password validation
  if (!checkPassword()) {
    toggleAlert("password", true);
    toggleAlert("passwordAgain", true);
    isValid = false;
  }

  //stop form submission if invalid
  if (!isValid) {
    e.preventDefault();
  }
}

//show/hide alert icons
function toggleAlert(id, show) {
    const icon = document.querySelector(`#${id}Alert`);
    if (icon) {
        icon.classList.toggle("visible", show);
    }
}