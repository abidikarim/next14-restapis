import { NextResponse } from "next/server"
import { authMiddleware } from "./middlewares/authMiddleware"
import logMiddleware from "./middlewares/logMiddleware"

export const config = {
    matcher:'/api/:path*'
}

export default function middleware (request:Request) {
    const authResult = authMiddleware(request)
    if (request.url.includes('/api/blogs')) {
        const logResult = logMiddleware(request)
        console.log(logResult)
    }
    if(!authResult.isValid ) {
        return new NextResponse(JSON.stringify({message:'Unauthorized'}),{status:401})
    }
    return NextResponse.next()
}