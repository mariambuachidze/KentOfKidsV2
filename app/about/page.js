"use client";

import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

export default function AboutClient() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Kent Of Kids Hakkında</h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-medium mb-4">Biz Kimiz?</h2>
          <p className="text-gray-700 mb-4">
            2018 yılında kurulan Kent Of Kids, dayanıklı, rahat ve şık çocuk
            kıyafetleri eksikliğinden doğdu. Üç çocuk annesi olan kurucumuz,
            oyun alanı maceralarına dayanacak ama şık görünecek bir marka
            yaratmak için yola çıktı.
          </p>
          <p className="text-gray-700 mb-4">
            Bizce çocuk kıyafetleri hem çocuklar hem de ebeveynler düşünülerek
            tasarlanmalı — giymesi kolay, bakımı pratik ve uzun ömürlü. Tüm
            ürünlerimiz hassas ciltlere uygun kaliteli malzemelerden
            üretilmiştir ve defalarca yıkamaya dayanıklıdır.
          </p>
          <p className="text-gray-700">
            Bugün Kent Of Kids, mükemmel müşteri hizmetine bağlı yerel bir marka
            olarak büyümeye devam ediyor. Çocukların giymeyi, ebeveynlerin
            almayı sevdiği kıyafetler üretmekten gurur duyuyoruz.
          </p>
        </div>

        <div className="bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src="https://i.imgur.com/1vAyUCc.jpeg"
            alt="Mağaza Görseli"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-medium mb-8 text-center">
          İletişim Bilgileri
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-primary text-xl mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Mağaza Adresi</h3>
                <p className="text-gray-700">
                  Zafer, Gazi Cd. no:101, 55100 İlkadım/Samsun
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaPhone className="text-primary text-xl mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Telefon</h3>
                <p className="text-gray-700">(+90) 532 702 88 59</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-primary text-xl mt-1" />
              <div>
                <h3 className="font-semibold mb-1">E-posta</h3>
                <p className="text-gray-700">info@kentofkids.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaClock className="text-primary text-xl mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                <p className="text-gray-700">
                  Pazartesi - Cuma: 09:00 - 17:00
                  <br />
                  Resmî tatiller hariç
                </p>
              </div>
            </div>
          </div>

          <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.2910839992633!2d36.33450107656947!3d41.28559427131162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x408877c9aeea4e77%3A0xaa6b1a25395ec670!2sZafer%2C%20Gazi%20Cd.%20No%3A101%2C%2055100%20%C4%B0lkad%C4%B1m%2FSamsun!5e0!3m2!1str!2str!4v1716561867030!5m2!1str!2str" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              aria-hidden="false" 
              tabIndex="0"
              title="Kent Of Kids Mağaza Konumu"
            />
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-2xl font-medium mb-4">Alışverişe Hazır mısınız?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Konfor, stil ve dayanıklılık için tasarlanmış yüksek kaliteli çocuk
          kıyafetleri koleksiyonumuzu keşfedin.
        </p>
        <a href="/products" className="btn btn-primary">
          Ürünlerimizi İnceleyin
        </a>
      </div>
    </main>
  );
}