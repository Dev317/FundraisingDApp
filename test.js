require('dotenv').config()
const myVar = "0x" + process.env.PRIVATE_KEY;
console.log(myVar);
console.log(typeof myVar);
