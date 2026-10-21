function addDiv() {
    // Create a new div
    const newDiv = document.createElement("div");

    // Add some content
    newDiv.textContent = "I am a new div!";

    // Add the div to the container
    document.getElementById("container").appendChild(newDiv);
}