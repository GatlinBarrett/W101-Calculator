let trapsInput = false
let bladesInput = true
let baseDamage = 3000
let bladeDamage = baseDamage
let totalDamage = baseDamage
let healthInput = 12000

let blades = [
    { id: 1, percent: 35, maxAmount: 1 },
    { id: 2, percent: 45, maxAmount: 2 },
    { id: 3, percent: 55, maxAmount: 2 }
];

let traps = [
    { id: 1, percent: 70, maxAmount: 1 },
    { id: 2, percent: 80, maxAmount: 1 }
]


// Total Amount of Blades Added up
let bladeTotal = 0;

blades.forEach(blade => {
    console.log("Blade " + blade.id + " amount: " + blade.maxAmount);

    bladeTotal += blade.maxAmount;
});

console.log("Total amount: " + bladeTotal);

let bladeCount = 0;


// Total Amount of Traps Added up
let trapTotal = 0;

traps.forEach(trap => {
    console.log("Trap " + trap.id + " amount: " + trap.maxAmount);

    trapTotal += trap.maxAmount;
});

console.log("Total amount: " + trapTotal);

let trapCount = 0;





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



const container = document.getElementById("percentUsed");

function calculateDamage() {
//

// CALCULATE TOTAL DAMAGE OF BLADES AND TRAPS

//
    if (trapsInput === true && bladesInput === true) {
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

