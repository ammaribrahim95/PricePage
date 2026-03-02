import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8 dark:bg-midnight-light dark:border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/img/favicon.ico" alt="Pawstrophe Digital" className="h-9 w-9 object-contain" />
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Pawstrophe <span className="text-royal">Digital</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">
              Premium digital agency based in Kuala Lumpur, dedicated to helping
              Malaysian SMEs thrive in the digital age.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Services
            </h4>
            <ul className="space-y-2.5">
              {["Web Design", "Multi-Page Sites", "Local SEO", "Maintenance"].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-sm text-slate-500 transition-colors hover:text-royal dark:text-slate-400 dark:hover:text-teal">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/portfolio" className="text-sm text-slate-500 hover:text-royal dark:text-slate-400 dark:hover:text-teal transition-colors">Portfolio</Link></li>
              <li><Link href="/faq" className="text-sm text-slate-500 hover:text-royal dark:text-slate-400 dark:hover:text-teal transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-500 hover:text-royal dark:text-slate-400 dark:hover:text-teal transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-royal dark:text-slate-400 dark:hover:text-teal transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-royal" style={{ fontSize: 16 }}>location_on</span>
                Kuala Lumpur, Malaysia
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-royal" style={{ fontSize: 16 }}>mail</span>
                theapawstrophe@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-royal" style={{ fontSize: 16 }}>phone</span>
                012-795 3577
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-white/[0.06]">
          <p className="text-xs text-slate-400">
            © 2026 Pawstrophe Digital. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-slate-400 transition-colors hover:text-royal">Terms of Service</Link>
            <Link href="#" className="text-xs text-slate-400 transition-colors hover:text-royal">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
