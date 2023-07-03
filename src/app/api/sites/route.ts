import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sites } from '@/helpers/siteApi'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token) {
    console.error('Error. Session not found.')
    return NextResponse.json(
      { error: 'Error. Session not found.' },
      { status: 400 },
    )
  }

  const user = token.user as any
  if (!user) {
    console.error('Error. User not found.')
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    )
  }

  try {
    const siteArray = await sites.getAll()
    return NextResponse.json({ sites: siteArray }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req })
  if (!token) {
    return NextResponse.json(
      { error: 'Error. Session not found.' },
      { status: 400 },
    )
  }

  const user = token.user as any
  if (!user) {
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    )
  }

  const { id } = await req.json()

  console.log('query', id)
  return

  // if(!id){
  //     return NextResponse.json({error:'Error. ID not found.'}, { status: 400 });
  // }

  // try {
  //     const { id } = await req.json();

  //     const client = await clientPromise;
  //     const collection = client.db(dbName).collection('sites');
  //     const siteResponse = await collection.findOne({_id: new ObjectId(id), userId: new ObjectId(user?._id)});

  //     if(!siteResponse){
  //         return NextResponse.json({error: "Site not found."}, { status: 401 });
  //     }

  //     //delete index file and bucket
  //     const isDeleted = await deleteBucket(true, siteResponse.name);

  //     if(!isDeleted.success){
  //         return NextResponse.json({error: isDeleted.error}, { status: 500 });
  //     }

  //     const response = await collection.deleteOne({_id:siteResponse._id});

  //     // Respond with the stream
  //     return NextResponse.json(response, { status: 200 });

  // } catch (error) {
  //     console.error(error);
  //     return NextResponse.json({error: error}, { status: 500 });
  // }
}
