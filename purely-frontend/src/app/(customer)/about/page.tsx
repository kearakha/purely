export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Tentang Purely</h1>
      <p className="text-gray-600 mb-4">
        Purely adalah marketplace grocery & delivery terpercaya untuk wilayah
        Semarang dan sekitarnya. Kami menghubungkan petani lokal, peternak, dan
        pedagang pasar dengan konsumen yang menginginkan produk segar
        berkualitas langsung ke pintu rumah.
      </p>
      <p className="text-gray-600 mb-4">
        Didirikan pada 2024, Purely hadir dengan misi sederhana: membuat belanja
        kebutuhan sehari-hari jadi lebih mudah, lebih segar, dan lebih
        terjangkau.
      </p>
      <div className="grid grid-cols-3 gap-6 mt-10 text-center">
        <div className="bg-primary-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-primary-600">500+</p>
          <p className="text-gray-600 text-sm mt-1">Produk Tersedia</p>
        </div>
        <div className="bg-primary-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-primary-600">50+</p>
          <p className="text-gray-600 text-sm mt-1">Seller Aktif</p>
        </div>
        <div className="bg-primary-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-primary-600">10rb+</p>
          <p className="text-gray-600 text-sm mt-1">Pelanggan Puas</p>
        </div>
      </div>
    </div>
  );
}
