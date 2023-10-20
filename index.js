const name = document.getElementById("name");

name.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    console.log(name.value);
    storeUser(name.value);
    checkStatus();
  }
})

function storeUser(name) {
  const user = name; // Create the user object
  // Store the user object in localStorage
  localStorage.setItem('user', JSON.stringify(user));
}

function checkStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    console.log(user);
    window.location.href = "homepage.html";
  } else {
    console.log("No user found");
    //focus on the input
    name.focus();
  }
}

checkStatus();