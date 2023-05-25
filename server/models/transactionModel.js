import  { Schema , model } from "mongoose";

export const transactionSchema = Schema({ 
        name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            credit: {
                type: Boolean,
                required: true,
                default: true,
            },
},
{
    timestamps:true
})


const Transactions = model('Transaction' , transactionSchema);

export default Transactions;