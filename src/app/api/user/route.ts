import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import { users } from '@/helpers/userApi';

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .get( async (req)  => {
    const {id} = await req.json();
    try {
      const response = users.getById(id);
      return NextResponse.json(response)
    } catch (error:any) {
      return NextResponse.json({error:error.message}, {status: 500})
    }
    
  })
  .post(async (req) => {
    const params = await req.json();
    try {
      const response = await users.create(params);
      return NextResponse.json(response);
    } catch (error:any) {
      console.log('error', error.message)

      return NextResponse.json(error.message, {status: 500})
    }
  });

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}