import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRouter = createRouteMatcher([
  '/',
  '/upcoming',
  '/previous',
  '/recordings',
  '/personal-room',
  '/meeting(.*)'
])

export default clerkMiddleware((auth, req)=>{
  if(protectedRouter(req)){
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};