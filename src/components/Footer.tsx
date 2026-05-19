import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-plum-900 border-t border-plum-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold text-warm-white">SREVOL</span>
            </Link>
            <p className="mt-4 text-sm text-warm-white/30 leading-relaxed max-w-xs">
              The travel experience built exclusively for couples. Plan together. Count down together. Escape together.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {["Instagram", "TikTok", "Pinterest"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-xs text-warm-white/25 hover:text-rose-gold transition-colors tracking-wider uppercase"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-[10px] font-semibold text-warm-white/40 uppercase tracking-[0.3em] mb-6">
              Destinations
            </h3>
            <ul className="space-y-3">
              {["Santorini", "Maldives", "Bora Bora", "Amalfi Coast", "Kyoto"].map((dest) => (
                <li key={dest}>
                  <Link href={`/packages?destination=${dest.toLowerCase()}`} className="text-sm text-warm-white/30 hover:text-rose-gold transition-colors">
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-semibold text-warm-white/40 uppercase tracking-[0.3em] mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {["About Us", "How It Works", "Travel Blog", "Careers"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-warm-white/30 hover:text-rose-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-semibold text-warm-white/40 uppercase tracking-[0.3em] mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {["Help Center", "Payment Plans", "Cancellation Policy"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-warm-white/30 hover:text-rose-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="text-sm text-warm-white/30 hover:text-rose-gold transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-warm-white/30 hover:text-rose-gold transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-plum-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-warm-white/20">
            © {new Date().getFullYear()} SREVOL. For Lovers Who Travel.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-warm-white/15 hover:text-warm-white/40 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-warm-white/15 hover:text-warm-white/40 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
