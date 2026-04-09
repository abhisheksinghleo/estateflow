"use client";

import { useState } from "react";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import MortgageCalculator from "@/components/MortgageCalculator";
import Skeleton from "@/components/Skeleton";
import { propertyApi, purchaseApi, messageApi, favoriteApi, formatPrice } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import useApi from "@/lib/useApi";

export default function PropertyDetailContent({ slug }) {
  const { user, isAuthenticated } = useAuth();
  const { data: property, loading } = useApi(
    () => propertyApi.getPropertyBySlug(slug),
    [slug],
    null,
  );

  const [buyModal, setBuyModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [isFaving, setIsFaving] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1.35fr,1fr]">
            <div className="space-y-4">
              <Skeleton variant="hero" className="h-96 rounded-2xl" />
              <Skeleton variant="block" className="h-64" />
            </div>
            <Skeleton variant="card" className="h-96" />
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <section className="min-h-screen bg-surface flex items-center justify-center">
        <div className="mx-auto max-w-4xl rounded-2xl bg-surface-container-low p-8 text-center">
          <h1 className="font-display text-headline-sm text-on-surface">Property not found</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">The property you are looking for does not exist or may have been removed.</p>
          <Link href="/buy" className="btn-primary mt-6 inline-flex">Browse available properties</Link>
        </div>
      </section>
    );
  }

  const priceDisplay = property.listingType === "rent"
    ? `${formatPrice(property.price, property.currency || "USD")}/mo`
    : formatPrice(property.price, property.currency || "USD");

  const isOwner = user && user.id === property.ownerId;
  const canBuy = isAuthenticated && user?.role === "buyer" && !isOwner && property.status !== "sold";

  async function handleBuyNow() {
    setActionStatus("");
    try {
      const res = await purchaseApi.buyProperty({ propertyId: property.id, type: "buy_now" });
      setActionStatus("✅ " + (res.message || "Purchase completed!"));
      setBuyModal(false);
    } catch (e) {
      setActionStatus("❌ " + (e.response?.data?.message || "Purchase failed"));
    }
  }

  async function handleMakeOffer(e) {
    e.preventDefault();
    setActionStatus("");
    try {
      const res = await purchaseApi.buyProperty({
        propertyId: property.id,
        type: "offer",
        offerPrice: Number(offerPrice) || property.price,
        message: offerMessage,
      });
      setActionStatus("✅ " + (res.message || "Offer sent!"));
      setBuyModal(false);
      setOfferPrice("");
      setOfferMessage("");
    } catch (e) {
      setActionStatus("❌ " + (e.response?.data?.message || "Failed to send offer"));
    }
  }

  async function handleContactSeller(e) {
    e.preventDefault();
    setActionStatus("");
    try {
      await messageApi.sendMessage({
        toId: property.ownerId || property.seller?.id,
        propertyId: property.id,
        subject: contactSubject || `Inquiry about ${property.title}`,
        body: contactMsg,
      });
      setActionStatus("✅ Message sent to seller!");
      setContactModal(false);
      setContactMsg("");
      setContactSubject("");
    } catch (e) {
      setActionStatus("❌ " + (e.response?.data?.message || "Failed to send message"));
    }
  }

  async function handleFavorite() {
    if (!isAuthenticated) return;
    setIsFaving(true);
    try {
      await favoriteApi.addFavorite(property.id);
      setActionStatus("✅ Added to favorites!");
    } catch (e) {
      setActionStatus(e.response?.status === 409 ? "Already in favorites" : "Failed to add");
    }
    setIsFaving(false);
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">

        {/* Status message */}
        {actionStatus && (
          <div className={`rounded-xl p-3 text-sm ${actionStatus.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {actionStatus}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.35fr,1fr]">
          <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-ambient">
            <img src={property.image} alt={property.title} className="h-72 w-full object-cover sm:h-96" />
            <div className="space-y-5 p-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-fixed px-3.5 py-1 text-label-sm font-semibold text-primary">
                  {property.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
                <span className="rounded-full bg-surface-container-low px-3.5 py-1 text-label-sm font-semibold text-on-surface">
                  {property.type}
                </span>
                {property.featured && (
                  <span className="rounded-full bg-secondary-container px-3.5 py-1 text-label-sm font-semibold text-primary">Featured</span>
                )}
                {/* Listing source badge */}
                {property.listedByAgent ? (
                  <span className="rounded-full bg-violet-100 px-3.5 py-1 text-label-sm font-semibold text-violet-700">Agent Listed</span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-label-sm font-semibold text-emerald-700">Direct Seller</span>
                )}
                {/* Currency badge */}
                <span className="rounded-full bg-amber-50 px-3.5 py-1 text-label-sm font-semibold text-amber-700">{property.currency || "USD"}</span>
                {property.status === "sold" && (
                  <span className="rounded-full bg-red-100 px-3.5 py-1 text-label-sm font-semibold text-red-600">SOLD</span>
                )}
              </div>

              <h1 className="font-display text-headline-sm text-on-surface sm:text-headline-lg">{property.title}</h1>
              <p className="text-body-sm text-on-surface-variant">{property.address}, {property.city}, {property.state} {property.country ? `(${property.country})` : ""}</p>

              <p className="font-display text-display-sm text-primary">{priceDisplay}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-surface-container-low p-4 text-center">
                <div>
                  <p className="font-display text-title-md text-on-surface">{property.beds}</p>
                  <p className="text-label-sm text-on-surface-variant">Beds</p>
                </div>
                <div>
                  <p className="font-display text-title-md text-on-surface">{property.baths}</p>
                  <p className="text-label-sm text-on-surface-variant">Baths</p>
                </div>
                <div>
                  <p className="font-display text-title-md text-on-surface">{property.areaSqFt}</p>
                  <p className="text-label-sm text-on-surface-variant">Sq Ft</p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-title-md text-on-surface">Description</h2>
                <p className="mt-2 text-body-md leading-relaxed text-on-surface-variant">{property.description}</p>
              </div>

              <div>
                <h3 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface">Amenities</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {(property.amenities || []).map((amenity) => (
                    <li key={amenity} className="rounded-full bg-surface-container-low px-3 py-1 text-label-sm text-on-surface">{amenity}</li>
                  ))}
                </ul>
              </div>

              {/* Seller / Agent info */}
              {(property.seller || property.agentInfo) && (
                <div className="rounded-xl bg-surface-container-low p-4 space-y-3">
                  {property.seller && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Seller</p>
                      <p className="text-sm font-medium text-on-surface">{property.seller.name}</p>
                      <p className="text-xs text-on-surface-variant">{property.seller.email} • {property.seller.phone}</p>
                    </div>
                  )}
                  {property.agentInfo && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Listed by Agent</p>
                      <p className="text-sm font-medium text-on-surface">{property.agentInfo.name}</p>
                      <p className="text-xs text-on-surface-variant">{property.agentInfo.email} • {property.agentInfo.phone}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Actions + Inquiry */}
          <div className="space-y-6">
            {/* Buy / Offer / Contact Actions */}
            {canBuy && (
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient space-y-3">
                <h3 className="font-display text-title-md text-on-surface">Interested?</h3>
                <p className="text-sm text-on-surface-variant">Choose how you'd like to proceed with this property.</p>
                <div className="space-y-2">
                  {property.listingType === "buy" && (
                    <>
                      <button onClick={() => setBuyModal(true)} className="w-full btn-primary text-sm">
                        🏠 Buy Now — {priceDisplay}
                      </button>
                      <button onClick={() => { setBuyModal(true); setOfferPrice(String(Math.round(property.price * 0.95))); }} className="w-full btn-secondary text-sm">
                        💰 Make an Offer
                      </button>
                    </>
                  )}
                  <button onClick={() => setContactModal(true)} className="w-full btn-secondary text-sm">
                    ✉️ Contact Seller
                  </button>
                  <button onClick={handleFavorite} disabled={isFaving} className="w-full btn-secondary text-sm">
                    {isFaving ? "Saving..." : "❤️ Save to Favorites"}
                  </button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient text-center">
                <p className="text-sm text-on-surface-variant mb-3">Login to buy, make offers, or contact the seller.</p>
                <Link href="/auth/login" className="btn-primary text-sm">Login to Continue</Link>
              </div>
            )}

            <InquiryForm propertyId={property.id} />
          </div>
        </section>

        {property.listingType === "buy" && <MortgageCalculator />}

        {/* ── Buy / Offer Modal ── */}
        {buyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient-lg max-w-md w-full space-y-4">
              <h2 className="font-display text-xl font-bold text-on-surface">
                {offerPrice ? "Make an Offer" : "Confirm Purchase"}
              </h2>
              {offerPrice ? (
                <form onSubmit={handleMakeOffer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Your Offer Price ({property.currency || "USD"})</label>
                    <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} required className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" />
                    <p className="text-xs text-on-surface-variant mt-1">Listed at: {priceDisplay}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Message to Seller (optional)</label>
                    <textarea value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} rows={3} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" placeholder="Why should the seller accept your offer?" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1 text-sm">Send Offer</button>
                    <button type="button" onClick={() => { setBuyModal(false); setOfferPrice(""); }} className="btn-secondary flex-1 text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-on-surface-variant">You are about to purchase <strong>{property.title}</strong> for <strong>{priceDisplay}</strong>.</p>
                  <p className="text-xs text-outline">This is a direct purchase. The property will be marked as sold.</p>
                  <div className="flex gap-2">
                    <button onClick={handleBuyNow} className="btn-primary flex-1 text-sm">Confirm Purchase</button>
                    <button onClick={() => setBuyModal(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Contact Seller Modal ── */}
        {contactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient-lg max-w-md w-full space-y-4">
              <h2 className="font-display text-xl font-bold text-on-surface">Contact Seller</h2>
              <form onSubmit={handleContactSeller} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Subject</label>
                  <input value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" placeholder={`Inquiry about ${property.title}`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Message *</label>
                  <textarea value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} rows={4} required className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" placeholder="Hi, I'm interested in this property..." />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary flex-1 text-sm">Send Message</button>
                  <button type="button" onClick={() => setContactModal(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
