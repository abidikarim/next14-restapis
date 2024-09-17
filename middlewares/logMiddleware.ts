export default function logMiddleware (request:Request) {
    return {request:request.method+" "+request.url}
}