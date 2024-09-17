import connect from "@/lib/db"
import Blog from "@/lib/modals/blog"
import Category from "@/lib/modals/category"
import User from "@/lib/modals/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async (req:Request, context:{params:any}) => {
    try {
        const blogId = context.params.blog
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get('categoryId')
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message:'Missing or invalid userId'}),{status:404})
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({message:'Missing or invalid categoryId'}),{status:404})
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({message:'Missing or invalid blogId'}),{status:404})
        }
        await connect()
        const user = await User.findById(userId)
        const category = await Category.findById(categoryId)
        if(!user || !category) {
            return new NextResponse(JSON.stringify({message:'User or category not found in the database'}),{status:404})
        }
        const blog = await Blog.findOne({
            _id:blogId,
            user:userId,
            category:categoryId
        })
        if(!blog) {
            return new NextResponse(JSON.stringify({message:'Blog not found in the database'}))
        }
        return new NextResponse(JSON.stringify(blog),{status:200})
    } catch (error) {
        return new NextResponse(JSON.stringify({message:'Error in fetching blog'}),{status:500})
    }
}

export const PATCH = async (req:Request,context:{params:any}) => {
  try {
        const blogId = context.params.blog
        const body = await req.json()
        const {title,description} = body
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message:'Missing or invalid userId'}),{status:404})
        }
        await connect()
        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(JSON.stringify({message:'User not found in the database'}),{status:404})
        }
        const blog = await Blog.findOne({
            _id:blogId,
            user:userId
        })
        if(!blog) {
            return new NextResponse(JSON.stringify({message:'Blog not found in the database'}))
        }
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {title,description},
            {new:true}
        )
        return new NextResponse(JSON.stringify({message:'Blog updated successfully',blog:updatedBlog}),{status:200})
  } catch (error:any) {
     return new NextResponse(JSON.stringify({message:'Error in updating blog',error:error.message}),{status:500})
  }
}

export const DELETE = async (req:Request,context:{params:any}) => {
    try {
        const blogId = context.params.blog
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')
        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message:'Missing or invalid userId'}),{status:404})
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({message:'Missing or invalid blogId'}),{status:404})
        }
        await connect()
        const user = await User.findById(userId)
        if(!user) {
            return new NextResponse(JSON.stringify({message:'User not found in the database'}),{status:404})
        }
        const blog = await Blog.findOne({
            _id:blogId,
            user:userId
        })
        if(!blog) {
            return new NextResponse(JSON.stringify({message:'Blog not found in the database'}))
        }
        const deletedBlog = await Blog.findOneAndDelete(blog)
        return new NextResponse(JSON.stringify({message:'Blog deleted successfuly',blog:deletedBlog}),{status:200})
        
    } catch (error:any) {
        return new NextResponse(
            JSON.stringify({message:'Error on deleting blog',error:error.message}),
            {status:500}
        )
    }
}