import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (!data?.id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (type === 'user.created') {
      await prisma.user.upsert({
        where: { externalId: data.id },
        update: {
          name: data.first_name || null,
          email: data.email_addresses[0]?.email_address || ''
        },
        create: {
          externalId: data.id,
          name: data.first_name || null,
          email: data.email_addresses[0]?.email_address || ''
        }
      });
    }

    if (type === 'user.updated') {
      await prisma.user.update({
        where: { externalId: data.id },
        data: {
          name: data.first_name || null,
          email: data.email_addresses[0]?.email_address || ''
        }
      });
    }

    if (type === 'user.deleted') {
      await prisma.user.delete({
        where: { externalId: data.id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
