
let blades = [];
let bladeNumber = 0;

function newBlade() {
    document.getElementById("bladeContainer").style.display = "block";
}

function addBlade() {
    bladeNumber++;

    let bladePercentInput = Number(
        document.getElementById("bladePercentInput").value
    );
    let bladeAmountInput = Number(
        document.getElementById("bladeAmountInput").value
    );

    let blade = {
        id: bladeNumber,
        percent: bladePercentInput,
        maxAmount: bladeAmountInput
    };

    blades.push(blade);

    // Create the blade's HTML element
    const bladeDiv = document.createElement("div");
    bladeDiv.id = "blade" + blade.id;
    bladeDiv.className = "bladeEntry";

    bladeDiv.textContent =
        `Blade ${blade.id}: ${blade.percent}% | Amount: ${blade.maxAmount} `;

    // Create its remove button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove Blade";

    deleteButton.onclick = function () {
        removeBlade(blade.id);
    };

    bladeDiv.appendChild(deleteButton);

    // Add it to the existing container
    document.getElementById("bladeList").appendChild(bladeDiv);

    blades.forEach(blade => {
        console.log(blade.percent);
    });

    console.log(blades);
}

function removeBlade(id) {
    // Remove the selected blade from the array
    blades = blades.filter(blade => blade.id !== id);

    // Renumber the remaining blades
    blades.forEach((blade, index) => {
        blade.id = index + 1;
    });

    // Reset the counter
    bladeNumber = blades.length;

    // Remove all displayed blade entries
    const bladeEntries = document.querySelectorAll(
        "#bladeList .bladeEntry"
    );

    bladeEntries.forEach(entry => entry.remove());

    // Recreate the remaining entries with their new IDs
    blades.forEach(blade => {
        const bladeDiv = document.createElement("div");
        bladeDiv.id = "blade" + blade.id;
        bladeDiv.className = "bladeEntry";

        bladeDiv.textContent =
            `Blade ${blade.id}: ${blade.percent}% | Amount: ${blade.maxAmount} `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remove Blade";

        deleteButton.onclick = function () {
            removeBlade(blade.id);
        };

        bladeDiv.appendChild(deleteButton);

        document.getElementById("bladeList").appendChild(bladeDiv);
    });

    console.log(blades);
}

function cancelBlade() {
    document.getElementById("bladeContainer").style.display = "none";
}




let traps = [];
let trapNumber = 0;

function newTrap() {
    document.getElementById("trapContainer").style.display = "block";
}

function addTrap() {
    trapNumber++;

    let trapPercentInput = Number(
        document.getElementById("trapPercentInput").value
    );
    let trapAmountInput = Number(
        document.getElementById("trapAmountInput").value
    );

    let trap = {
        id: trapNumber,
        percent: trapPercentInput,
        maxAmount: trapAmountInput
    };

    traps.push(trap);

    // Create the trap's HTML element
    const trapDiv = document.createElement("div");
    trapDiv.id = "trap" + trap.id;
    trapDiv.className = "trapEntry";

    trapDiv.textContent =
        `Trap ${trap.id}: ${trap.percent}% | Amount: ${trap.maxAmount} `;

    // Create its remove button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove Trap";

    deleteButton.onclick = function () {
        removeTrap(trap.id);
    };

    trapDiv.appendChild(deleteButton);

    // Add it to the existing container
    document.getElementById("trapList").appendChild(trapDiv);

    console.log(traps);
}

function removeTrap(id) {
    // Remove the selected trap from the array
    traps = traps.filter(trap => trap.id !== id);

    // Renumber the remaining traps
    traps.forEach((trap, index) => {
        trap.id = index + 1;
    });

    // Reset the counter
    trapNumber = traps.length;

    // Remove all displayed trap entries
    const trapEntries = document.querySelectorAll(
        "#trapList .trapEntry"
    );

    trapEntries.forEach(entry => entry.remove());

    // Recreate the remaining entries with their new IDs
    traps.forEach(trap => {
        const trapDiv = document.createElement("div");
        trapDiv.id = "trap" + trap.id;
        trapDiv.className = "trapEntry";

        trapDiv.textContent =
            `Trap ${trap.id}: ${trap.percent}% | Amount: ${trap.maxAmount} `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remove Trap";

        deleteButton.onclick = function () {
            removeTrap(trap.id);
        };

        trapDiv.appendChild(deleteButton);

        document.getElementById("trapList").appendChild(trapDiv);
    });

    console.log(traps);
}

function cancelTrap() {
    document.getElementById("trapContainer").style.display = "none";
}



function toggleBlades() {
    const checkbox = document.getElementById("bladesInput");

    if (!checkbox.checked) {
        // Remove all saved blades
        blades = [];

        // Reset the blade counter
        bladeNumber = 0;

        // Remove all displayed trap entries
        document.getElementById("bladeList").innerHTML = "";

        // Hide the trap creation form
        document.getElementById("chooseBlade").style.display = "none";
        document.getElementById("bladeContainer").style.display = "none";
    }
    else {
        // Show the trap creation form
        document.getElementById("chooseBlade").style.display = "block";
    }
}

function toggleTraps() {
    const checkbox = document.getElementById("trapsInput");

    if (!checkbox.checked) {
        // Remove all saved traps
        traps = [];

        // Reset the trap counter
        trapNumber = 0;

        // Remove all displayed trap entries
        document.getElementById("trapList").innerHTML = "";

        // Hide the trap creation form
        document.getElementById("chooseTrap").style.display = "none";
        document.getElementById("trapContainer").style.display = "none";
    }
    else {
        // Show the trap creation form
        document.getElementById("chooseTrap").style.display = "block";
    }
}



function calculateDamage() {
    let baseDamageInput = Number(document.getElementById('baseDamageInput').value);
    let enchantInput = Number(document.getElementById('enchantInput').value);
    let damagePercentInput = Number(document.getElementById('damagePercentInput').value);
    let pierceInput = Number(document.getElementById('pierceInput').value);
    let trapsInput = document.getElementById('trapsInput').checked;
    let bladesInput = document.getElementById('bladesInput').checked;
    let healthInput = Number(document.getElementById('healthInput').value);
    let resistInput = Number(document.getElementById('resistInput').value);

    totalDamage = (baseDamageInput + enchantInput) * (1 + damagePercentInput) * (1 - ((resistInput / 100) - (pierceInput / 100)))
    console.log(totalDamage)

    // if (totalDamage <= healthInput) {
    //     if (trapsInput === true && bladesInput === true && ) {

    //     }
    // }
}

