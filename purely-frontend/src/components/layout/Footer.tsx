import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Purely</h3>
            <p className="text-sm">
              Marketplace grocery & delivery terpercaya untuk Semarang. 
              Belanja kebutuhan sehari-hari jadi lebih mudah.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Beranda</Link></li>
              <li><Link href="/products" className="hover:text-white">Produk</Link></li>
              <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-white font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Kontak</Link></li>
              <li><Link href="/terms" className="hover:text-white">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: hello@purely.id</li>
              <li>Phone: 0812-3456-7890</li>
              <li>Semarang, Jawa Tengah</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Purely. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};