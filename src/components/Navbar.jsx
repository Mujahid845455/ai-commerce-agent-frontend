import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const active = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center px-6">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-700"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-sm text-white">
            A
          </div>

          AgentPay
        </Link>

        {/* NAV */}
        <nav className="ml-10 flex items-center gap-7 text-sm">

          <Link
            to="/ai-shopping"
            className={
              active("/ai-shopping")
                ? "border-b-2 border-blue-600 py-6 font-semibold text-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }
          >
            AI Shopping
          </Link>

          <Link
            to="/orders"
            className={
              active("/orders")
                ? "border-b-2 border-blue-600 py-6 font-semibold text-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }
          >
            Orders
          </Link>

          <Link
            to="/cart"
            className={
              active("/cart")
                ? "border-b-2 border-blue-600 py-6 font-semibold text-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }
          >
            Cart
          </Link>

          <Link
            to="/account"
            className={
              active("/account")
                ? "border-b-2 border-blue-600 py-6 font-semibold text-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }
          >
            Account
          </Link>

        </nav>

        {/* SEARCH */}
        <div className="ml-auto flex items-center gap-4">

          <div className="hidden w-64 items-center gap-3 rounded-full bg-slate-100 px-4 py-2.5 md:flex">
            <span className="text-slate-400">⌕</span>

            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search..."
            />
          </div>

          {/* MODE */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 text-xs">

            <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white">
              Customer
            </button>

            <Link
              to="/merchant"
              className="px-4 py-2 text-slate-600"
            >
              Merchant
            </Link>

          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white">
            👤
          </div>

        </div>

      </div>
    </header>
  );
}