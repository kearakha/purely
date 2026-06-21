export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Syarat & Ketentuan</h1>
      <p className="text-gray-500 mb-8">Terakhir diperbarui: 1 Januari 2026</p>
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            1. Penggunaan Layanan
          </h2>
          <p>
            Dengan menggunakan platform Purely, Anda menyetujui syarat dan
            ketentuan ini. Layanan ini ditujukan untuk pembelian produk grocery
            dan kebutuhan sehari-hari.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            2. Akun Pengguna
          </h2>
          <p>
            Anda bertanggung jawab menjaga kerahasiaan akun dan password. Purely
            tidak bertanggung jawab atas kerugian akibat penyalahgunaan akun
            oleh pihak lain.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            3. Pemesanan & Pembayaran
          </h2>
          <p>
            Pesanan dianggap sah setelah pembayaran dikonfirmasi. Harga yang
            tertera sudah termasuk pajak. Kami berhak membatalkan pesanan jika
            stok habis.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            4. Pengiriman
          </h2>
          <p>
            Pengiriman dilakukan sesuai jadwal yang dipilih. Purely tidak
            bertanggung jawab atas keterlambatan akibat kondisi di luar kendali
            kami.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            5. Pengembalian & Refund
          </h2>
          <p>
            Klaim produk rusak atau tidak sesuai dapat diajukan dalam 24 jam
            setelah penerimaan. Refund diproses dalam 3–5 hari kerja.
          </p>
        </section>
      </div>
    </div>
  );
}
