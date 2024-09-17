import connect from "@/lib/db"
import Category from "@/lib/modals/category"
import User from "@/lib/modals/user"
import { ObjectId } from "mongodb"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async (req:Request) => {
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message:"User id not found or invalid"}),
                {status:500}
            )
        }
        await connect()
         const user = await User.findById(userId)
         if(!user) {
            return new NextResponse(
                JSON.stringify({message:"User not found in the database"}),
                {status:400}
            )
         }
         const categories = await Category.find({user:new ObjectId(userId)})
         return new NextResponse(
            JSON.stringify(categories),{status:200}
         )
    } catch (error:any) {
        return new NextResponse (
            JSON.stringify({message:"Error in fetching categories "+error.message})
        )
    }
}


export const POST = async  (req:Request) => {
     try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({messsage:'User id missing or invalid'}),{status:400})
        }
        await connect()
        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(JSON.stringify({message:'User not found in the databese'}),{status:400})
        }
        const {title} = await req.json()
        const newCategory = await new Category({
            title,
            user:new ObjectId(userId)
        })
        await newCategory.save();
        return new NextResponse(
            JSON.stringify({message:'Category created successfully',category:newCategory}),
            {status:200}
    )
     } catch (error:any) {
            return new NextResponse(
                JSON.stringify({message:'Error in creating category'+error.message}),
                {status:500}
        )
     }
}