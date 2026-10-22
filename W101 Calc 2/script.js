
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

    // Blades highest to lowest
    let sortedBlades = [...blades]
        .map(blade => ({ ...blade, type: "Blade" }))
        .sort((a, b) => b.percent - a.percent);

    console.log(sortedBlades);
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

    // Traps highest to lowest
    let sortedTraps = [...traps]
        .map(trap => ({ ...trap, type: "Trap" }))
        .sort((a, b) => b.percent - a.percent);

    console.log(sortedTraps)
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

const container = document.getElementById("percentUsed");

function calculateDamage() {
    let baseDamageInput = Number(document.getElementById('baseDamageInput').value);
    let enchantInput = Number(document.getElementById('enchantInput').value);
    let damagePercentInput = Number(document.getElementById('damagePercentInput').value);
    let pierceInput = Number(document.getElementById('pierceInput').value);
    let trapsInput = document.getElementById('trapsInput').checked;
    let bladesInput = document.getElementById('bladesInput').checked;
    let healthInput = Number(document.getElementById('healthInput').value);
    let resistInput = Number(document.getElementById('resistInput').value);

    totalDamage = (baseDamageInput + enchantInput) * (1 + (damagePercentInput / 100)) * (1 - ((resistInput / 100) - (pierceInput / 100)))
    console.log(totalDamage)
    let bladeDamage = totalDamage
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
        document.getElementById("bladeDamage").textContent = 'Only Blade Damage: ' + bladeDamage.toFixed(2) + ' (Not Excluding Resist)';
    }

}