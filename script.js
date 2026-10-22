
const savedInputIds = [
    "baseDamageInput",
    "enchantInput",
    "damagePercentInput",
    "pierceInput",
    "healthInput",
    "resistInput"

];

// Save numerical inputs whenever they change
savedInputIds.forEach(id => {
    const input = document.getElementById(id);

    // Restore the previously saved value
    const savedValue = localStorage.getItem(id);

    if (savedValue !== null) {
        input.value = savedValue;
    }

    // Save changes automatically
    input.addEventListener("input", function () {
        localStorage.setItem(id, input.value);
    });
});


// Save and restore checkbox states
const savedCheckboxIds = [
    "bladesInput",
    "trapsInput"
];

savedCheckboxIds.forEach(id => {
    const checkbox = document.getElementById(id);

    // Restore checkbox state
    checkbox.checked = localStorage.getItem(id) === "true";

    // Save whenever checked or unchecked
    checkbox.addEventListener("change", function () {
        localStorage.setItem(id, checkbox.checked);
    });
});




let blades = [];
let bladeNumber = 0;

let traps = [];
let trapNumber = 0;


// ========================
// BLADES
// ========================

function newBlade() {
    document.getElementById("bladeContainer").style.display = "block";
}

function addBlade() {
    bladeNumber++;

    let blade = {
        id: bladeNumber,
        percent: Number(document.getElementById("bladePercentInput").value),
        maxAmount: Number(document.getElementById("bladeAmountInput").value)
    };

    blades.push(blade);

    displayBlade(blade);
    saveBlades();

    console.log(
        [...blades].sort((a, b) => b.percent - a.percent)
    );
}

function displayBlade(blade) {
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
}

function removeBlade(id) {
    blades = blades.filter(blade => blade.id !== id);

    // Renumber remaining blades
    blades.forEach((blade, index) => {
        blade.id = index + 1;
    });

    bladeNumber = blades.length;

    // Clear the displayed entries
    document.getElementById("bladeList").innerHTML = "";

    // Recreate the remaining entries
    blades.forEach(blade => {
        displayBlade(blade);
    });

    saveBlades();

    console.log(blades);
}

function cancelBlade() {
    document.getElementById("bladeContainer").style.display = "none";
}

function saveBlades() {
    localStorage.setItem("blades", JSON.stringify(blades));
}


// ========================
// TRAPS
// ========================

function newTrap() {
    document.getElementById("trapContainer").style.display = "block";
}

function addTrap() {
    trapNumber++;

    let trap = {
        id: trapNumber,
        percent: Number(document.getElementById("trapPercentInput").value),
        maxAmount: Number(document.getElementById("trapAmountInput").value)
    };

    traps.push(trap);

    displayTrap(trap);
    saveTraps();

    console.log(
        [...traps].sort((a, b) => b.percent - a.percent)
    );
}

function displayTrap(trap) {
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
}

function removeTrap(id) {
    traps = traps.filter(trap => trap.id !== id);

    // Renumber remaining traps
    traps.forEach((trap, index) => {
        trap.id = index + 1;
    });

    trapNumber = traps.length;

    // Clear the displayed entries
    document.getElementById("trapList").innerHTML = "";

    // Recreate the remaining entries
    traps.forEach(trap => {
        displayTrap(trap);
    });

    saveTraps();

    console.log(traps);
}

function cancelTrap() {
    document.getElementById("trapContainer").style.display = "none";
}

function saveTraps() {
    localStorage.setItem("traps", JSON.stringify(traps));
}


// ========================
// LOAD SAVED DATA
// ========================

function loadBladesAndTraps() {
    // Restore saved blades
    const savedBlades = localStorage.getItem("blades");

    if (savedBlades !== null) {
        blades = JSON.parse(savedBlades);
    }

    // Restore saved traps
    const savedTraps = localStorage.getItem("traps");

    if (savedTraps !== null) {
        traps = JSON.parse(savedTraps);
    }

    // Restore counters using the highest existing ID
    bladeNumber = blades.reduce(
        (highest, blade) => Math.max(highest, blade.id), 0
    );

    trapNumber = traps.reduce(
        (highest, trap) => Math.max(highest, trap.id), 0
    );

    // Recreate the saved blade entries
    blades.forEach(blade => {
        displayBlade(blade);
    });

    // Recreate the saved trap entries
    traps.forEach(trap => {
        displayTrap(trap);
    });

    console.log("Loaded blades:", blades);
    console.log("Loaded traps:", traps);
}


// Run when this script reaches the bottom
// after the HTML elements have been created
loadBladesAndTraps();


function displayBlade(blade) {
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
}

function displayTrap(trap) {
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
}



function toggleBlades() {
    const checkbox = document.getElementById("bladesInput");

    if (!checkbox.checked) {
        // Remove all saved blades
        blades = [];

        // Reset the blade counter
        bladeNumber = 0;

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

        // Hide the trap creation form
        document.getElementById("chooseTrap").style.display = "none";
        document.getElementById("trapContainer").style.display = "none";
    }
    else {
        // Show the trap creation form
        document.getElementById("chooseTrap").style.display = "block";
    }
}

const container = document.getElementById("percentUsed");
let bladeDamage = 0
let resistInput = 0
let pierceInput = 0

function calculateDamage() {
    container.innerHTML = "";
    let baseDamageInput = Number(document.getElementById('baseDamageInput').value);
    let enchantInput = Number(document.getElementById('enchantInput').value);
    let damagePercentInput = Number(document.getElementById('damagePercentInput').value);
    pierceInput = Number(document.getElementById('pierceInput').value);
    let trapsInput = document.getElementById('trapsInput').checked;
    let bladesInput = document.getElementById('bladesInput').checked;
    let healthInput = Number(document.getElementById('healthInput').value);
    resistInput = Number(document.getElementById('resistInput').value);

    totalDamage = (baseDamageInput + enchantInput) * (1 + (damagePercentInput / 100)) * (1 - ((resistInput / 100) - (pierceInput / 100)))
    console.log(totalDamage)
    bladeDamage = totalDamage
    //

    // CALCULATE TOTAL DAMAGE OF BLADES AND TRAPS

    //
    if (trapsInput === true && bladesInput === true) {
        // Blades highest to lowest
        let sortedBlades = [...blades]
            .map(blade => ({ ...blade, type: "Blade" }))
            .sort((a, b) => b.percent - a.percent);

        console.log(sortedBlades);

        // Traps highest to lowest
        let sortedTraps = [...traps]
            .map(trap => ({ ...trap, type: "Trap" }))
            .sort((a, b) => b.percent - a.percent);

        console.log(sortedTraps)

        // Sort traps and blades from highest to lowest percent
        let allModifiers = [
            ...sortedBlades.map(blade => ({ ...blade })),
            ...sortedTraps.map(trap => ({ ...trap }))
        ];

        allModifiers.sort((a, b) => b.percent - a.percent);

        console.log(allModifiers);
        for (let modifier of allModifiers) {
            let totalAmount = 1
            // Stop if damage has already reached the target
            if (totalDamage >= healthInput) {
                break;
            }
            // Cycle through each blade/trap
            let percent = modifier.percent;
            let maxAmount = modifier.maxAmount;
            let id = modifier.id;
            let type = modifier.type;

            // start multiplying the percentages into the
            // damage until it meets/exceeds the health amount
            if (totalAmount === 1) {
                console.log(totalDamage)
                totalDamage *= (1 + (percent / 100));
                console.log(totalDamage)
            }
            while (totalAmount < maxAmount && totalDamage <= healthInput) {
                totalAmount++
                totalDamage *= (1 + (percent / 100));
                console.log(`${type} ${id}: ${percent}%`);
                console.log("Total damage:", totalDamage)
                console.log('Amount used: ' + totalAmount)
                console.log('Blade Damage: ' + bladeDamage)

                if (type === "Blade") {
                    bladeDamage *= (1 + (percent / 100))
                    console.log('Blade Damage: ' + bladeDamage)
                }

                // Create a new div
                let percentDiv = document.createElement("div");

                // Add content to the div
                percentDiv.textContent = percent + '% ' + type + ': x' + totalAmount;

                // Give it a class for styling
                percentDiv.classList.add("percentages");

                // Put it inside the container
                container.appendChild(percentDiv);

                if (totalDamage >= healthInput) {
                    break
                }

            }

            // Only Blade Damage
            if (type === "Blade") {
                bladeDamage *= (1 + (percent / 100))
                console.log('Blade Damage: ' + bladeDamage)
            }


            if (totalAmount === 1) {
                // Create a new div
                let percentDiv = document.createElement("div");

                // Add content to the div
                percentDiv.textContent = percent + '% ' + type + ': x' + totalAmount;

                // Give it a class for styling
                percentDiv.classList.add("percentages");

                // Put it inside the container
                container.appendChild(percentDiv);
            }

            if (totalDamage >= healthInput) {
                break
            }



            console.log(`${type} ${id}: ${percent}%`);
            console.log('totalDamage: ' + totalDamage.toFixed(2))
        }
    }

    //

    // CALCULATE TOTAL DAMAGE OF BLADES

    //

    if (trapsInput === false && bladesInput === true) {
        for (let bladeModifier of sortedBlades) {
            let totalAmount = 1
            // Stop if damage has already reached the target
            if (totalDamage >= healthInput) {
                break;
            }
            // Cycle through each blade
            let percent = bladeModifier.percent;
            let maxAmount = bladeModifier.maxAmount;
            let id = bladeModifier.id;
            let type = bladeModifier.type;

            // start multiplying the percentages into the
            // damage until it meets/exceeds the health amount
            while (totalAmount < maxAmount) {
                totalAmount++
                totalDamage *= (1 + (percent / 100));
                console.log(`${type} ${id}: ${percent}%`);
                console.log("Total damage:", totalDamage)
                console.log('Amount used: ' + totalAmount)

                // Create a new div
                let percentDiv = document.createElement("div");

                // Add content to the div
                percentDiv.textContent = percent + '% ' + type + ': x' + totalAmount;

                // Give it a class for styling
                percentDiv.classList.add("percentages");

                // Put it inside the container
                container.appendChild(percentDiv);

                if (totalDamage >= healthInput) {
                    break
                }

            }

            if (totalDamage >= healthInput) {
                break
            }
            totalDamage *= (1 + (percent / 100));
            if (totalAmount === 1) {
                // Create a new div
                let percentDiv = document.createElement("div");

                // Add content to the div
                percentDiv.textContent = percent + '% ' + type + ': x' + totalAmount;

                // Give it a class for styling
                percentDiv.classList.add("percentages");

                // Put it inside the container
                container.appendChild(percentDiv);
            }



            console.log(`${type} ${id}: ${percent}%`);
            console.log('totalDamage: ' + totalDamage.toFixed(2))
        }
    }

    //

    // CALCULATE TOTAL DAMAGE OF TRAPS

    //

    if (trapsInput === true && bladesInput === false) {
        for (let trapModifier of sortedTraps) {
            let totalAmount = 1
            // Stop if damage has already reached the target
            if (totalDamage >= healthInput) {
                break;
            }
            // Cycle through each trap
            let percent = trapModifier.percent;
            let maxAmount = trapModifier.maxAmount;
            let id = trapModifier.id;
            let type = trapModifier.type;

            // start multiplying the percentages into the
            // damage until it meets/exceeds the health amount
            while (totalAmount < maxAmount) {
                totalAmount++
                totalDamage *= (1 + (percent / 100));
                console.log(`${type} ${id}: ${percent}%`);
                console.log("Total damage:", totalDamage)
                console.log('Amount used: ' + totalAmount)

                // Create a new div
                let percentDiv = document.createElement("div");

                // Add content to the div
                percentDiv.textContent = percent + '% ' + type + ': x' + totalAmount;

                // Give it a class for styling
                percentDiv.classList.add("percentages");

                // Put it inside the container
                container.appendChild(percentDiv);

                if (totalDamage >= healthInput) {
                    break
                }

            }

            if (totalDamage >= healthInput) {
                break
            }
            totalDamage *= (1 + (percent / 100));
            if (totalAmount === 1) {
                // Create a new div
                let percentDiv = document.createElement("div");

                // Add content to the div
                percentDiv.textContent = percent + '% ' + type + ': x' + totalAmount;

                // Give it a class for styling
                percentDiv.classList.add("percentages");

                // Put it inside the container
                container.appendChild(percentDiv);
            }



            console.log(`${type} ${id}: ${percent}%`);
            console.log('totalDamage: ' + totalDamage.toFixed(2))

        }
    }

    document.getElementById("totalDamage").textContent = 'Total Damage: ' + totalDamage.toFixed(2);
    if (bladesInput === true && trapsInput === true) {
        document.getElementById("bladeDamageOnly").innerHTML =
            'Only Blade Damage: ' + bladeDamage.toFixed(2) + ' ' +
            '<input type="number" id="bladeResistInput" ' +
            'placeholder="2nd Resist" style="width: 100px;" ' +
            'onchange="updateBladeResist()">';

    }
}
function updateBladeResist() {
    let bladeResist = Number(
        document.getElementById("bladeResistInput").value
    );
    console.log(bladeResist);

    // totalDamage = (baseDamageInput + enchantInput) * (1 + (damagePercentInput / 100)) *
    //     (1 - ((resistInput / 100) - (pierceInput / 100)))

    console.log(bladeDamage)

    bladeDamage *= ((1 - ((bladeResist / 100) - (pierceInput / 100)))
        / (1 - ((resistInput / 100) - (pierceInput / 100))))
    console.log(bladeDamage)

    let currentResist = document.getElementById("bladeResistInput")?.value ?? "";

    document.getElementById("bladeDamageOnly").innerHTML =
        'Only Blade Damage: ' + bladeDamage.toFixed(2) + ' ' +
        '<input type="number" id="bladeResistInput" ' +
        'placeholder="2nd Resist" style="width: 100px;" ' +
        'onchange="updateBladeResist()" ' +
        'value="' + currentResist + '">';
}
