



// let healthInput = 100000
// let baseDamageInput = 700
// let resistInput = 0
// let pierceInput = 19
// let trapsInput = true
// let bladesInput = true
console.log('healthInput: ' + healthInput)
console.log('baseDamageInput: ' + baseDamageInput)
console.log('resistInput: ' + resistInput)
console.log('pierceInput: ' + pierceInput)
console.log('trapsInput: ' + trapsInput)
console.log('bladesInput: ' + bladesInput)

function calculateDamage() {

    let fiftybladeAmount=0
    let fortybladeAmount=0
    let thirtybladeAmount=0
    let upfeintAmount=0
    let feintAmount=0
    let fiftyblade=1.55
    let fortyblade=1.45
    let thirtyblade=1.35
    let upfeint=1.80
    let feint=1.70
    
    let totalDamage = 0
    let healthInput = Number(document.getElementById('healthInput').value);
    let baseDamageInput = Number(document.getElementById('baseDamageInput').value);
    let resistInput = Number(document.getElementById('resistInput').value);
    let pierceInput = Number(document.getElementById('pierceInput').value)   ;
    let trapsInput = document.getElementById('trapsInput').checked;
    let bladesInput = document.getElementById('bladesInput').checked;

    baseDamageInput = (baseDamageInput + 300)*2.56
    resistInput = (resistInput - pierceInput)/100
    console.log('resistInput: ' + resistInput)
    resistInput = 1 - resistInput
    console.log('resistInput: ' + resistInput)
    
    baseDamageInput = baseDamageInput * resistInput
    totalDamage = baseDamageInput
    console.log('totalDamage: ' + totalDamage)

    if(totalDamage <= healthInput) {
        if(trapsInput===true && bladesInput===true && feintAmount < 1) {
            feintAmount++
            totalDamage = baseDamageInput * feint
            console.log('totalDamage 80feint: ' + totalDamage)
            if(totalDamage <= healthInput && upfeintAmount < 1) {
                upfeintAmount++
                totalDamage = baseDamageInput * upfeint * feint
                console.log('totalDamage 70feint: ' + totalDamage)
            }
            if(totalDamage <= healthInput && thirtybladeAmount < 1) {
                thirtybladeAmount++
                    totalDamage = baseDamageInput * upfeint * feint * thirtyblade**thirtybladeAmount
                    console.log('totalDamage 35blade: ' + totalDamage)
                }
            while(totalDamage <= healthInput && fortybladeAmount < 2) {
                fortybladeAmount++
                    totalDamage = baseDamageInput * upfeint * feint * fortyblade**fortybladeAmount * thirtyblade**thirtybladeAmount
                    console.log('totalDamage 45blade: ' + totalDamage)
                }
            while(totalDamage <= healthInput && fiftybladeAmount < 2) {
                fiftybladeAmount++
                    totalDamage = baseDamageInput * upfeint * feint * fortyblade**fortybladeAmount * fiftyblade**fiftybladeAmount * thirtyblade**thirtybladeAmount
                    console.log('totalDamage 55blade: ' + totalDamage)
                }
            
    }
}   else {

    }
    

    function minionDamage() {
    if(totalDamage <= healthInput && thirtybladeAmount < 1) {
                thirtybladeAmount++
                    totalDamage = baseDamageInput * thirtyblade**thirtybladeAmount
                    console.log('totalDamage 35blade: ' + totalDamage)
                }
            while(totalDamage <= healthInput && fortybladeAmount < 2) {
                fortybladeAmount++
                    totalDamage = baseDamageInput * fortyblade**fortybladeAmount * thirtyblade**thirtybladeAmount
                    console.log('totalDamage 45blade: ' + totalDamage)
                }
            while(totalDamage <= healthInput && fiftybladeAmount < 2) {
                fiftybladeAmount++
                    totalDamage = baseDamageInput * fortyblade**fortybladeAmount * fiftyblade**fiftybladeAmount * thirtyblade**thirtybladeAmount
                    console.log('totalDamage 55blade: ' + totalDamage)
                }
            }



        if(bladesInput===true && trapsInput===false) {
            minionDamage()
        }


        // if(trapsInput===true && bladesInput===false) {

        //     }


        

        document.getElementById("upfeintAmount").textContent = upfeintAmount;
        document.getElementById("feintAmount").textContent = feintAmount;
        document.getElementById("fortybladeAmount").textContent = fortybladeAmount;
        document.getElementById("fiftybladeAmount").textContent = fiftybladeAmount;
        document.getElementById("thirtybladeAmount").textContent = thirtybladeAmount;
        document.getElementById("totalDamage").textContent = totalDamage.toFixed(2);
        console.log('totalDamage: ' + totalDamage.toFixed(2))
}


calculateDamage()