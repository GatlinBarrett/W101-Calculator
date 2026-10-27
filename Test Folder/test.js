
const savedInputs = [
    "baseDamageInput",
    "pipAmountInput",
    "enchantInput",
    "damagePercentInput",
    "pierceInput"
];

function saveInputs() {
    for (const id of savedInputs) {
        const input = document.getElementById(id);

        if (input) {
            localStorage.setItem(id, input.value);
        }
    }
}

function loadInputs() {
    for (const id of savedInputs) {
        const input = document.getElementById(id);

        if (!input) {
            continue;
        }

        const savedValue = localStorage.getItem(id);

        if (savedValue !== null) {
            input.value = savedValue;
        }
    }
}

// Listen for changes to dynamically created wizard inputs.
document.addEventListener("input", function (event) {
    if (event.target.matches(
        "#baseDamageInput, #pipAmountInput, #enchantInput, #damagePercentInput, #pierceInput"
    )) {
        saveInputs();
    }
});


// Load saved values
loadInputs();





let wizardNumber = 0;

function addWizard() {
    wizardNumber++;

    const wizardList = document.getElementById("wizardList");
    const wizardDiv = document.createElement("div");

    wizardDiv.classList.add("newWizard");
    wizardDiv.dataset.wizardNumber = wizardNumber;

    const suffix = wizardNumber === 1 ? "" : wizardNumber;

    // Wizard name
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("wizardName");
    nameInput.placeholder = "Wizard Name";

    // Input container
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("inputContainer");

    function createInput(labelText, idPrefix, defaultValue, unit = "") {
        const wrapper = document.createElement("div");
        wrapper.classList.add("inputWidth");

        const label = document.createElement("span");
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = "number";
        input.id = idPrefix + suffix;
        input.value = defaultValue;
        input.classList.add(idPrefix);

        label.appendChild(document.createElement("br"));
        label.appendChild(input);

        if (unit) {
            label.appendChild(document.createTextNode(unit));
        }

        wrapper.appendChild(label);
        return wrapper;
    }

    // Spell damage and X-pip amount
    const damageAndPips = document.createElement("div");
    damageAndPips.classList.add("inputWidth");

    const damageLabel = document.createElement("span");
    damageLabel.textContent = "Spell Damage";

    const damageInput = document.createElement("input");
    damageInput.type = "number";
    damageInput.id = "baseDamageInput" + suffix;
    damageInput.value = 0;

    damageLabel.appendChild(document.createElement("br"));
    damageLabel.appendChild(damageInput);

    const multiply = document.createElement("span");
    multiply.classList.add("multiply");
    multiply.textContent = "x";

    const pipLabel = document.createElement("span");
    pipLabel.textContent = "X-Pip Amount";

    const pipInput = document.createElement("input");
    pipInput.type = "number";
    pipInput.id = "pipAmountInput" + suffix;
    pipInput.value = 1;

    pipLabel.appendChild(document.createElement("br"));
    pipLabel.appendChild(pipInput);

    damageAndPips.appendChild(damageLabel);
    damageAndPips.appendChild(multiply);
    damageAndPips.appendChild(pipLabel);

    inputContainer.appendChild(damageAndPips);
    inputContainer.appendChild(
        createInput("Enchant", "enchantInput", 0)
    );
    inputContainer.appendChild(
        createInput("Percent Mod", "damagePercentInput", 0, "%")
    );
    inputContainer.appendChild(
        createInput("Pierce", "pierceInput", 0, "%")
    );

    // Delete wizard
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete Wizard";

    deleteButton.addEventListener("click", function () {
        wizardDiv.remove();
    });

    // Assemble wizard
    wizardDiv.appendChild(nameInput);
    wizardDiv.appendChild(inputContainer);
    wizardDiv.appendChild(deleteButton);

    wizardList.appendChild(wizardDiv);

    // Load saved values into the first wizard only.
    if (wizardNumber === 1) {
        loadInputs();
    }
}

// Create the first wizard when the script loads.
addWizard();






function newBlade() {
    const bladeList = document.getElementById("bladeList");

    const bladeDiv = document.createElement("div");
    bladeDiv.classList.add("newBlade");
    bladeDiv.draggable = true;

    // Percentage input
    const percentInput = document.createElement("input");
    percentInput.type = "number";
    percentInput.classList.add("bladePercentInput");
    percentInput.placeholder = "%";

    // Percentage wrapper
    const percentWrapper = document.createElement("div");
    percentWrapper.classList.add("percentWrapper");

    const percentSign = document.createElement("span");
    percentSign.textContent = "%";

    percentWrapper.appendChild(percentInput);
    percentWrapper.appendChild(percentSign);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");

    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation();
        bladeDiv.remove();
    });

    // Drag original blade
    bladeDiv.addEventListener("dragstart", function (event) {
        bladeDiv.classList.add("dragging");
        event.dataTransfer.setData("text/plain", "blade");
        event.dataTransfer.effectAllowed = "copy";
    });

    bladeDiv.addEventListener("dragend", function () {
        bladeDiv.classList.remove("dragging");

        document.querySelectorAll(".enemyTrapDropZone")
            .forEach(function (zone) {
                zone.classList.remove("dragOver");
            });
    });

    bladeDiv.appendChild(percentWrapper);
    bladeDiv.appendChild(deleteButton);

    bladeList.appendChild(bladeDiv);
}









function newTrap() {
    const trapList = document.getElementById("trapList");

    const trapDiv = document.createElement("div");
    trapDiv.classList.add("newTrap");
    trapDiv.draggable = true;

    // Percentage input
    const percentInput = document.createElement("input");
    percentInput.type = "number";
    percentInput.classList.add("trapPercentInput");
    percentInput.placeholder = "%";

    // Percentage wrapper
    const percentWrapper = document.createElement("div");
    percentWrapper.classList.add("percentWrapper");

    const percentSign = document.createElement("span");
    percentSign.textContent = "%";

    percentWrapper.appendChild(percentInput);
    percentWrapper.appendChild(percentSign);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");

    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation();
        trapDiv.remove();
    });

    // Drag behavior
    trapDiv.addEventListener("dragstart", function (event) {
        trapDiv.classList.add("dragging");

        event.dataTransfer.setData("text/plain", "trap");
        event.dataTransfer.effectAllowed = "copy";
    });

    trapDiv.addEventListener("dragend", function () {
        trapDiv.classList.remove("dragging");

        document.querySelectorAll(".enemyTrapDropZone")
            .forEach(function (zone) {
                zone.classList.remove("dragOver");
            });
    });

    // Assemble trap without checkbox
    trapDiv.appendChild(percentWrapper);
    trapDiv.appendChild(deleteButton);

    trapList.appendChild(trapDiv);
}














function addEnemy() {
    const enemyList = document.getElementById("enemyList");

    const enemyRow = document.createElement("div");
    enemyRow.classList.add("enemyRow");

    // Enemy box
    const enemyDiv = document.createElement("div");
    enemyDiv.classList.add("newEnemy");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("enemyNameInput");
    nameInput.placeholder = "Enemy Name";

    const healthLabel = document.createElement("label");
    healthLabel.textContent = "Health:";

    const healthInput = document.createElement("input");
    healthInput.type = "number";
    healthInput.classList.add("healthInput");
    healthInput.value = 0;
    healthInput.min = 0;
    healthLabel.appendChild(healthInput);

    const resistLabel = document.createElement("label");
    resistLabel.textContent = "Resist:";

    const resistInput = document.createElement("input");
    resistInput.type = "number";
    resistInput.classList.add("resistInput");
    resistInput.value = 0;
    resistLabel.appendChild(resistInput);

    const resistPercent = document.createElement("span");
    resistPercent.textContent = "%";
    resistLabel.appendChild(resistPercent);

    const deleteEnemyButton = document.createElement("button");
    deleteEnemyButton.type = "button";
    deleteEnemyButton.textContent = "Delete Enemy";

    deleteEnemyButton.addEventListener("click", function () {
        enemyRow.remove();
    });

    enemyDiv.appendChild(nameInput);
    enemyDiv.appendChild(healthLabel);
    enemyDiv.appendChild(resistLabel);
    enemyDiv.appendChild(deleteEnemyButton);

    // Enemy trap drop zone
    const trapDropZone = document.createElement("div");
    trapDropZone.classList.add("enemyTrapDropZone");

    const dropHint = document.createElement("span");
    dropHint.classList.add("dropHint");
    dropHint.textContent = "Drop traps here";
    trapDropZone.appendChild(dropHint);

    trapDropZone.addEventListener("dragover", function (event) {
        event.preventDefault();
        trapDropZone.classList.add("dragOver");
        event.dataTransfer.dropEffect = "copy";
    });

    trapDropZone.addEventListener("dragleave", function (event) {
        if (!trapDropZone.contains(event.relatedTarget)) {
            trapDropZone.classList.remove("dragOver");
        }
    });

    trapDropZone.addEventListener("drop", function (event) {
        event.preventDefault();
        trapDropZone.classList.remove("dragOver");

        const originalTrap = document.querySelector(".newTrap.dragging");

        if (!originalTrap || originalTrap.parentElement !== document.getElementById("trapList")) {
            return;
        }

        // Hide empty-zone hint
        dropHint.style.display = "none";

        // Clone original trap
        const trapCopy = originalTrap.cloneNode(true);
        trapCopy.classList.remove("dragging");
        trapCopy.draggable = true;

        // Add checkbox to the assigned copy only
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("enableCheck");
        checkbox.checked = true;

        trapCopy.insertBefore(checkbox, trapCopy.firstChild);

        // Drag assigned copies too
        trapCopy.addEventListener("dragstart", function (event) {
            trapCopy.classList.add("dragging");
            event.dataTransfer.setData("text/plain", "trap");
            event.dataTransfer.effectAllowed = "copy";
        });

        trapCopy.addEventListener("dragend", function () {
            trapCopy.classList.remove("dragging");

            document.querySelectorAll(".enemyTrapDropZone")
                .forEach(function (zone) {
                    zone.classList.remove("dragOver");
                });
        });

        // Delete only this assigned copy
        const copyDeleteButton = trapCopy.querySelector(".delete");

        copyDeleteButton.addEventListener("click", function (event) {
            event.stopPropagation();
            trapCopy.remove();

            if (trapDropZone.querySelectorAll(".newTrap").length === 0) {
                dropHint.style.display = "block";
            }
        });

        trapDropZone.appendChild(trapCopy);
    });

    enemyRow.appendChild(enemyDiv);
    enemyRow.appendChild(trapDropZone);
    enemyList.appendChild(enemyRow);
}

