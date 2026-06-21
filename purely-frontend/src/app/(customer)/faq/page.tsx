const FAQS = [
  {
    q: "Berapa lama pengiriman?",
    a: "Pengiriman same-day untuk order sebelum jam 12 siang. Order setelahnya dikirim keesokan hari.",
  },
  {
    q: "Apakah produk dijamin segar?",
    a: "Ya. Semua produk dipilih langsung dari petani & peternak lokal dan dikemas setiap pagi sebelum pengiriman.",
  },
  {
    q: "Bagaimana cara melacak pesanan?",
    a: 'Setelah login, buka menu "Pesanan Saya" untuk melihat status pesanan secara real-time.',
  },
  {
    q: "Apakah bisa refund?",
    a: "Bisa. Jika produk tidak sesuai atau rusak saat diterima, hubungi kami dalam 24 jam dan kami proses pengembalian dana.",
  },
  {
    q: "Minimum order berapa?",
    a: "Tidak ada minimum order. Beli sedikit pun kami antar.",
  },
  {
    q: "Area pengiriman mana saja?",
    a: "Saat ini kami melayani area Semarang Kota dan sekitarnya. Ekspansi ke kota lain segera hadir.",
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">FAQ</h1>
      <p className="text-gray-500 mb-8">Pertanyaan yang sering ditanyakan</p>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
            <p className="text-gray-600 text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
