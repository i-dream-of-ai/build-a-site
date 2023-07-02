import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import { conversations } from '@/helpers/conversationApi';

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .get( async (req)  => {

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id');
    
    try {
      const response = await conversations.getById(id);
      return NextResponse.json(response)
    } catch (error:any) {
      return NextResponse.json({error:error.message}, {status: 500})
    }
    
  })
  .post(async (req) => {
    const params = await req.json();
    try {
      const response = await conversations.create(params);
      return NextResponse.json(response);
    } catch (error:any) {
      console.log('error', error.message)

      return NextResponse.json(error.message, {status: 500})
    }
  })
  .put(async (req) => {
    const params = await req.json();
    try {
      const response = await conversations.update(params);
      return NextResponse.json(response);
    } catch (error:any) {
      console.log('conversation route put error: ', error)
      return NextResponse.json(error.message, {status: 500})
    }
  });

export async function GET(request: NextRequest, ctx: RequestContext) {
    return router.run(request, ctx);
}

export async function POST(request: NextRequest, ctx: RequestContext) {
    return router.run(request, ctx);
}

export async function PUT(request: NextRequest, ctx: RequestContext) {
    return router.run(request, ctx);
}