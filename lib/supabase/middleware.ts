import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  console.log("Mock middleware - updateSession called")
  return NextResponse.next({
    request,
  })
}
