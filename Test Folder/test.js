let trapsInput = true
let bladesInput = true
let totalDamage = 500
let healthInput = 10000

let blades = [
    { id: 1, percent: 35, maxAmount: 1 },
    { id: 2, percent: 45, maxAmount: 2 },
    { id: 3, percent: 55, maxAmount: 2 }
];

let traps = [
    {id: 1, percent: 70, maxAmount: 1 },
    {id: 2, percent: 80, maxAmount: 1}
]



let bladeSearch = 3;

let blade = blades.find(blade => blade.id === bladeSearch);

if (blade) {
    console.log(blade.percent);
} else {
    console.log("Blade not found");
}


let highestBladeId = Math.max(...blades.map(blade => blade.id));

console.log(highestBladeId);



let trapSearch = 2;

let trap = traps.find(trap => trap.id === trapSearch);

if (trap) {
    console.log(trap.percent);
} else {
    console.log("Trap not found");
}


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

// Sort traps and blades from highest to lowest percent
let allModifiers = [
    ...blades.map(blade => ({ ...blade, type: "Blade" })),
    ...traps.map(trap => ({ ...trap, type: "Trap" }))
];

allModifiers.sort((a, b) => b.percent - a.percent);

console.log(allModifiers);

// Lay out each one individually
// for (let modifier of allModifiers) {
//     let percent = modifier.percent;
//     let maxAmount = modifier.maxAmount;
//     let id = modifier.id;
//     let type = modifier.type;

//     console.log(type, id, percent, maxAmount);
// }



for (let modifier of allModifiers) {
    // Stop if damage has already reached the target
    if (totalDamage >= healthInput) {
        break;
    }

    let percent = modifier.percent;
    let maxAmount = modifier.maxAmount;
    let id = modifier.id;
    let type = modifier.type;
 let trapBladeCount = trapCount + bladeCount 
//NEED TO ADD UP TOTAL TRAPS AND BLADES TOGETHER THEN>>>>
   if (1 < maxAmount){
    totalDamage *= (1 + (percent / 100));
   }
        totalDamage *= (1 + (percent / 100));

        console.log(`${type} ${id}: ${percent}%`);
        console.log("Total damage:", totalDamage);
}

console.log("Final damage:", totalDamage);



// // Highest percentage first
// allModifiers.sort((a, b) => b.percent - a.percent);

// while (totalDamage <= healthInput) {
//     // Find the highest percentage modifier that still has uses left
//     let modifier = allModifiers.find(modifier => {
//         let allowed =
//             (modifier.type === "Blade" && bladesInput.checked) ||
//             (modifier.type === "Trap" && trapsInput.checked);

//         return allowed && modifier.used < modifier.maxAmount;
//     });

//     // Stop if no modifiers can be used anymore
    

//     // Apply the modifier
//     totalDamage *= 1 + modifier.percent / 100;

//     // Record that it was used
//     modifier.used++;

//     console.log(
//         `${modifier.type} ${modifier.id}: ${modifier.percent}%`,
//         `(${modifier.used}/${modifier.maxAmount} uses)`
//     );

//     console.log("Total damage:", totalDamage);
// }

// console.log("Final damage:", totalDamage);