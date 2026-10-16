import { NextRequest, NextResponse } from 'next/server';
import { productRepository } from '@/lib/data-access';
import { Product } from '@/types/product';

/**
 * Public GET: Fetches the product catalog.
 */
export async function GET() {
  try {
    const products = await productRepository.getAll();
    return NextResponse.json(products);
  } catch (error) {
    console.error('[API /api/products GET] Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

/**
 * POST: Create a new product.
 * Restricted to local development in frontend phase.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Administrative mutations are disabled in production until real authentication and authorization are configured.' },
      { status: 403 }
    );
  }

  try {
    const raw = await request.json();

    if (!raw.id || !raw.nameAr || raw.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: id, nameAr, price' },
        { status: 400 }
      );
    }

    const parseNotes = (val: unknown): string[] => {
      if (Array.isArray(val)) return val.map(String).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
      return [];
    };

    const formattedProduct: Product = {
      id: String(raw.id),
      nameAr: String(raw.nameAr),
      nameEn: String(raw.nameEn || raw.nameAr),
      taglineAr: String(raw.taglineAr || ''),
      taglineEn: String(raw.taglineEn || raw.taglineAr || ''),
      price: Number(raw.price),
      size: String(raw.size || '100ml / 3.4 FL. OZ.'),
      concentration: String(raw.concentration || 'Extrait de Parfum (30%)'),
      discountPercent: Number(raw.discountPercent || 0),
      discountActive: Boolean(raw.discountActive),
      inStock: raw.inStock !== false,
      featured: Boolean(raw.featured),
      scentCharacterAr: String(raw.scentCharacterAr || ''),
      scentCharacterEn: String(raw.scentCharacterEn || ''),
      longevityAr: raw.longevityAr ? String(raw.longevityAr) : undefined,
      longevityEn: raw.longevityEn ? String(raw.longevityEn) : undefined,
      sillageAr: raw.sillageAr ? String(raw.sillageAr) : undefined,
      sillageEn: raw.sillageEn ? String(raw.sillageEn) : undefined,
      occasionAr: raw.occasionAr ? String(raw.occasionAr) : undefined,
      occasionEn: raw.occasionEn ? String(raw.occasionEn) : undefined,
      image: String(raw.image || '/images/products/oud-royale.jpg'),
      descriptionAr: String(raw.descriptionAr || ''),
      descriptionEn: String(raw.descriptionEn || ''),
      topNotesAr: parseNotes(raw.topNotesAr),
      topNotesEn: parseNotes(raw.topNotesEn),
      heartNotesAr: parseNotes(raw.heartNotesAr),
      heartNotesEn: parseNotes(raw.heartNotesEn),
      baseNotesAr: parseNotes(raw.baseNotesAr),
      baseNotesEn: parseNotes(raw.baseNotesEn),
    };

    const saved = await productRepository.save(formattedProduct);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    console.error('[API /api/products POST] Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

/**
 * PUT: Update an existing product or discount.
 * Restricted to local development in frontend phase.
 */
export async function PUT(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Administrative mutations are disabled in production until real authentication and authorization are configured.' },
      { status: 403 }
    );
  }

  try {
    const raw = await request.json();

    if (!raw.id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const existing = await productRepository.getById(raw.id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const parseNotes = (val: unknown, fallback: string[]): string[] => {
      if (val === undefined) return fallback;
      if (Array.isArray(val)) return val.map(String).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
      return [];
    };

    const updated: Product = {
      ...existing,
      nameAr: raw.nameAr !== undefined ? String(raw.nameAr) : existing.nameAr,
      nameEn: raw.nameEn !== undefined ? String(raw.nameEn) : existing.nameEn,
      taglineAr: raw.taglineAr !== undefined ? String(raw.taglineAr) : existing.taglineAr,
      taglineEn: raw.taglineEn !== undefined ? String(raw.taglineEn) : existing.taglineEn,
      price: raw.price !== undefined ? Number(raw.price) : existing.price,
      size: raw.size !== undefined ? String(raw.size) : existing.size,
      concentration: raw.concentration !== undefined ? String(raw.concentration) : existing.concentration,
      discountPercent: raw.discountPercent !== undefined ? Number(raw.discountPercent) : existing.discountPercent,
      discountActive: raw.discountActive !== undefined ? Boolean(raw.discountActive) : existing.discountActive,
      inStock: raw.inStock !== undefined ? Boolean(raw.inStock) : existing.inStock,
      featured: raw.featured !== undefined ? Boolean(raw.featured) : existing.featured,
      image: raw.image !== undefined ? String(raw.image) : existing.image,
      descriptionAr: raw.descriptionAr !== undefined ? String(raw.descriptionAr) : existing.descriptionAr,
      descriptionEn: raw.descriptionEn !== undefined ? String(raw.descriptionEn) : existing.descriptionEn,
      topNotesAr: parseNotes(raw.topNotesAr, existing.topNotesAr),
      topNotesEn: parseNotes(raw.topNotesEn, existing.topNotesEn),
      heartNotesAr: parseNotes(raw.heartNotesAr, existing.heartNotesAr),
      heartNotesEn: parseNotes(raw.heartNotesEn, existing.heartNotesEn),
      baseNotesAr: parseNotes(raw.baseNotesAr, existing.baseNotesAr),
      baseNotesEn: parseNotes(raw.baseNotesEn, existing.baseNotesEn),
    };

    const saved = await productRepository.save(updated);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    console.error('[API /api/products PUT] Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

/**
 * DELETE: Remove a product.
 * Restricted to local development in frontend phase.
 */
export async function DELETE(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Administrative mutations are disabled in production until real authentication and authorization are configured.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const deleted = await productRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('[API /api/products DELETE] Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
