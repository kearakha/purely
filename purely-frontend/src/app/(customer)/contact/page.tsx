export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Kontak Kami</h1>
      <p className="text-gray-500 mb-8">
        Ada pertanyaan atau kendala? Kami siap membantu.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6 space-y-1">
          <p className="font-semibold">Email</p>
          <p className="text-gray-600 text-sm">hello@purely.id</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 space-y-1">
          <p className="font-semibold">WhatsApp</p>
          <p className="text-gray-600 text-sm">0812-3456-7890</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 space-y-1">
          <p className="font-semibold">Jam Operasional</p>
          <p className="text-gray-600 text-sm">Senin–Sabtu, 07.00–21.00 WIB</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 space-y-1">
          <p className="font-semibold">Alamat</p>
          <p className="text-gray-600 text-sm">Semarang, Jawa Tengah</p>
        </div>
      </div>
    </div>
  );
}
