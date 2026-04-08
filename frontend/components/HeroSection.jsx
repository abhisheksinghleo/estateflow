import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&w=1920&q=80"
          alt="Modern Luxury Home"
          className="h-full w-full object-cover opacity-60 transition-transform duration-10000 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white sm:px-10">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300 ring-1 ring-white/20 backdrop-blur-md">
            Discover Your Next Chapter
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Modern Living, <br />
            <span className="text-blue-400">Elevated.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200 sm:text-xl">
            We curate the most exclusive properties in prime locations. 
            Experience a seamless journey to finding your dream home with our expert guidance.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/buy"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:bg-blue-50 hover:ring-4 hover:ring-white/20 active:scale-95"
            >
              Explore Listings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/10 hover:border-white/50 active:scale-95"
            >
              Contact Agent
            </Link>
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 grid w-full max-w-4xl grid-cols-3 gap-8 px-6 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-black text-white sm:text-4xl">1.2k+</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
              Premium Listings
            </p>
          </div>
          <div className="flex flex-col items-center border-x border-white/10 px-4">
            <p className="text-3xl font-black text-white sm:text-4xl">450+</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
              Happy Families
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-black text-white sm:text-4xl">24/7</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
              Expert Support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
