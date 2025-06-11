"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTshirt, FaCalendarCheck, FaStar } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);

  
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/admin/products');
        if (!response.ok) {
          throw new Error('Products could not be loaded');
        }
        const data = await response.json();
        setProducts(data.slice(0,3));
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]); // Hata durumunda boş array
      }
    }
    loadProducts();
  }, []);

  return (
    <main>
      {/* Kahraman Alanı */}
      <section className="relative h-[500px] bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 h-full flex items-center bg-primary-dark/80">
          <div className="max-w-lg text-white">
            <h1 className="heading mb-4">
              Her An İçin Kaliteli Çocuk Giyimi
            </h1>
            <p className="text-lg mb-8">
              Her yaşa uygun, rahat, şık ve dayanıklı çocuk kıyafetlerini
              keşfedin.
            </p>
            <Link
              href="/products"
              className="btn bg-white text-primary hover:bg-gray-100"
            >
              Koleksiyonu İncele
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full hidden lg:block">
          <div className="w-full h-full relative">
            <img
              src="https://i.imgur.com/Wnz3AX6.jpeg"
              alt="Ana Görsel"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Neden Kent Of Kids?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-primary text-5xl mb-4 flex justify-center">
                <FaTshirt />
              </div>
              <h3 className="text-xl font-semibold mb-3">Kaliteli Malzeme</h3>
              <p className="text-gray-600">
                Kıyafetlerimiz aktif çocuklar için dayanıklı ve kaliteli
                kumaşlardan üretilmiştir.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-primary text-5xl mb-4 flex justify-center">
                <FaCalendarCheck />
              </div>
              <h3 className="text-xl font-semibold mb-3">Özel Siparişler</h3>
              <p className="text-gray-600">
                Özel istekler, kişiye özel tasarımlar ve ölçü seçenekleri için
                ekibimizle randevu alın.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-primary text-5xl mb-4 flex justify-center">
                <FaStar />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Müşteri Memnuniyeti
              </h3>
              <p className="text-gray-600">
                Her çocuğun kıyafetlerinden memnun kalması için üstün hizmet
                sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-semibold">Öne Çıkan Ürünler</h2>
            <Link href="/products" className="text-primary hover:underline">
              Tüm Ürünleri Gör
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-64 relative">
                    <Image
                      src={product.image_url || "/placeholder.jpg"}
                      alt={product.name || "Ürün"}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-2">{product.name || "Ürün Adı"}</h3>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-600">{product.category?.name || "Kategori"}</p>
                      <p className="font-semibold text-primary">
                        ₺{formatPrice(product.price)}
                      </p>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      {product.description || "Açıklama bulunmuyor"}
                    </p>
                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-primary w-full text-center"
                    >
                      Detayları Gör
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Ürünler yükleniyor...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Çağrı Alanı */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Siparişinizle İlgili Yardımcı Olalım
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Sorularınız mı var? Yardım mı gerekiyor? Ekibimizle bir randevu
            ayarlayın, size en uygun çocuk kıyafetlerini birlikte bulalım.
          </p>
          <Link
            href="/appointments"
            className="btn bg-white text-primary hover:bg-gray-100"
          >
            Randevu Al
          </Link>
        </div>
      </section>
    </main>
  );
}