// Save a variable
localStorage.setItem("baseDamage", 500);

// Load the variable
let baseDamage = localStorage.getItem("baseDamage");

console.log(baseDamage); // "500"

<input type="number" id="baseDamageInput" value="0"></input>