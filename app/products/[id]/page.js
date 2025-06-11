import Image from "next/image";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Product Not Found | Kent Of Kids",
    };
  }

  return {
    title: `${product.name} | Kent Of Kids`,
    description: product.description,
  };
}

async function getProduct(id) {
  try {
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return null;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getProductStock(productId) {
  try {
    const stock = await prisma.stock.findUnique({
      where: { product_id: productId },
    });

    return stock?.quantity || 0;
  } catch (error) {
    console.error("Error fetching stock:", error);
    return 0;
  }
}

async function getProductComments(productId) {
  try {
    const comments = await prisma.comment.findMany({
      where: { product_id: productId },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
            is_admin: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                surname: true,
                is_admin: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export default async function ProductDetails({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Güvenli fiyat formatlaması
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  // Get stock and comments, with default values if they're not found
  const stockQuantity = await getProductStock(product.id);
  const comments = (await getProductComments(product.id)) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="w-full overflow-hidden rounded-lg">
          <div className="relative pt-[75%] bg-gray-100">
            <Image
              src={product.image_url || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm">
              {product.category?.name || "Uncategorized"}
            </span>
          </div>

          <div className="text-2xl font-bold text-primary mb-6">
            {formatPrice(product.price)} TL
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Ürün Açıklaması</h3>
            <p className="text-gray-700">
              {product.description || "No description available"}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Stok Durumu</h3>
            <div className={`text-${stockQuantity > 0 ? "green" : "red"}-600`}>
              {stockQuantity > 0
                ? `Stokta Mevcut (${stockQuantity} adet)`
                : "Stokta Yok"}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <CommentList comments={comments} productId={product.id} />
        <div className="mt-12">
          <CommentForm productId={product.id} />
        </div>
      </div>
    </div>
  );
}