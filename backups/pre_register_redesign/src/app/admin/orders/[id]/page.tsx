export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OrderDetailTabs from './OrderDetailTabs';

export type SerializedOrder = {
  id: string;
  subjectName: string;
  subjectAge: string;
  subjectGender: string;
  customerEmail: string;
  customerPhone: string;
  customerNote: string;
  aiLabel: string;
  aiOverride: string;
  status: string;
  trainingFailed: boolean;
  loraUrl: string | null;
  createdAt: string;
  uploads: { id: string; storageUrl: string; originalName: string }[];
  characters: { id: string; name: string; displayName: string; position: number }[];
  generatedImages: {
    id: string;
    characterName: string;
    characterIndex: number;
    imageUrl: string;
    variation: string;
    isSample: boolean;
    isSelected: boolean;
  }[];
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      uploads:         true,
      characters:      { orderBy: { position: 'asc' } },
      generatedImages: { orderBy: { characterIndex: 'asc' } },
    },
  }).catch(() => null);

  if (!order) notFound();

  const serialized: SerializedOrder = {
    id:            order.id,
    subjectName:   order.subjectName,
    subjectAge:    order.subjectAge,
    subjectGender: order.subjectGender,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerNote:  order.customerNote,
    aiLabel:       order.aiLabel,
    aiOverride:    order.aiOverride,
    status:        order.status,
    trainingFailed: order.trainingFailed,
    loraUrl:       order.loraUrl,
    createdAt:     order.createdAt.toISOString(),
    uploads:       order.uploads.map((u) => ({ id: u.id, storageUrl: u.storageUrl, originalName: u.originalName })),
    characters:    order.characters.map((c) => ({ id: c.id, name: c.name, displayName: c.displayName, position: c.position })),
    generatedImages: order.generatedImages.map((g) => ({
      id: g.id, characterName: g.characterName, characterIndex: g.characterIndex,
      imageUrl: g.imageUrl, variation: g.variation, isSample: g.isSample, isSelected: g.isSelected,
    })),
  };

  return <OrderDetailTabs order={serialized} />;
}
