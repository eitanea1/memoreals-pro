import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = join(process.cwd(), 'data');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');

async function getOrders(): Promise<Record<string, unknown>[]> {
  try {
    const raw = await readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveOrder(order: Record<string, unknown>) {
  await mkdir(DATA_DIR, { recursive: true });
  const orders = await getOrders();
  orders.push(order);
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subjectName, subjectAge, subjectGender, aiLabel, customerEmail, customerPhone, characters, photoIds, customerNote } = body;

    if (!subjectName || !subjectAge || !subjectGender) {
      return NextResponse.json({ error: 'Name, age, and gender are required' }, { status: 400 });
    }
    if (!Array.isArray(characters) || characters.length !== 20) {
      return NextResponse.json({ error: 'Exactly 20 characters are required' }, { status: 400 });
    }
    if (!Array.isArray(photoIds) || photoIds.length < 15) {
      return NextResponse.json({ error: 'At least 15 photos are required' }, { status: 400 });
    }

    const order = {
      id: uuidv4(),
      subjectName,
      subjectAge,
      subjectGender,
      aiLabel: aiLabel || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      characters,
      photoIds,
      customerNote: customerNote || '',
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    await saveOrder(order);
    return NextResponse.json({ orderId: order.id, createdAt: order.createdAt, status: order.status }, { status: 201 });
  } catch (err) {
    console.error('Order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
