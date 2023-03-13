const mongoose = require('mongoose');
mongoose.set('strictQuery',false)



const db = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("mongo db databce conncted");
    } catch (err) {

        console.log(err);
        process.exit(1);

    }
}

module.exports = db





































// const mongoose=require("mongoose");
// const dotenv = require('dotenv') 
// mongoose.set("strictQuery",false)
// dotenv.config({path: '.env'});



// const db = async () =>{
//     try{
//         const con =await
//         mongoose.connect(process.env.MONGO_CONNECTION_URI,{
//             useNewUrlParser : true,
//             useUnifiedTopology :true,
//         })
//         console.log(`mongoDB connected :
//         ${con.connection.host}`);
//     }catch(err){
//         console.log(err)
//         process.exit(1);
//     }
// }







// const connectionDB=(()=>{

// mongoose.connect('mongodb://127.0.0.1:27017/',{
// dbName:"Bodyfit"
// })
// .then(()=>{
   
//     console.log('mongodb is connected');

// }).catch((err)=>{
//     console.log('not connected',err);
// });

// })

// module.exports = db