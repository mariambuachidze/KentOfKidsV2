import ProductList from '@/components/ProductList';

export const metadata = {
  title: 'Products | Kent Of Kids',
  description: "Browse our collection of high-quality children's clothing.",
};

async function getProducts() {
  // const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'https://your-domain.vercel.app'}/api/admin/products`, {
    cache: 'no-store', // Her sayfa yüklemesinde yeni veri çeker
  });

  if (!res.ok) throw new Error('Ürünler alınamadı');

  return res.json();
}

async function getCategories() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'https://your-domain.vercel.app'}/api/admin/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Kategoriler alınamadı');

  return res.json();
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