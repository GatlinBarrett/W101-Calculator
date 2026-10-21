
let baseDamageInput = Number(document.getElementById('baseDamageInput').value);
let damagePercentInput = Number(document.getElementById('damagePercentInput').value);
let pierceInput = Number(document.getElementById('pierceInput').value);
let trapsInput = document.getElementById('trapsInput').checked;
let bladesInput = document.getElementById('bladesInput').checked;

let healthInput = Number(document.getElementById('healthInput').value);
let resistInput = Number(document.getElementById('resistInput').value);

let blades = {};
let bladeNumber = 0;

function newBlade() {
    document.getElementById("bladeContainer").style.display = "block";
}


function addBlade() {
    bladeNumber++;
    
    let bladePercentInput = Number(document.getElementById('bladePercentInput').value);
    let bladeAmountInput = Number(document.getElementById('bladeAmountInput').value);

    blades["blade" + bladeNumber] = {
        percent: bladePercentInput,
        maxAmount: bladeAmountInput
    };
    
    console.log(blades)

    
    // Create a new div for this blade
    const bladeDiv = document.createElement("div");

    // Create the percentage input for this blade
    bladeDiv.textContent = 'Blade Percent: ' + bladePercentInput + '% | Blade Amount Maximum: ' + bladeAmountInput + ' ';

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove Blade";

    // Delete this specific div when clicked
    deleteButton.onclick = function () {
        bladeDiv.remove();
    }
    // Put the button inside the div
    bladeDiv.appendChild(deleteButton);

    // Add the div to the container
    document.getElementById("bladeContainer").appendChild(bladeDiv);

    // document.getElementById("totalDamage").textContent = totalDamage.toFixed(2);

}

let trapPercentInput = Number(document.getElementById('trapPercentInput').value);
let trapAmountInput = Number(document.getElementById('trapAmountInput').value);



function cancelBlade() {
    document.getElementById("bladeContainer").style.display = "none";
}