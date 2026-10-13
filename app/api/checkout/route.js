import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

function getOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading orders file:', e);
  }
  return [];
}

function saveOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error saving orders file:', e);
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, total, locale } = body;

    if (!customer || !customer.name || !customer.phone || !customer.governorate || !customer.street) {
      return NextResponse.json(
        { error: 'Missing required delivery fields' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Generate reference code INF-YEAR-RANDOM
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `INF-26-${randomCode}`;

    const newOrder = {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'pending_confirmation',
      customer,
      items,
      total,
      locale: locale || 'ar',
      paymentMethod: 'COD',
    };

    // Save locally
    const existingOrders = getOrders();
    existingOrders.unshift(newOrder);
    saveOrders(existingOrders);

    // Note for Supabase:
    // When Supabase is configured, simply uncomment:
    // if (supabase) await supabase.from('orders').insert(newOrder);

    return NextResponse.json({
      success: true,
      orderNumber,
      order: newOrder,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing checkout' },
      { status: 500 }
    );
  }
}
