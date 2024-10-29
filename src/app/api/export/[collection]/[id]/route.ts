import config from '@payload-config';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import { NextResponse } from 'next/server';
import { CollectionSlug } from 'payload';

export async function GET(
  request: Request,
  { params }: { params: { collection: string; id: string } }
) {
  try {
    const payload = await getPayloadHMR({ config });
    const doc = await payload.findByID({
      collection: params.collection as CollectionSlug,
      id: params.id,
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error('Export fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
} 