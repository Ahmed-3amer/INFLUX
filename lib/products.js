import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

/**
 * Get all products.
 * Future Supabase switch:
 * return (await supabase.from('products').select('*')).data;
 */
export async function getProducts() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading products:', error);
  }
  return [];
}

/**
 * Get single product by id.
 */
export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * Save / Update products list.
 * Future Supabase switch:
 * await supabase.from('products').upsert(products);
 */
export async function saveProducts(products) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
}

/**
 * Add or update single product
 */
export async function saveProduct(product) {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index > -1) {
    products[index] = { ...products[index], ...product };
  } else {
    products.push(product);
  }
  return await saveProducts(products);
}

/**
 * Delete product
 */
export async function deleteProduct(id) {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  return await saveProducts(filtered);
}
