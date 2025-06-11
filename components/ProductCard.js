"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="card h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-lg">
        <Image
          src={product.image_url || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-600 text-sm">{product.category.name}</p>
          <p className="font-semibold text-primary">
            {product.price} TL
          </p>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto">
          <Link
            href={`/products/${product.id}`}
            className="btn btn-primary w-full text-center"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
