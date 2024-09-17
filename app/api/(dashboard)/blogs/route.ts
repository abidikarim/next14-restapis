import connect from "@/lib/db"
import Blog from "@/lib/modals/blog"
import Category from "@/lib/modals/category"
import User from "@/lib/modals/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async(req:Request) =>{
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get('categoryId')
        const searchKeyword = searchParams.get('searchKeyword') as string
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const page = parseInt(searchParams.get('page') || "1")
        const limit = parseInt(searchParams.get("limit" ) || "10" )
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message:'User id missing or invalid'}),{status:404})
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({message:'Category id missing or invalid'}),{status:404})
        }
        await connect()
        const user = await User.findById(userId)
        const category = await Category.findById(categoryId)
        if(!user || !category) {
            return new NextResponse(JSON.stringify({message:'User or category not found in the database'}),{status:404})
        }


        // Filter blogs by userId and categoryId
        const filter: any = {
            user:new Types.ObjectId(userId),
            category:new Types.ObjectId(categoryId)
        }

        // Filter blogs by searchKeyword
        if(searchKeyword) {
            filter.$or = [
                {title:{$regex: searchKeyword, $options:'i'}},
                {description:{$regex:searchKeyword, $options:'i' }}
            ]
        }

        // Filter by date
        if(startDate && endDate) {
            filter.createdAt = {
                $gte:new Date(startDate),
                $lte: new Date(endDate)
            }
        }else if (startDate) {
            filter.createdAt = {
                $gte: new Date(startDate)
            }
        } else if (endDate) {
            filter.createdAt = {
                $lte: new Date(endDate)
            }
        }

        // Pagination
        const skip = (page - 1) * limit
        const blogs = await Blog.find(filter).skip(skip).limit(limit)
        return new NextResponse(JSON.stringify(blogs),{status:200})
    } catch (error:any) {
        return new NextResponse(JSON.stringify({message:'Error in fetching blogs'+error.message}),{status:500})
    }
}

export const POST = async(req:Request) => {
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get('categoryId')
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message:'User id missing or invalid'}),{status:404})
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({message:'Category id missing or invalid'}),{status:404})
        }
        await connect()
        const user = await User.findById(userId)
        const category = await Category.findById(categoryId)
        if(!user || !category) {
            return new NextResponse(JSON.stringify({message:'User or category not found in the database'}),{status:404})
        }
        const body = await req.json();
        const {title,description} = body;
        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category:new Types.ObjectId(categoryId)
        })
          await newBlog.save();
          return new NextResponse(JSON.stringify({message:'Blog created successfuly',blog:newBlog}),{status:200})
    } catch (error:any) {
        return new NextResponse(JSON.stringify({message:'Error in creating blog'+error.message}),{status:500})
    }
}