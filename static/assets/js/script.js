const startWeight = 110;
const targetWeight = 85;
let differenceStartTarget = Math.abs(startWeight - targetWeight).toFixed(2);

let currentWeight = 106.7;
let differenceCurrentTarget = Math.abs(currentWeight - targetWeight).toFixed(2);

let semiWeightTarget = 100;
let differenceSemiTarget = Math.abs(semiWeightTarget - targetWeight).toFixed(2);

let percentCurrent = ((differenceCurrentTarget / differenceStartTarget) * 100).toFixed(2);
let percentSemi = ((differenceSemiTarget / differenceStartTarget) * 100).toFixed(2);


console.log("Percentages and Weight Calculations");
console.log("differnceCurrentTarget: " + differenceCurrentTarget);
console.log("percentCurrent: " + percentCurrent + "%");
console.log("differenceSemiTarget: " + differenceSemiTarget);
console.log("percentSemi: " + percentSemi + "%");