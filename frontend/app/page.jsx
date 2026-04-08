import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import FeaturedProperties from "@/components/FeaturedProperties";
import StatsSection from "@/components/StatsSection";

export const metadata = {
  title: "Premium Real Estate | Find Your Dream Home",
  description: "Discover exclusive properties in prime locations with our modern real estate platform.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Hero & Search Combined */}
      <section className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
        <HeroSection />
        <div className="mx-auto max-w-5xl px-4">
          <SearchBar />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Exclusive Selection
              </span>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Featured <span className="text-blue-600">Properties</span>
              </h2>
              <p className="mt-4 text-lg font-medium text-slate-500">
                Handpicked premium listings verified for quality and luxury.
              </p>
            </div>
            <button className="hidden rounded-2xl border-2 border-slate-100 bg-white px-8 py-3 text-sm font-bold text-slate-900 transition-all hover:border-blue-600 hover:text-blue-600 lg:block">
              View All
            </button>
          </div>
          <FeaturedProperties hideTitle />
        </div>
      </section>

      {/* Trust/Features Section */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="group rounded-[2.5rem] bg-white/5 p-10 ring-1 ring-white/10 transition-all hover:bg-white/10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl shadow-lg shadow-blue-600/20">
                🤝
              </div>
              <h3 className="text-2xl font-bold">Buy with confidence</h3>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Explore curated listings with transparent pricing and neighborhood
                insights. Every property is verified by our experts.
              </p>
            </div>
            <div className="group rounded-[2.5rem] bg-white/5 p-10 ring-1 ring-white/10 transition-all hover:bg-white/10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl shadow-lg shadow-indigo-600/20">
                🏠
              </div>
              <h3 className="text-2xl font-bold">Rent smarter</h3>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Compare rental options by budget, commute, and amenities in one
                place. Find the home that fits your lifestyle perfectly.
              </p>
            </div>
            <div className="group rounded-[2.5rem] bg-white/5 p-10 ring-1 ring-white/10 transition-all hover:bg-white/10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl text-slate-900 shadow-lg">
                ✨
              </div>
              <h3 className="text-2xl font-bold">Connect with experts</h3>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Reach local agents quickly and get guidance tailored to your
                goals. Professional support at every step of your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />
    </main>
  );
}
