import Link from "next/link";

export default function PropertyCard({ property }) {
  const {
    id,
    slug,
    title = "Modern Family Home",
    city = "California",
    price = 0,
    beds = 0,
    baths = 0,
    area = 0,
    image =
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80",
    type = "Sale",
    featured = false,
  } = property || {};

  const href = `/properties/${slug || id || "sample-property"}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur-md">
            {type}
          </span>
          {featured && (
            <span className="rounded-full bg-blue-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30">
              Featured
            </span>
          )}
        </div>
        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-slate-900">
              ${Number(price).toLocaleString()}
              {type.toLowerCase() === 'rent' && <span className="text-sm font-medium text-slate-400">/mo</span>}
            </p>
          </div>
          <h3 className="mt-1 line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {city}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-900">{beds} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252V14C20 14 8 14 8 14z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-900">{baths} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-900">{area} ft²</span>
          </div>
        </div>

        <Link
          href={href}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 active:scale-95"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
