
const mongoose=require('mongoose')
const initData=require("./data.js");
const Listing=require("../models/listing.js")
const User = require("../models/user");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderNest";
main().then(()=>{
    console.log("connected th db");
}).catch(err=>{
    console.log("error");
});

async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});
  
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"68049c5f8b54722192758dfd",
    }));
  
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  };

// const initDB = async ()=>{
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj)=>({...obj,owner:"67ec2cdd14c88fdd30351dac",
//     }));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized")
// }

initDB();