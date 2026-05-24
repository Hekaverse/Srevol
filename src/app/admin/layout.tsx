import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Command Center" },
  { href: "/admin/prices", label: "Price Intelligence" },
  { href: "/admin/curator", label: "Romance Curator" },
  { href: "/admin/packages", label: "Package Builder" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian">
      <nav className="border-b border-obsidian-muted/20 bg-obsidian-light/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-6 h-14">
            <Link
              href="/admin"
              className="text-sm font-bold text-ember tracking-wide-luxury uppercase"
            >
              SREVOL Admin
            </Link>
            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-warm-white/40 hover:text-warm-white transition-colors tracking-luxury"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="ml-auto">
              <Link
                href="/"
                className="text-xs text-warm-white/30 hover:text-warm-white transition-colors"
              >
                Exit →
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
