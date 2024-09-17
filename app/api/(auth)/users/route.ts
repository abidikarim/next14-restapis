import  connect from "@/lib/db"
import User from "@/lib/modals/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"
const ObjectId = require("mongoose").Types.ObjectId
export const GET = async () => {
    try {
       await connect()
       const users = await User.find();
       return new NextResponse(JSON.stringify(users),{status:200})
    } catch (error:any) {
        return new NextResponse("Error in fetching users"+error.message,{status:500})
    }
} 

export const POST = async (req:Request) => {
   try {
    const body = await req.json();
    await connect();
    const newUser = new User(body)
    await newUser.save()
    return new NextResponse(JSON.stringify({message:"User is created ",user:newUser})
    ,{status:200})
   } catch (error:any) {
        return  new NextResponse("Error in creating user"+error.message,{status:500})
   } 

}

export const PATCH = async(req:Request)=> {
   try {
        const body= await req.json()
        await connect()
        const {userId,newUserName} = body
       if(!userId || !newUserName) {
           return new NextResponse(
              JSON.stringify({message:"Id or user name not found"}),
              {status:400}
           )
       }
       if(!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message:"Invalid user id "}),
                {status:400}
            )
       }
       const updateUser = await User.findOneAndUpdate(
          {_id:new ObjectId(userId)},
          {username:newUserName},
          {new:true}
       )
       if(!updateUser) {
          return new NextResponse(
              JSON.stringify({message:"User not found in database"}),
              {status:400}
          )
       }
       return new NextResponse(
          JSON.stringify({message:"User is updated",user:updateUser}),
          {status:200}
       )
   } catch (error:any) {
        return new NextResponse(JSON.stringify({message:"Error in updating user"+error.message}))
   }
}

export const DELETE = async (req:Request) =>{
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")
        if(!userId) {
            return new NextResponse(
                JSON.stringify({message:"Missing user id"}),
                {status:400}
            )
        }
        if(! Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message:"User id invalid"}),
                {status:400}
            )
        }
        await connect()
        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId))
        if(!deletedUser) {
            return new NextResponse(
                JSON.stringify({message:"User not found in database"}),
                {status:400}
            )
        }
        return new NextResponse(
            JSON.stringify({message:"User deleted successfuly",user:deletedUser}),
            {status:200}
        )
    } catch (error:any) {
        return new NextResponse(
            JSON.stringify({message:"Error in deleted user"+error.message})
        )
    }
}