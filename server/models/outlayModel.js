import mongoose from "mongoose";

export const outlaysSchema = mongoose.Schema(
    {
    name:{
        type:String,
        required: true,
        unique:true,
    },
    outlay:{
        type:Boolean,
        required: true,
    },
    data:{
        type:mongoose.Schema({
            _price:{
                required:true,
                type:Number,
            },
            taken:{
                type:Boolean,
                required: true,
            }
        },{
            timestamps:true
        }),
        default:[]
    }
    

},
{
    timestamps:true,
    virtuals:{
        price:{
            get()
            {
                let pricesArray = this.data.map(data=>{
                    if(data.taken)
                    {
                        return data._price * -1;
                    }
                    else{
                        return data._price;
                    }
                })

                return pricesArray.reduce((a, b) => a + b, 0);
            }
        }
    }
})
