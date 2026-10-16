import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/lib/data-access';
import { Order, CustomerInfo, OrderItem } from '@/types/checkout';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer: CustomerInfo = body.customer;
    const items: OrderItem[] = body.items;
    const total: number = Number(body.total || 0);
    const locale: string = body.locale || 'ar';

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

    // Generate reference code INF-26-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `INF-26-${randomCode}`;

    const newOrder: Order = {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'pending_confirmation',
      customer,
      items,
      total,
      locale,
      paymentMethod: 'COD',
    };

    await orderRepository.save(newOrder);

    return NextResponse.json({
      success: true,
      orderNumber,
      order: newOrder,
    });
  } catch (error) {
    console.error('[API /api/checkout POST] Error processing checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error processing checkout' },
      { status: 500 }
    );
  }
}
