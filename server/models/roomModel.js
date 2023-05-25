import mongoose, { Schema } from 'mongoose';
import {transactionSchema} from '../models/transactionModel.js'
// import {outlaysSchema} from '../models/outlayModel.js'
const roomSchema = mongoose.Schema({
    name:{
        type:String,
        unique:true,
    },
    transactions:{
        type:[transactionSchema],
        default:[],
        
    },
    // in the future!
    // 
    // outlays:{
    //     type:[outlaysSchema],
    //     default:[]
    // },
    userRef:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},
    {timestamps:true,}
) 

roomSchema.methods.transactionCount = async function()
{
    let debits = await (this.transactions.filter(transaction=>!transaction.credit)).length
    let credits = await (this.transactions.filter(transaction=>transaction.credit)).length
    let obj = {
        debits,
        credits
    }
    return obj;
}

roomSchema.methods.transactionStatistics = async function()
{
    
    let debits = await this.transactions.filter(transaction=>!transaction.credit)
    let credits = await this.transactions.filter(transaction=>transaction.credit)
    let allDebitsPrice;
    let allCreditsPrice;
     
    debits.length ? allDebitsPrice = debits.map(transaction=>transaction.price).reduce((a,b)=>a+b) : allDebitsPrice = 0
    credits.length ? allCreditsPrice = credits.map(transaction=>transaction.price).reduce((a,b)=>a+b) : allCreditsPrice = 0
    
    let obj = {
        allCreditsPrice,
        allDebitsPrice
    }
    return obj;
}

// in the future
// roomSchema.methods.outlaysStatistics = async function ()
// {
//     let qarzlar = await (this.outlays.filter(data=> data.outlay.debit)).length;
//     let qarzdorlar = await (this.outlays.filter(data=>!data.outlay.debit)).length;
//     let berilganQarzlar = await(this.outlays.filter(data=>data.outlay.debit && data.price === 0)).length;
//     let olinganQarzlar = await(this.outlays.filter(data=>!data.outlay.debit && data.price === 0)).length;

//     return {
//         qarzlar,
//         qarzdorlar,
//         berilganQarzlar,
//         olinganQarzlar
//     }
// }

const Room = mongoose.model('Room', roomSchema);



export default Room;