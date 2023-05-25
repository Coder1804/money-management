import asyncHandler from 'express-async-handler'
import { User } from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
// @desc Auth user/set token
// @route Post /api/users/auth
// @access Public
const authUser = asyncHandler(async (req,res)=>
{
    const {email,password} = req.body;

    const user = await User.findOne({email})
    if(user && (await user.comparePassword(password)))
    {
        await generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
        })
    }else
    {
        res.status(401);
        throw new Error("Parol yoki email noto'g'ri")
    }
})


// @desc Register user
// @route Post /api/users
// @access Public
const registerUser = asyncHandler(async (req,res)=>
{
    const {name,email,password} = req.body;
    const userExists = await User.findOne({email})
    if(userExists)
    {
        res.status(400);
        throw new Error ('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password
  })
  
    
    

    if(user)
    {
        generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
        })
    }else
    {
        res.status(400);
        throw new Error('invalid user data!')
    }
})

// @desc Logout
// @route Post /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req,res)=>
{
   res.cookie('jwt' , '' , {
    httpOnly:true,
    expires:new Date(0) 
   })
    
    res.status(200).json("logoutUser");
})

// @desc Get user profile
// @route Get /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req,res)=>
{
   
    const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
})

// @desc Update user profile
// @route Put /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req,res)=>
{
   
    const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password && req.body.newPassword) {
      if(!(await user.comparePassword(req.body.password)))
      {
        res.status(406);
      throw new Error("Eski parol to'gri kiritilmagan!")
      }else{
        user.password = req.body.newPassword;
      }
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('Foydalanuvchi topilmadi!');
  }
})

export {authUser , registerUser , logoutUser , updateUserProfile , getUserProfile}