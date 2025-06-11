import ProductList from '@/components/ProductList';
import { prisma } from '@/lib/prisma'; // Prisma import'unu ekleyin

export const metadata = {
  title: 'Products | Kent Of Kids',
  description: "Browse our collection of high-quality children's clothing.",
};

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        stock: true,
        category: true
      }
    });

    // Price değerlerini sayıya çevir ve güvenli hale getir
    const formattedProducts = products.map(product => ({
      ...product,
      price: parseFloat(product.price) || 0
    }));

    return formattedProducts;
  } catch (error) {
    console.error('Ürünler alınırken hata:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true 
      }
    });
       
    return categories;
  } catch (error) {
    console.error('Kategoriler alınırken hata:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Ürünlerimiz</h1>

      <ProductList products={products} categories={categories} />
    </div>
  );
}