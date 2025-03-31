import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const json = await req.json();
  console.log(json);

  return new Response('', { status: 200 });
}
