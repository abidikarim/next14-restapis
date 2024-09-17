import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from './../../../../../lib/db';
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";

export const PATCH = async (req:Request,context:{params:any}) => {
    try {
        const categoryId = context.params.category;
        const body = await req.json();
        const {title} = body
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse (
                JSON.stringify({message:'User id missing or invalid'}),{status:400}
            )
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({message:'Category id missing or invalid'}),{status:400})
        }
        await connect()
        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(
                JSON.stringify({message:'User not found in the database'}),{status:404}
            )
        }
        const category = await Category.findOne({_id:categoryId,user:userId})
        if(!category) {
            return new NextResponse(
                JSON.stringify({message:'Category not found in the database'}),
                {status:404}
            )
        }
        const newCategory = await Category.findByIdAndUpdate(
            categoryId,
            {title},
            {new:true}
        )
        return new NextResponse(
            JSON.stringify({message:'Category updated successfully',category:newCategory}),
            {status:200}
        )
    } catch (error:any) {
        return new NextResponse(
            JSON.stringify({message:'Error in updating category'+error.message})
        )
    }

}

export const DELETE = async (req:Request,context:{params:any}) =>{
    try {
        const categoryId= context.params.category
        const {searchParams} = new URL(req.url)
        const userId= searchParams.get('userId')
        if(!userId || !Types.ObjectId.isValid(userId)) {
                return new NextResponse(
                    JSON.stringify({message:'User id missing or invalid'}),
                    {status:404}
                )
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({message:'Category id missing or invalid'}),
                {status:404}
            )
        }
        await connect()
        const user= await User.findById(userId)
        if(!user) {
            return new NextResponse(
                JSON.stringify({message:'User not found in the database'}),
                {status:404}
            )
        }
        const category = await Category.findById(categoryId)
        if(!category) {
            return new NextResponse(
                JSON.stringify({message:'Category not found in the database'}),
                {status:404}
            )
        }
        const deleteCategory = await Category.findOneAndDelete({
            _id:categoryId,
            user:userId
        })
        if(!deleteCategory) {
            return new NextResponse(
                JSON.stringify({message:'Category does not belong to the user'}),
                {status:500}
            )
        }
        return new NextResponse(
            JSON.stringify({message:'Category deleted successfully',category:deleteCategory}),
            {status:200}
        )
    } catch (error:any) {
        return new NextResponse(
            JSON.stringify({message:'Error in deleting category '+error.message}),
            {status:500}
        )
    }
}