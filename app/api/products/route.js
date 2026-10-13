import { NextResponse } from 'next/server';
import { getProducts, getProductById, saveProducts, saveProduct, deleteProduct } from '@/lib/products';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const product = await request.json();

    if (!product.id || !product.nameAr || !product.price) {
      return NextResponse.json(
        { error: 'Missing required fields: id, nameAr, price' },
        { status: 400 }
      );
    }

    // Default fallbacks
    const formattedProduct = {
      ...product,
      price: Number(product.price),
      discountPercent: Number(product.discountPercent || 0),
      discountActive: Boolean(product.discountActive),
      inStock: product.inStock !== false,
      topNotesAr: Array.isArray(product.topNotesAr) ? product.topNotesAr : (product.topNotesAr || '').split(',').map((s) => s.trim()).filter(Boolean),
      topNotesEn: Array.isArray(product.topNotesEn) ? product.topNotesEn : (product.topNotesEn || '').split(',').map((s) => s.trim()).filter(Boolean),
      heartNotesAr: Array.isArray(product.heartNotesAr) ? product.heartNotesAr : (product.heartNotesAr || '').split(',').map((s) => s.trim()).filter(Boolean),
      heartNotesEn: Array.isArray(product.heartNotesEn) ? product.heartNotesEn : (product.heartNotesEn || '').split(',').map((s) => s.trim()).filter(Boolean),
      baseNotesAr: Array.isArray(product.baseNotesAr) ? product.baseNotesAr : (product.baseNotesAr || '').split(',').map((s) => s.trim()).filter(Boolean),
      baseNotesEn: Array.isArray(product.baseNotesEn) ? product.baseNotesEn : (product.baseNotesEn || '').split(',').map((s) => s.trim()).filter(Boolean),
      image: product.image || '/images/products/oud-royale.jpg',
    };

    await saveProduct(formattedProduct);
    return NextResponse.json({ success: true, product: formattedProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const product = await request.json();

    if (!product.id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const existing = await getProductById(product.id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const formattedProduct = {
      ...existing,
      ...product,
      price: product.price !== undefined ? Number(product.price) : existing.price,
      discountPercent: product.discountPercent !== undefined ? Number(product.discountPercent) : existing.discountPercent,
      discountActive: product.discountActive !== undefined ? Boolean(product.discountActive) : existing.discountActive,
      topNotesAr: product.topNotesAr !== undefined
        ? (Array.isArray(product.topNotesAr) ? product.topNotesAr : product.topNotesAr.split(',').map((s) => s.trim()).filter(Boolean))
        : existing.topNotesAr,
      topNotesEn: product.topNotesEn !== undefined
        ? (Array.isArray(product.topNotesEn) ? product.topNotesEn : product.topNotesEn.split(',').map((s) => s.trim()).filter(Boolean))
        : existing.topNotesEn,
      heartNotesAr: product.heartNotesAr !== undefined
        ? (Array.isArray(product.heartNotesAr) ? product.heartNotesAr : product.heartNotesAr.split(',').map((s) => s.trim()).filter(Boolean))
        : existing.heartNotesAr,
      heartNotesEn: product.heartNotesEn !== undefined
        ? (Array.isArray(product.heartNotesEn) ? product.heartNotesEn : product.heartNotesEn.split(',').map((s) => s.trim()).filter(Boolean))
        : existing.heartNotesEn,
      baseNotesAr: product.baseNotesAr !== undefined
        ? (Array.isArray(product.baseNotesAr) ? product.baseNotesAr : product.baseNotesAr.split(',').map((s) => s.trim()).filter(Boolean))
        : existing.baseNotesAr,
      baseNotesEn: product.baseNotesEn !== undefined
        ? (Array.isArray(product.baseNotesEn) ? product.baseNotesEn : product.baseNotesEn.split(',').map((s) => s.trim()).filter(Boolean))
        : existing.baseNotesEn,
    };

    await saveProduct(formattedProduct);
    return NextResponse.json({ success: true, product: formattedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
