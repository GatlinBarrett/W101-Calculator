const STORAGE_KEY = "w101DamageCalculator_v2";
const WIZARD_COLORS = ["blue", "red", "green", "yellow"];
const WIZARD_SCHOOLS = ["Fire", "Ice", "Storm", "Myth", "Life", "Death", "Balance"];

let wizardNumber = 0;
let enemyNumber = 0;
let calculationHasRun = false;
let initializing = true;
let savedMatchupSelections = {};

document.addEventListener("DOMContentLoaded", initializeCalculator);

function initializeCalculator() {
  const saved = readSavedData();

  if (saved?.wizards?.length) saved.wizards.forEach(addWizard);
  else addWizard();

  (saved?.bladeTemplates || []).forEach(newBlade);
  (saved?.trapTemplates || []).forEach(newTrap);
  (saved?.enemies || []).forEach(addEnemy);

  setTemplateMinimized("bladeTemplatePanel", Boolean(saved?.bladeTemplatesCollapsed));
  setTemplateMinimized("trapTemplatePanel", Boolean(saved?.trapTemplatesCollapsed));

  savedMatchupSelections = saved?.matchupSelections || {};
  calculationHasRun = Boolean(saved?.calculationHasRun);

  document.addEventListener("input", handleGlobalInput);
  document.addEventListener("change", handleGlobalChange);
  document.addEventListener("dragstart", handleDragStart);
  document.addEventListener("dragend", handleDragEnd);
  document.addEventListener("dragover", handleDragOver);
  document.addEventListener("dragleave", handleDragLeave);
  document.addEventListener("drop", handleDrop);
  document.addEventListener("pointerdown", handleMobilePointerDown);
  document.addEventListener("pointermove", handleMobilePointerMove, { passive: false });
  document.addEventListener("pointerup", handleMobilePointerUp);
  document.addEventListener("pointercancel", cancelMobilePointerDrag);

  if (calculationHasRun) renderAllMatchups(false);
  else synchronizeAssignedCheckboxes();
  initializing = false;
  saveCalculatorData();
}

function readSavedData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
  catch (error) { console.warn("Could not read saved calculator data.", error); return null; }
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function numeric(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatNumber(value) {
  return Number.isFinite(value)
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "0";
}

function formatPercent(value) {
  const n = numeric(value);
  return `${n > 0 ? "+" : ""}${n}%`;
}

function saveCalculatorData() {
  if (initializing) return;
  const data = {
    wizards: [...document.querySelectorAll(".newWizard")].map(wizard => ({
      id: wizard.dataset.id,
      name: wizard.querySelector(".wizardName").value,
      collapsed: wizard.classList.contains("wizardCollapsed"),
      school: wizard.querySelector(".wizardSchool").value,
      included: wizard.querySelector(".wizardInclude").checked,
      spellDamage: wizard.querySelector(".spellDamageInput").value,
      pips: wizard.querySelector(".pipAmountInput").value,
      enchant: wizard.querySelector(".enchantInput").value,
      percentMod: wizard.querySelector(".damagePercentInput").value,
      pierce: wizard.querySelector(".pierceInput").value,
      dotEnabled: wizard.querySelector(".dotEnabled").checked,
      dotDamage: wizard.querySelector(".dotDamageInput").value,
      blades: [...wizard.querySelectorAll(".assignedBlade")].map(card => ({
        id: card.dataset.id, sourceId: card.dataset.sourceId,
        percent: card.querySelector(".modifierPercent").value,
        name: card.querySelector(".assignedModifierName").value
      }))
    })),
    bladeTemplates: [...document.querySelectorAll("#bladeList .templateBlade")].map(card => ({
      id: card.dataset.id, percent: card.querySelector(".modifierPercent").value
    })),
    trapTemplates: [...document.querySelectorAll("#trapList .templateTrap")].map(card => ({
      id: card.dataset.id, percent: card.querySelector(".modifierPercent").value
    })),
    enemies: [...document.querySelectorAll(".enemyRow")].map(row => ({
      id: row.dataset.id,
      name: row.querySelector(".enemyNameInput").value,
      collapsed: row.classList.contains("enemyCollapsed"),
      included: row.querySelector(".enemyInclude").checked,
      health: row.querySelector(".healthInput").value,
      resistances: [...row.querySelectorAll(".resistanceEntry")].map(entry => ({
        schools: selectedResistanceSchools(entry),
        percent: entry.querySelector(".resistInput").value
      })),
      traps: [...row.querySelectorAll(".assignedTrap")].map(card => ({
        id: card.dataset.id, sourceId: card.dataset.sourceId,
        percent: card.querySelector(".modifierPercent").value,
        name: card.querySelector(".assignedModifierName").value
      }))
    })),
    matchupSelections: savedMatchupSelections,
    calculationHasRun,
    bladeTemplatesCollapsed: document.getElementById("bladeTemplatePanel").classList.contains("templateCollapsed"),
    trapTemplatesCollapsed: document.getElementById("trapTemplatePanel").classList.contains("templateCollapsed")
  };

  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (error) { console.warn("Could not save calculator data.", error); }
}

function handleGlobalInput(event) {
  if (!event.target.matches("input")) return;
  // Update the displayed figures without rebuilding inputs during typing.
  if (calculationHasRun && !event.target.classList.contains("assignedCheck")) {
    refreshMatchupOutputs();
  }
  saveCalculatorData();
}

function refreshMatchupOutputs() {
  document.querySelectorAll(".matchupCard").forEach(card => {
    const wizard = [...document.querySelectorAll(".newWizard")].map(getWizardData)
      .find(item => item.id === card.dataset.wizardId);
    const enemy = [...document.querySelectorAll(".enemyRow")].map(getEnemyData)
      .find(item => item.id === card.dataset.enemyId);
    if (!wizard || !enemy) return;
    card.querySelector(".matchupTitle").textContent = `${wizard.name} vs. ${enemy.name}`;
    card.querySelector(".matchupSubtitle").textContent =
      `Wizard ${wizard.index + 1} · ${wizard.school} · Enemy health ${formatNumber(enemy.health)} · ${formatNumber(resistanceForSchool(enemy, wizard.school))}% resist`;
    updateMatchupCard(card);
  });
  synchronizeAssignedCheckboxes();
}

function handleGlobalChange(event) {
  if (event.target.matches(".wizardInclude, .enemyInclude")) {
    if (calculationHasRun) renderAllMatchups(false);
    else synchronizeAssignedCheckboxes();
    saveCalculatorData();
    return;
  }
  if (event.target.matches(".wizardSchool")) {
    if (calculationHasRun) refreshMatchupOutputs();
    saveCalculatorData();
    return;
  }
  if (event.target.matches(".assignedCheck")) {
    const checkbox = event.target;
    const key = checkbox.dataset.matchupKey;
    if (!savedMatchupSelections[key]) savedMatchupSelections[key] = {};
    savedMatchupSelections[key][checkbox.dataset.modifierId] = checkbox.checked;

    const card = [...document.querySelectorAll(".matchupCard")]
      .find(item => item.dataset.matchupKey === key);
    if (card) updateMatchupCard(card);
    saveCalculatorData();
  } else if (event.target.matches("input")) {
    saveCalculatorData();
  }
}

function makeNumberInput(className, value, labelText) {
  const label = document.createElement("label");
  label.className = "inputWidth";
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = "number";
  input.step = "any";
  input.className = className;
  input.value = value ?? 0;
  label.appendChild(input);
  return label;
}

function createSchoolSelect(selected = "", allowAll = false) {
  const select = document.createElement("select");
  const choices = allowAll ? ["All Schools", ...WIZARD_SCHOOLS] : WIZARD_SCHOOLS;
  for (const school of choices) {
    const option = document.createElement("option");
    option.value = school;
    option.textContent = school;
    select.appendChild(option);
  }
  select.value = choices.includes(selected) ? selected : choices[0];
  return select;
}

function selectedResistanceSchools(entry) {
  return [...entry.querySelectorAll(".resistanceSchoolCheck:checked")]
    .map(input => input.value);
}

function updateResistanceSchoolLabel(entry) {
  const schools = selectedResistanceSchools(entry);
  const label = entry.querySelector(".resistanceSchoolSummary");
  label.textContent = schools.length ? schools.join(", ") : "Choose schools";
  label.title = schools.length ? schools.join(", ") : "Choose schools";
}

function normalizeResistanceEntries(entries) {
  // Convert old single-school saved rows and merge rows with the same percentage.
  // Keep the first assignment for each school if older data had duplicates.
  const groups = [];
  const assigned = new Set();
  for (const item of entries) {
    const schools = Array.isArray(item.schools) ? item.schools : [item.school || "All Schools"];
    const unique = schools.filter(school =>
      (school === "All Schools" || WIZARD_SCHOOLS.includes(school)) && !assigned.has(school)
    );
    if (!unique.length) continue;
    unique.forEach(school => assigned.add(school));
    const percent = numeric(item.percent);
    let group = groups.find(group => numeric(group.percent) === percent);
    if (!group) {
      group = { schools: [], percent };
      groups.push(group);
    }
    group.schools.push(...unique);
  }
  return groups;
}

function addResistanceEntry(container, data = {}) {
  const entry = document.createElement("div");
  entry.className = "resistanceEntry";

  const selector = document.createElement("details");
  selector.className = "resistanceSchoolPicker";
  const summary = document.createElement("summary");
  summary.className = "resistanceSchoolSummary";
  selector.appendChild(summary);

  const options = document.createElement("div");
  options.className = "resistanceSchoolOptions";
  const schools = Array.isArray(data.schools) ? data.schools : [data.school || "All Schools"];
  for (const school of ["All Schools", ...WIZARD_SCHOOLS]) {
    const label = document.createElement("label");
    label.className = "resistanceSchoolOption";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "resistanceSchoolCheck";
    check.value = school;
    check.checked = schools.includes(school);
    const text = document.createElement("span");
    text.textContent = school;
    label.append(check, text);
    options.appendChild(label);
  }
  selector.appendChild(options);

  const percent = document.createElement("input");
  percent.type = "number";
  percent.step = "any";
  percent.className = "resistInput";
  percent.value = data.percent ?? 0;
  percent.setAttribute("aria-label", "Resistance percentage");

  const sign = document.createElement("span");
  sign.textContent = "%";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "removeResistanceButton";
  remove.textContent = "Remove";
  remove.addEventListener("click", () => {
    entry.remove();
    if (calculationHasRun) refreshMatchupOutputs();
    saveCalculatorData();
  });

  options.addEventListener("change", event => {
    if (!event.target.matches(".resistanceSchoolCheck")) return;
    const checkbox = event.target;
    if (checkbox.checked && checkbox.value === "All Schools") {
      options.querySelectorAll(".resistanceSchoolCheck").forEach(other => {
        if (other !== checkbox) other.checked = false;
      });
    } else if (checkbox.checked) {
      const all = options.querySelector('.resistanceSchoolCheck[value="All Schools"]');
      all.checked = false;
    }
    updateResistanceSchoolLabel(entry);
    if (calculationHasRun) refreshMatchupOutputs();
    saveCalculatorData();
  });

  entry.append(selector, percent, sign, remove);
  container.appendChild(entry);
  updateResistanceSchoolLabel(entry);
  return entry;
}

function resistanceForSchool(enemy, school) {
  const specific = enemy.resistances.find(entry => entry.schools.includes(school));
  if (specific) return specific.percent;
  const general = enemy.resistances.find(entry => entry.schools.includes("All Schools"));
  return general ? general.percent : 0;
}

function addWizard(data = {}) {
  const wizard = document.createElement("section");
  wizard.className = "newWizard";
  wizard.dataset.id = data.id || createId("wizard");

  const top = document.createElement("div");
  top.className = "wizardTop";

  const number = document.createElement("span");
  number.className = "wizardNumber";

  const name = document.createElement("input");
  name.type = "text";
  name.className = "wizardName";
  name.placeholder = "Wizard Name";
  name.value = data.name || "";

  const school = createSchoolSelect(data.school || "Fire");
  school.className = "wizardSchool";
  school.setAttribute("aria-label", "Wizard school");

  const minimizeButton = document.createElement("button");
  minimizeButton.type = "button";
  minimizeButton.className = "minimizeWizardButton";
  minimizeButton.setAttribute("aria-expanded", "true");
  minimizeButton.textContent = "− Minimize";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "deleteWizardButton";
  deleteButton.textContent = "Delete Wizard";

  const includeLabel = document.createElement("label");
  includeLabel.className = "includeToggle";
  const include = document.createElement("input");
  include.type = "checkbox";
  include.className = "wizardInclude";
  include.checked = data.included !== false;
  include.title = "Include this wizard in calculations";
  includeLabel.append(include, document.createTextNode("Include"));
  top.append(number, name, school, includeLabel, minimizeButton, deleteButton);

  const body = document.createElement("div");
  body.className = "wizardBody";
  body.id = `wizard-body-${wizard.dataset.id}`;
  minimizeButton.setAttribute("aria-controls", body.id);

  const inputs = document.createElement("div");
  inputs.className = "inputContainer";
  inputs.append(
    makeNumberInput("spellDamageInput", data.spellDamage ?? 0, "Spell Damage"),
    makeNumberInput("pipAmountInput", data.pips ?? 1, "X-Pip Amount"),
    makeNumberInput("enchantInput", data.enchant ?? 0, "Enchant"),
    makeNumberInput("damagePercentInput", data.percentMod ?? 0, "Percent Mod (%)"),
    makeNumberInput("pierceInput", data.pierce ?? 0, "Pierce (%)")
  );

  const dotControls = document.createElement("div");
  dotControls.className = "dotControls";
  const dotLabel = document.createElement("label");
  dotLabel.className = "dotToggle";
  const dotCheckbox = document.createElement("input");
  dotCheckbox.type = "checkbox";
  dotCheckbox.className = "dotEnabled";
  dotCheckbox.checked = Boolean(data.dotEnabled);
  dotLabel.append(dotCheckbox, document.createTextNode("DoT"));

  const dotInput = makeNumberInput("dotDamageInput", data.dotDamage ?? 0, "DoT Base Damage");
  dotInput.classList.add("dotDamageField");
  dotInput.hidden = !dotCheckbox.checked;
  dotCheckbox.addEventListener("change", () => {
    dotInput.hidden = !dotCheckbox.checked;
    if (calculationHasRun) refreshMatchupOutputs();
    saveCalculatorData();
  });
  dotControls.append(dotLabel, dotInput);

  const heading = document.createElement("h3");
  heading.textContent = "Assigned Blades";

  const zone = document.createElement("div");
  zone.className = "bladeDropZone";
  zone.dataset.zone = "wizard-blades";

  const hint = document.createElement("span");
  hint.className = "dropLabel dropHint";
  hint.textContent = "Drop blade templates here";
  zone.appendChild(hint);

  body.append(inputs, dotControls, heading, zone);
  wizard.append(top, body);
  document.getElementById("wizardList").appendChild(wizard);

  (data.blades || []).forEach(blade => {
    zone.appendChild(createAssignedModifier("blade", blade));
  });
  updateDropHint(zone);

  minimizeButton.addEventListener("click", () => {
    setWizardMinimized(wizard, !wizard.classList.contains("wizardCollapsed"));
    saveCalculatorData();
  });

  deleteButton.addEventListener("click", () => {
    wizard.remove();
    renumberWizards();
    if (calculationHasRun) renderAllMatchups(false);
    else synchronizeAssignedCheckboxes();
    saveCalculatorData();
  });

  setWizardMinimized(wizard, Boolean(data.collapsed));
  renumberWizards();
  synchronizeAssignedCheckboxes();
  saveCalculatorData();
}

function setWizardMinimized(wizard, minimized) {
  wizard.classList.toggle("wizardCollapsed", minimized);

  const body = wizard.querySelector(".wizardBody");
  const button = wizard.querySelector(".minimizeWizardButton");

  body.hidden = minimized;
  button.textContent = minimized ? "+ Expand" : "− Minimize";
  button.setAttribute("aria-expanded", String(!minimized));
}

function renumberWizards() {
  [...document.querySelectorAll(".newWizard")].forEach((wizard, index) => {
    wizard.querySelector(".wizardNumber").textContent = `Wizard ${index + 1}`;
  });
}

function newBlade(data = {}) {
  document.getElementById("bladeList").appendChild(createTemplate("blade", data));
  saveCalculatorData();
}

function newTrap(data = {}) {
  document.getElementById("trapList").appendChild(createTemplate("trap", data));
  saveCalculatorData();
}

function createTemplate(type, data = {}) {
  const card = document.createElement("div");
  card.className = `modifierCard template${type === "blade" ? "Blade" : "Trap"}`;
  card.draggable = true;
  card.dataset.id = data.id || createId(type);
  card.dataset.type = type;

  const title = document.createElement("span");
  title.className = "modifierCaption";
  title.textContent = type === "blade" ? "Blade template" : "Trap template";

  const percent = document.createElement("input");
  percent.type = "number";
  percent.step = "any";
  percent.className = "modifierPercent";
  percent.placeholder = "%";
  percent.value = data.percent ?? "";

  const caption = document.createElement("span");
  caption.className = "modifierCaption";
  caption.textContent = "Percent";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "deleteButton";
  remove.textContent = "Delete";
  const percentField = document.createElement("div");
  percentField.className = "modifierPercentField";
  const sign = document.createElement("span");
  sign.textContent = "%";
  percentField.append(percent, sign);

  if (card.classList.contains("assignedBlade") || card.classList.contains("assignedTrap")) {
    const choices = document.createElement("div");
    choices.className = "assignedSelections";
    card.append(handle, title, percentField, choices, remove);
  } else {
    card.append(title, percentField, caption, remove);
  }
  return card;
}

function createAssignedModifier(type, data = {}) {
  const card = document.createElement("div");
  card.className = `modifierCard assigned${type === "blade" ? "Blade" : "Trap"}`;
  card.dataset.id = data.id || createId(`assigned-${type}`);
  card.dataset.sourceId = data.sourceId || "";
  card.dataset.type = type;

  const handle = document.createElement("span");
  handle.className = "reorderHandle";
  handle.draggable = true;
  handle.title = "Drag to change modifier order";
  handle.textContent = "⠿ Move";

  const name = document.createElement("input");
  name.type = "text";
  name.className = "assignedModifierName";
  name.placeholder = type === "blade" ? "Blade name" : "Trap name";
  name.setAttribute("aria-label", type === "blade" ? "Assigned blade name" : "Assigned trap name");
  name.maxLength = 60;
  name.value = data.name ?? "";

  const percent = document.createElement("input");
  percent.type = "number";
  percent.step = "any";
  percent.className = "modifierPercent";
  percent.placeholder = "%";
  percent.value = data.percent ?? "";

  const percentField = document.createElement("div");
  percentField.className = "modifierPercentField";
  const sign = document.createElement("span");
  sign.textContent = "%";
  percentField.append(percent, sign);

  const choices = document.createElement("div");
  choices.className = "assignedSelections";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "deleteButton";
  remove.textContent = "Remove";

  card.append(handle, name, percentField, choices, remove);
  return card;
}

function addEnemy(data = {}) {
  const row = document.createElement("div");
  row.className = "enemyRow";
  row.dataset.id = data.id || createId("enemy");

  const top = document.createElement("div");
  top.className = "enemyTop";

  const name = document.createElement("input");
  name.type = "text";
  name.className = "enemyNameInput";
  name.placeholder = "Enemy Name";
  name.value = data.name || "";

  const minimizeButton = document.createElement("button");
  minimizeButton.type = "button";
  minimizeButton.className = "minimizeEnemyButton";
  minimizeButton.setAttribute("aria-expanded", "true");
  minimizeButton.textContent = "− Minimize";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "deleteEnemyButton";
  deleteButton.textContent = "Delete Enemy";
  const includeLabel = document.createElement("label");
  includeLabel.className = "includeToggle";
  const include = document.createElement("input");
  include.type = "checkbox";
  include.className = "enemyInclude";
  include.checked = data.included !== false;
  include.title = "Include this enemy in calculations";
  includeLabel.append(include, document.createTextNode("Include"));
  top.append(name, includeLabel, minimizeButton, deleteButton);

  const body = document.createElement("div");
  body.className = "enemyBody";
  body.id = `enemy-body-${row.dataset.id}`;
  minimizeButton.setAttribute("aria-controls", body.id);

  const enemy = document.createElement("section");
  enemy.className = "newEnemy";

  const healthLabel = document.createElement("label");
  healthLabel.className = "enemyField";
  healthLabel.append("Health");
  const health = document.createElement("input");
  health.type = "number";
  health.min = "0";
  health.step = "any";
  health.className = "healthInput";
  health.value = data.health ?? 0;
  healthLabel.appendChild(health);

  const resistanceBlock = document.createElement("div");
  resistanceBlock.className = "resistanceBlock";
  const resistanceHeader = document.createElement("div");
  resistanceHeader.className = "resistanceHeader";
  const resistanceTitle = document.createElement("span");
  resistanceTitle.textContent = "School Resistances";
  const addResistanceButton = document.createElement("button");
  addResistanceButton.type = "button";
  addResistanceButton.textContent = "+ Add Resistance";
  const resistanceList = document.createElement("div");
  resistanceList.className = "resistanceList";
  addResistanceButton.addEventListener("click", () => {
    addResistanceEntry(resistanceList, { schools: [], percent: 0 });
    if (calculationHasRun) refreshMatchupOutputs();
    saveCalculatorData();
  });
  resistanceHeader.append(resistanceTitle, addResistanceButton);
  resistanceBlock.append(resistanceHeader, resistanceList);
  const existingResistances = Array.isArray(data.resistances)
    ? data.resistances
    : [{ school: "All Schools", percent: data.resist ?? 0 }];
  normalizeResistanceEntries(existingResistances).forEach(item => addResistanceEntry(resistanceList, item));
  enemy.append(healthLabel, resistanceBlock);

  const zone = document.createElement("div");
  zone.className = "enemyTrapDropZone trapDropZone";
  zone.dataset.zone = "enemy-traps";
  const hint = document.createElement("span");
  hint.className = "dropLabel dropHint";
  hint.textContent = "Drop trap templates here";
  zone.appendChild(hint);
  (data.traps || []).forEach(trap => zone.appendChild(createAssignedModifier("trap", trap)));
  updateDropHint(zone);

  body.append(enemy, zone);
  row.append(top, body);
  document.getElementById("enemyList").appendChild(row);

  minimizeButton.addEventListener("click", () => {
    setEnemyMinimized(row, !row.classList.contains("enemyCollapsed"));
    saveCalculatorData();
  });

  deleteButton.addEventListener("click", () => {
    row.remove();
    if (calculationHasRun) renderAllMatchups(false);
    else synchronizeAssignedCheckboxes();
    saveCalculatorData();
  });

  setEnemyMinimized(row, Boolean(data.collapsed));
  synchronizeAssignedCheckboxes();
  saveCalculatorData();
}

function setEnemyMinimized(row, minimized) {
  row.classList.toggle("enemyCollapsed", minimized);
  const body = row.querySelector(".enemyBody");
  const button = row.querySelector(".minimizeEnemyButton");
  body.hidden = minimized;
  button.textContent = minimized ? "+ Expand" : "− Minimize";
  button.setAttribute("aria-expanded", String(!minimized));
}

function handleDeleteClick(event) {
  const button = event.target.closest(".deleteButton");
  if (!button) return;
  event.preventDefault();
  const card = button.closest(".modifierCard");
  if (!card) return;
  const parent = card.parentElement;
  if (calculationHasRun) savedMatchupSelections = getCurrentSelections();
  card.remove();
  updateDropHint(parent);
  if (calculationHasRun) renderAllMatchups(false);
  else synchronizeAssignedCheckboxes();
  saveCalculatorData();
}

document.addEventListener("click", handleDeleteClick);

function handleDragStart(event) {
  const handle = event.target.closest(".reorderHandle");
  const assigned = handle?.closest(".assignedBlade, .assignedTrap");
  const template = event.target.closest(".templateBlade, .templateTrap");
  const card = assigned || template;
  if (!card) {
    event.preventDefault();
    return;
  }

  card.classList.add("dragging");
  event.dataTransfer.setData("text/plain", card.dataset.type);
  event.dataTransfer.effectAllowed = assigned ? "move" : "copy";
}

function handleDragEnd(event) {
  document.querySelectorAll(".modifierCard.dragging").forEach(card => card.classList.remove("dragging"));
  document.querySelectorAll(".dragOver").forEach(zone => zone.classList.remove("dragOver"));
  document.querySelectorAll(".reorderBefore, .reorderAfter").forEach(card => {
    card.classList.remove("reorderBefore", "reorderAfter");
  });
}

function getReorderTarget(event, zone) {
  const card = event.target.closest(".assignedBlade, .assignedTrap");
  if (!card || card.parentElement !== zone || card.classList.contains("dragging")) return null;
  const midpoint = card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2;
  return { card, before: event.clientX < midpoint };
}

function handleDragOver(event) {
  const zone = event.target.closest(".bladeDropZone, .enemyTrapDropZone");
  if (!zone) return;
  const dragged = document.querySelector(".modifierCard.dragging");
  if (!dragged) return;
  const type = dragged.dataset.type;
  if ((type === "blade" && !zone.classList.contains("bladeDropZone")) ||
      (type === "trap" && !zone.classList.contains("enemyTrapDropZone"))) return;

  // Reordering is confined to the card's original wizard/enemy.
  const isAssigned = dragged.classList.contains("assignedBlade") || dragged.classList.contains("assignedTrap");
  if (isAssigned && dragged.parentElement !== zone) return;

  event.preventDefault();
  zone.classList.add("dragOver");
  event.dataTransfer.dropEffect = isAssigned ? "move" : "copy";
  document.querySelectorAll(".reorderBefore, .reorderAfter").forEach(card =>
    card.classList.remove("reorderBefore", "reorderAfter"));
  if (isAssigned) {
    const target = getReorderTarget(event, zone);
    if (target) target.card.classList.add(target.before ? "reorderBefore" : "reorderAfter");
  }
}

function handleDragLeave(event) {
  const zone = event.target.closest(".bladeDropZone, .enemyTrapDropZone");
  if (zone && !zone.contains(event.relatedTarget)) {
    zone.classList.remove("dragOver");
    zone.querySelectorAll(".reorderBefore, .reorderAfter").forEach(card =>
      card.classList.remove("reorderBefore", "reorderAfter"));
  }
}

function handleDrop(event) {
  const zone = event.target.closest(".bladeDropZone, .enemyTrapDropZone");
  if (!zone) return;
  const dragged = document.querySelector(".modifierCard.dragging");
  if (!dragged) return;
  const type = dragged.dataset.type;
  if ((type === "blade" && !zone.classList.contains("bladeDropZone")) ||
      (type === "trap" && !zone.classList.contains("enemyTrapDropZone"))) return;
  const isAssigned = dragged.classList.contains("assignedBlade") || dragged.classList.contains("assignedTrap");
  if (isAssigned && dragged.parentElement !== zone) return;

  event.preventDefault();
  const target = getReorderTarget(event, zone);
  if (isAssigned) {
    if (target) {
      zone.insertBefore(dragged, target.before ? target.card : target.card.nextSibling);
    } else {
      zone.appendChild(dragged);
    }
  } else {
    const newCard = createAssignedModifier(type, {
      sourceId: dragged.dataset.id,
      percent: dragged.querySelector(".modifierPercent").value
    });
    if (target) zone.insertBefore(newCard, target.before ? target.card : target.card.nextSibling);
    else zone.appendChild(newCard);
  }

  handleDragEnd(event);
  updateDropHint(zone);
  // The priority calculation depends on DOM order, so update it immediately.
  if (calculationHasRun) calculateDamage(true);
  else synchronizeAssignedCheckboxes();
  saveCalculatorData();
}

function updateDropHint(zone) {
  if (!zone) return;
  const selector = zone.classList.contains("bladeDropZone") ? ".assignedBlade" : ".assignedTrap";
  const hint = zone.querySelector(".dropHint");
  if (hint) hint.style.display = zone.querySelectorAll(selector).length ? "none" : "block";
}

function getWizardData(element) {
  const index = [...document.querySelectorAll(".newWizard")].indexOf(element);
  return {
    element, id: element.dataset.id, index,
    name: element.querySelector(".wizardName").value.trim() || `Wizard ${index + 1}`,
    school: element.querySelector(".wizardSchool").value,
    spellDamage: numeric(element.querySelector(".spellDamageInput").value),
    pips: numeric(element.querySelector(".pipAmountInput").value, 1),
    enchant: numeric(element.querySelector(".enchantInput").value),
    percentMod: numeric(element.querySelector(".damagePercentInput").value),
    pierce: numeric(element.querySelector(".pierceInput").value),
    dotEnabled: element.querySelector(".dotEnabled").checked,
    dotDamage: numeric(element.querySelector(".dotDamageInput").value),
    blades: [...element.querySelectorAll(".assignedBlade")].map(card => ({
      id: card.dataset.id,
      percent: numeric(card.querySelector(".modifierPercent").value),
      label: card.querySelector(".assignedModifierName").value.trim() || `Blade ${formatPercent(card.querySelector(".modifierPercent").value)}`
    }))
  };
}

function getEnemyData(row) {
  const index = [...document.querySelectorAll(".enemyRow")].indexOf(row);
  return {
    element: row, id: row.dataset.id,
    name: row.querySelector(".enemyNameInput").value.trim() || `Enemy ${index + 1}`,
    health: Math.max(0, numeric(row.querySelector(".healthInput").value)),
    resistances: [...row.querySelectorAll(".resistanceEntry")].map(entry => ({
      schools: selectedResistanceSchools(entry),
      percent: numeric(entry.querySelector(".resistInput").value)
    })),
    traps: [...row.querySelectorAll(".assignedTrap")].map(card => ({
      id: card.dataset.id,
      percent: numeric(card.querySelector(".modifierPercent").value),
      label: card.querySelector(".assignedModifierName").value.trim() || `Trap ${formatPercent(card.querySelector(".modifierPercent").value)}`
    }))
  };
}

function getEnchantSplit(wizard) {
  const hasDirectDamage = wizard.spellDamage * wizard.pips > 0;
  if (!wizard.dotEnabled) {
    return { directEnchant: wizard.enchant, dotEnchant: 0 };
  }
  if (hasDirectDamage) {
    return { directEnchant: wizard.enchant / 2, dotEnchant: wizard.enchant / 2 };
  }
  return { directEnchant: 0, dotEnchant: wizard.enchant };
}

function baseDamage(wizard) {
  const { directEnchant } = getEnchantSplit(wizard);
  return ((wizard.spellDamage * wizard.pips) + directEnchant) *
    (1 + wizard.percentMod / 100);
}

function damageBeforeModifiers(wizard, enemy) {
  return baseDamage(wizard) *
    Math.max(0, 1 - (resistanceForSchool(enemy, wizard.school) - wizard.pierce) / 100);
}

function dotDamageForMatchup(wizard, enemy, selectedIds) {
  if (!wizard.dotEnabled) return 0;
  const { dotEnchant } = getEnchantSplit(wizard);
  const resistMultiplier = Math.max(
    0, 1 - (resistanceForSchool(enemy, wizard.school) - wizard.pierce) / 100
  );
  const dotBase = (wizard.dotDamage + dotEnchant) *
    (1 + wizard.percentMod / 100) * resistMultiplier;
  return applyModifiers(
    dotBase,
    wizard.blades.filter(item => selectedIds.has(item.id))
  );
}

function combinedDamageForMatchup(wizard, enemy, selectedIds) {
  const modifiers = [...wizard.blades, ...enemy.traps].filter(item => selectedIds.has(item.id));
  const direct = applyModifiers(damageBeforeModifiers(wizard, enemy), modifiers);
  return direct + dotDamageForMatchup(wizard, enemy, selectedIds);
}

function applyModifiers(base, modifiers) {
  return modifiers.reduce((damage, modifier) => damage * (1 + modifier.percent / 100), base);
}

function getCurrentSelections() {
  return savedMatchupSelections;
}

function synchronizeAssignedCheckboxes() {
  const wizards = [...document.querySelectorAll(".newWizard")].filter(el => el.querySelector(".wizardInclude").checked).map(getWizardData);
  const enemies = [...document.querySelectorAll(".enemyRow")].filter(el => el.querySelector(".enemyInclude").checked).map(getEnemyData);

  // Each blade has one checkbox per enemy because a wizard may need
  // different blades for different enemy matchups.
  wizards.forEach(wizard => {
    wizard.element.querySelectorAll(".assignedBlade").forEach(card => {
      const area = card.querySelector(".assignedSelections");
      area.replaceChildren();
      enemies.forEach(enemy => {
        area.appendChild(makeAssignedCheckbox(
          card.dataset.id, wizard, enemy, `E${enemies.indexOf(enemy) + 1}: ${enemy.name}`
        ));
      });
    });
  });

  // Each trap has one checkbox per wizard, with wizard-specific colors.
  enemies.forEach(enemy => {
    enemy.element.querySelectorAll(".assignedTrap").forEach(card => {
      const area = card.querySelector(".assignedSelections");
      area.replaceChildren();
      wizards.forEach(wizard => {
        area.appendChild(makeAssignedCheckbox(
          card.dataset.id, wizard, enemy, `W${wizard.index + 1}: ${wizard.name}`
        ));
      });
    });
  });
}

function makeAssignedCheckbox(modifierId, wizard, enemy, text) {
  const key = `${wizard.id}::${enemy.id}`;
  const label = document.createElement("label");
  label.className = "assignedSelection";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = `assignedCheck wizardColor-${WIZARD_COLORS[wizard.index % 4]}`;
  checkbox.dataset.matchupKey = key;
  checkbox.dataset.modifierId = modifierId;
  checkbox.checked = savedMatchupSelections[key]?.[modifierId] === true;
  checkbox.title = text;

  const caption = document.createElement("span");
  caption.textContent = text;
  label.append(checkbox, caption);
  return label;
}

function calculateDamage(shouldOptimize = true) {
  calculationHasRun = true;
  if (shouldOptimize) savedMatchupSelections = {};
  renderAllMatchups(shouldOptimize);
  saveCalculatorData();
}

function renderAllMatchups(shouldOptimize) {
  const results = document.getElementById("results");
  results.replaceChildren();
  const wizards = [...document.querySelectorAll(".newWizard")].filter(el => el.querySelector(".wizardInclude").checked).map(getWizardData);
  const enemies = [...document.querySelectorAll(".enemyRow")].filter(el => el.querySelector(".enemyInclude").checked).map(getEnemyData);

  if (!wizards.length || !enemies.length) {
    const message = document.createElement("p");
    message.className = "emptyMessage";
    message.textContent = "Check Include on at least one wizard and one enemy to calculate damage.";
    results.appendChild(message);
    return;
  }

  wizards.forEach(wizard => enemies.forEach(enemy => {
    const key = `${wizard.id}::${enemy.id}`;
    const previous = savedMatchupSelections[key] || {};
    const modifiers = [
      ...wizard.blades.map(item => ({ ...item, kind: "blade" })),
      ...enemy.traps.map(item => ({ ...item, kind: "trap" }))
    ];

    let selectedIds;
    if (shouldOptimize) {
      selectedIds = chooseMinimumModifiers(wizard, enemy, modifiers).selectedIds;
    } else {
      selectedIds = new Set(modifiers.filter(item => previous[item.id] === true).map(item => item.id));
    }

    savedMatchupSelections[key] = Object.fromEntries(
      modifiers.map(item => [item.id, selectedIds.has(item.id)])
    );

    const card = document.createElement("article");
    card.className = "matchupCard";
    card.dataset.matchupKey = key;
    card.dataset.wizardId = wizard.id;
    card.dataset.enemyId = enemy.id;

    const title = document.createElement("div");
    title.className = "matchupTitle";
    title.textContent = `${wizard.name} vs. ${enemy.name}`;

    const subtitle = document.createElement("div");
    subtitle.className = "matchupSubtitle";
    subtitle.textContent = `Wizard ${wizard.index + 1} · ${wizard.school} · Enemy health ${formatNumber(enemy.health)} · ${formatNumber(resistanceForSchool(enemy, wizard.school))}% resist`;

    const bladeLine = document.createElement("div");
    bladeLine.className = "damageLine bladeDamageLine";
    const noResistLine = document.createElement("div");
    noResistLine.className = "damageLine noResistDamageLine";
    const finalLine = document.createElement("div");
    finalLine.className = "damageLine finalDamageLine";
    const dotLine = document.createElement("div");
    dotLine.className = "damageLine dotDamageLine";
    const status = document.createElement("div");
    status.className = "damageLine winStatus";
    const count = document.createElement("div");
    count.className = "damageLine modifierCount";

    card.append(title, subtitle, noResistLine, bladeLine, finalLine, dotLine, status, count);
    results.appendChild(card);
    updateMatchupCard(card);
  }));

  synchronizeAssignedCheckboxes();
}

function appendEmpty(parent, text) {
  const message = document.createElement("p");
  message.className = "emptyMessage";
  message.textContent = text;
  parent.appendChild(message);
}

function createSelectionCheckbox(modifier, selectedIds, wizardIndex, kind) {
  const label = document.createElement("label");
  label.className = "selectionOption";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "selectionCheckbox";
  checkbox.checked = selectedIds.has(modifier.id);
  checkbox.dataset.modifierId = modifier.id;
  checkbox.dataset.kind = kind;
  checkbox.classList.add(`wizardColor-${WIZARD_COLORS[wizardIndex] || "blue"}`);
  const text = document.createElement("span");
  text.textContent = `${modifier.label} (${kind})`;
  label.append(checkbox, text);
  return label;
}

function chooseMinimumModifiers(wizard, enemy, modifiers) {
  const target = enemy.health;
  const selectedIds = new Set();
  let damage = combinedDamageForMatchup(wizard, enemy, selectedIds);

  if (damage >= target) return { selectedIds, damage, wins: true };

  // Traps first, then blades, preserving their assigned positions.
  for (const modifier of [...enemy.traps, ...wizard.blades]) {
    if (modifier.percent <= 0) continue;
    selectedIds.add(modifier.id);
    damage = combinedDamageForMatchup(wizard, enemy, selectedIds);
    if (damage >= target) break;
  }

  return { selectedIds, damage, wins: damage >= target };
}

function updateMatchupCard(card) {
  const wizard = [...document.querySelectorAll(".newWizard")].map(getWizardData)
    .find(item => item.id === card.dataset.wizardId);
  const enemy = [...document.querySelectorAll(".enemyRow")].map(getEnemyData)
    .find(item => item.id === card.dataset.enemyId);
  if (!wizard || !enemy) return;

  const state = savedMatchupSelections[card.dataset.matchupKey] || {};
  const selectedIds = new Set(
    Object.keys(state).filter(modifierId => state[modifierId] === true)
  );
  const base = damageBeforeModifiers(wizard, enemy);
  const bladeOnly = applyModifiers(base, wizard.blades.filter(item => selectedIds.has(item.id)));
  const noResistBladeDamage = applyModifiers(baseDamage(wizard) * (1 + wizard.pierce / 100),
    wizard.blades.filter(item => selectedIds.has(item.id)));
  const allModifiers = [
    ...wizard.blades.map(item => ({ ...item, kind: "blade" })),
    ...enemy.traps.map(item => ({ ...item, kind: "trap" }))
  ];
  const finalDamage = applyModifiers(base, allModifiers.filter(item => selectedIds.has(item.id)));

  card.querySelector(".noResistDamageLine").textContent =
    `Blades + pierce (resist = 0): ${formatNumber(noResistBladeDamage)}`;
  card.querySelector(".bladeDamageLine").textContent =
    `Blades + pierce (resist included): ${formatNumber(bladeOnly)}`;
  card.querySelector(".finalDamageLine").textContent =
    `Blades + pierce + traps (resist included): ${formatNumber(finalDamage)}`;
  const dotDamage = dotDamageForMatchup(wizard, enemy, selectedIds);
  const dotLine = card.querySelector(".dotDamageLine");
  dotLine.hidden = !wizard.dotEnabled;
  dotLine.textContent = `DoT damage (blades + pierce + resist, no traps): ${formatNumber(dotDamage)}`;
  const totalDamage = finalDamage + dotDamage;
  const status = card.querySelector(".winStatus");
  const wins = totalDamage >= enemy.health;
  status.textContent = wins ? "Defeats enemy" : "Does not defeat enemy";
  status.classList.toggle("win", wins);
  status.classList.toggle("lose", !wins);
  card.querySelector(".modifierCount").textContent = wizard.dotEnabled
    ? `Combined direct + DoT damage: ${formatNumber(totalDamage)} · Selected modifiers: ${selectedIds.size}`
    : `Selected modifiers: ${selectedIds.size}`;

}

function clearSavedData() {
  if (!window.confirm("Clear all saved wizards, enemies, blades, traps, and selections?")) return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

function setTemplateMinimized(panelId, minimized) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.classList.toggle("templateCollapsed", minimized);
  const body = panel.querySelector(".templatePanelBody");
  const button = panel.querySelector(".minimizeTemplateButton");
  body.hidden = minimized;
  button.textContent = minimized ? "+ Expand" : "− Minimize";
  button.setAttribute("aria-expanded", String(!minimized));
}

function toggleTemplatePanel(panelId) {
  const panel = document.getElementById(panelId);
  setTemplateMinimized(panelId, !panel.classList.contains("templateCollapsed"));
  saveCalculatorData();
}


// Touchscreen support: press and drag templates into drop zones, or use
// the Move handle to rearrange assigned modifiers. Mouse drag still works.
let mobileDrag = null;

function handleMobilePointerDown(event) {
  if (event.pointerType === "mouse" || event.button !== 0) return;
  const handle = event.target.closest(".reorderHandle");
  const template = event.target.closest(".templateBlade, .templateTrap");
  const card = handle?.closest(".assignedBlade, .assignedTrap") || template;
  if (!card) return;
  mobileDrag = {
    pointerId: event.pointerId,
    card,
    originX: event.clientX,
    originY: event.clientY,
    x: event.clientX,
    y: event.clientY,
    active: false,
    zone: null,
    target: null,
    before: false
  };
}

function handleMobilePointerMove(event) {
  const drag = mobileDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  drag.x = event.clientX;
  drag.y = event.clientY;

  if (!drag.active) {
    if (Math.hypot(drag.x - drag.originX, drag.y - drag.originY) < 9) return;
    drag.active = true;
    drag.card.classList.add("touchDragging");
    document.body.classList.add("touchReordering");
  }
  if (event.cancelable) event.preventDefault();

  const under = document.elementFromPoint(event.clientX, event.clientY);
  const zone = under?.closest(".bladeDropZone, .enemyTrapDropZone");
  const type = drag.card.dataset.type;
  const isAssigned = drag.card.classList.contains("assignedBlade") ||
    drag.card.classList.contains("assignedTrap");
  const valid = zone &&
    ((type === "blade" && zone.classList.contains("bladeDropZone")) ||
     (type === "trap" && zone.classList.contains("enemyTrapDropZone"))) &&
    (!isAssigned || drag.card.parentElement === zone);

  document.querySelectorAll(".dragOver").forEach(el => el.classList.remove("dragOver"));
  document.querySelectorAll(".reorderBefore, .reorderAfter").forEach(el =>
    el.classList.remove("reorderBefore", "reorderAfter"));

  drag.zone = valid ? zone : null;
  drag.target = null;
  if (!valid) return;
  zone.classList.add("dragOver");

  const other = under?.closest(".assignedBlade, .assignedTrap");
  if (other && other.parentElement === zone && other !== drag.card) {
    const rect = other.getBoundingClientRect();
    const before = event.clientX < rect.left + rect.width / 2;
    drag.target = other;
    drag.before = before;
    other.classList.add(before ? "reorderBefore" : "reorderAfter");
  }
}

function handleMobilePointerUp(event) {
  const drag = mobileDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  if (drag.active && drag.zone) {
    const zone = drag.zone;
    const card = drag.card;
    const assigned = card.classList.contains("assignedBlade") ||
      card.classList.contains("assignedTrap");
    const placed = assigned ? card : createAssignedModifier(card.dataset.type, {
      sourceId: card.dataset.id,
      percent: card.querySelector(".modifierPercent").value
    });

    if (drag.target) {
      zone.insertBefore(placed, drag.before ? drag.target : drag.target.nextSibling);
    } else {
      zone.appendChild(placed);
    }
    updateDropHint(zone);
    if (calculationHasRun) calculateDamage(true);
    else synchronizeAssignedCheckboxes();
    saveCalculatorData();
  }
  cancelMobilePointerDrag();
}

function cancelMobilePointerDrag() {
  if (mobileDrag) mobileDrag.card.classList.remove("touchDragging");
  mobileDrag = null;
  document.body.classList.remove("touchReordering");
  document.querySelectorAll(".dragOver").forEach(el => el.classList.remove("dragOver"));
  document.querySelectorAll(".reorderBefore, .reorderAfter").forEach(el =>
    el.classList.remove("reorderBefore", "reorderAfter"));
}
