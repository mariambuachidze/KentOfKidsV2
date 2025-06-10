import AppointmentForm from '@/components/AppointmentForm';

export const metadata = {
  title: 'Randevu Al | Kent Of Kids',
  description: 'Özel siparişler, beden yardımı veya özel talepler için randevu planlayın.',
};

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">Randevu Al</h1>
        
        <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-12">
          <h2 className="text-xl font-medium mb-4">Neden Randevu Almalısınız?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center text-white shrink-0">1</div>
              <div>
                <h3 className="font-medium">Özel Siparişler</h3>
                <p className="text-gray-600">
                  Özel tasarım kıyafetler, farklı bedenler veya özel ihtiyaçlarınız için detayları görüşün.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center text-white shrink-0">2</div>
              <div>
                <h3 className="font-medium">Beden Yardımı</h3>
                <p className="text-gray-600">
                  Çocuğunuzun ölçülerine en uygun bedeni bulmak için uzman desteği alın.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center text-white shrink-0">3</div>
              <div>
                <h3 className="font-medium">Ürün Danışmanlığı</h3>
                <p className="text-gray-600">
                  Kumaş seçenekleri, stiller ve özel günler için kıyafet önerileri hakkında bilgi alın.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <AppointmentForm />
      </div>
    </div>
  );
}
