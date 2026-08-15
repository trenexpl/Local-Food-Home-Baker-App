import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodStatusBadge } from '../FoodStatusBadge';
import {
  ArrowLeft,
  X,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  Heart,
  Instagram,
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  Globe,
  Utensils,
  Image as ImageIcon,
  ThumbsUp,
  Search,
  Check,
  Sparkles,
  Award
} from 'lucide-react';

export const SellerDetailView: React.FC = () => {
  const {
    viewingSellerId,
    setViewingSellerId,
    sellers,
    products,
    reviews,
    userPrefs,
    toggleFavoriteSeller,
    addToCart,
    addReview
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalogue' | 'reviews' | 'about'>('catalogue');
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number>(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newDishName, setNewDishName] = useState('');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, number>>({});
  const [userVotedHelpful, setUserVotedHelpful] = useState<string[]>([]);
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);

  if (!viewingSellerId) return null;

  const seller = sellers.find((s) => s.id === viewingSellerId);
  if (!seller) return null;

  const isFavorited = userPrefs.favoriteSellerIds.includes(seller.id);
  const sellerProducts = products.filter((p) => p.sellerId === seller.id);
  const sellerReviews = reviews.filter((r) => r.sellerId === seller.id);

  // Calculate rating statistics
  const totalReviewsCount = sellerReviews.length;
  const averageRating = totalReviewsCount > 0
    ? (sellerReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(2)
    : seller.rating.toFixed(2);

  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    sellerReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [sellerReviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return sellerReviews.filter((r) => {
      const matchesStar = selectedStarFilter === 'all' || Math.round(r.rating) === selectedStarFilter;
      const matchesSearch = !reviewSearchQuery.trim() ||
        r.comment.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
        r.dishName.toLowerCase().includes(reviewSearchQuery.toLowerCase());
      return matchesStar && matchesSearch;
    });
  }, [sellerReviews, selectedStarFilter, reviewSearchQuery]);

  const handleGoToReviews = () => {
    setActiveTab('reviews');
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleToggleHelpful = (reviewId: string) => {
    if (userVotedHelpful.includes(reviewId)) {
      setUserVotedHelpful((prev) => prev.filter((id) => id !== reviewId));
      setHelpfulReviews((prev) => ({
        ...prev,
        [reviewId]: Math.max(0, (prev[reviewId] || 1) - 1),
      }));
    } else {
      setUserVotedHelpful((prev) => [...prev, reviewId]);
      setHelpfulReviews((prev) => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 0) + 1,
      }));
    }
  };

  const listingImages = seller.images && seller.images.length === 3
    ? seller.images
    : [
        seller.coverImage || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        seller.avatar || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=80',
      ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText) return;

    addReview({
      sellerId: seller.id,
      customerName: userPrefs.name && userPrefs.name !== 'Guest Customer' ? userPrefs.name : 'Singapore Foodie',
      rating: newRating,
      comment: newReviewText,
      dishName: newDishName || (sellerProducts[0]?.name || 'Signature Order'),
      verifiedBuyer: true,
    });

    setNewReviewText('');
    setNewDishName('');
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 4000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Back Button Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setViewingSellerId(null)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 font-bold text-xs hover:bg-zinc-100 hover:text-black transition shadow-xs cursor-pointer group"
          title="Return to food directory"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-zinc-800" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavoriteSeller(seller.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-800 font-bold text-xs hover:bg-zinc-50 transition shadow-xs cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-zinc-600'}`} />
            <span className="hidden sm:inline">{isFavorited ? 'Saved' : 'Save Kitchen'}</span>
          </button>

          {/* Direct Cross / Exit Button */}
          <button
            onClick={() => setViewingSellerId(null)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
            aria-label="Exit kitchen view"
            title="Exit / Close"
          >
            <X className="w-4 h-4 text-white" strokeWidth={2.5} />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* 3-IMAGE GALLERY HERO BANNER */}
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs relative">
        
        {/* Floating Top-Right Exit Button on Banner */}
        <button
          onClick={() => setViewingSellerId(null)}
          className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-zinc-900 border border-zinc-300 shadow-lg font-bold text-xs hover:scale-105 active:scale-95 transition cursor-pointer"
          aria-label="Exit kitchen view"
          title="Exit Kitchen"
        >
          <X className="w-3.5 h-3.5 text-zinc-900" strokeWidth={2.5} />
          <span>Exit</span>
        </button>

        {/* 3 Photos Grid Header */}
        <div className="p-3 bg-zinc-50 border-b border-zinc-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-52 sm:h-60 md:h-64 rounded-2xl overflow-hidden">
            {/* Main Featured Photo (Left 2 cols on desktop) */}
            <div className="md:col-span-2 relative h-full bg-zinc-200 rounded-xl overflow-hidden">
              <img
                src={listingImages[selectedGalleryIndex]}
                alt={`${seller.name} main image ${selectedGalleryIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>

              {/* SFA Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">SFA Certified Singapore Home Kitchen</span>
                <span className="sm:hidden">SFA Certified</span>
              </div>

              {/* Location Tag */}
              <div className="absolute bottom-3 left-3 text-white text-xs bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-1.5 max-w-[80%] truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{seller.fullAddress}</span>
              </div>

              <div className="absolute bottom-3 right-3 text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>Photo {selectedGalleryIndex + 1}/3</span>
              </div>
            </div>

            {/* Right 2 Side-by-side / Stacked Photos */}
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              {listingImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryIndex(idx)}
                  className={`relative rounded-xl overflow-hidden bg-zinc-200 cursor-pointer border-2 transition ${
                    selectedGalleryIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-400/30'
                      : 'border-transparent hover:opacity-90'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${seller.name} item ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    Photo {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Thumbnail Switcher */}
          <div className="flex md:hidden items-center gap-2 mt-2">
            {listingImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGalleryIndex(idx)}
                className={`flex-1 h-14 rounded-lg overflow-hidden border-2 transition ${
                  selectedGalleryIndex === idx ? 'border-amber-500' : 'border-transparent opacity-60'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumb ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-zinc-200 shadow-md bg-zinc-100"
                />
                {seller.verified && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-zinc-900 text-white p-1 rounded-full ring-2 ring-white"
                    title="Verified Kitchen"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-display">
                    {seller.name}
                  </h1>
                  <FoodStatusBadge
                    status={seller.foodStatus}
                    halalCertInfo={seller.halalCertInfo}
                    size="sm"
                  />
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
                  {seller.handle} • {seller.neighborhood}, {seller.region} Singapore
                </p>
                {seller.mainCategory && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[11px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded">
                      {seller.mainCategory}
                    </span>
                    {(seller.subCategories || []).slice(0, 3).map((sc) => (
                      <span key={sc} className="text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded">
                        {sc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Clickable Rating Badge & Orders Fulfilled Stats */}
            <div className="flex items-center gap-3">
              <button
                id="seller-rating-reviews-btn"
                onClick={handleGoToReviews}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200 text-center transition cursor-pointer group shadow-2xs hover:shadow-xs text-left"
                title="Click to view verified customer reviews"
              >
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-sm text-zinc-900">{seller.rating}</span>
                </div>
                <span className="text-[10px] text-amber-900 font-semibold group-hover:underline block mt-0.5 text-center">
                  {seller.reviewCount} reviews
                </span>
                <span className="text-[9px] text-amber-700 font-medium block text-center mt-0.5">
                  Click to view ↓
                </span>
              </button>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <p className="font-extrabold text-sm text-zinc-900">{seller.totalOrdersFulfilled}+</p>
                <span className="text-[10px] text-zinc-500 font-medium">Orders Fulfilled</span>
              </div>
            </div>
          </div>

          {/* Tagline & Bio */}
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-bold text-zinc-800">
              "{seller.tagline}"
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-3xl">
              {seller.bio}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 text-xs">
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-400 text-[10px] font-bold uppercase">Lead Time</span>
              <p className="font-bold text-zinc-800 mt-0.5">{seller.minLeadTime}</p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-400 text-[10px] font-bold uppercase">Delivery Fee</span>
              <p className="font-bold text-zinc-800 mt-0.5">
                {userPrefs.isVip ? 'Free (VIP Member)' : `S$${seller.deliveryFee.toFixed(2)}`}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-400 text-[10px] font-bold uppercase">Self-Collection</span>
              <p className="font-bold text-zinc-800 mt-0.5">{seller.selfCollectionAvailable ? 'Available at Doorstep' : 'Delivery Only'}</p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-400 text-[10px] font-bold uppercase">{seller.website ? 'Website & IG' : 'Instagram'}</span>
              <div className="flex flex-col gap-1 mt-0.5">
                {seller.website && (
                  <a
                    href={seller.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-zinc-900 hover:text-zinc-700 underline flex items-center gap-1 truncate text-xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{seller.website.replace('https://', '').replace('http://', '')}</span>
                  </a>
                )}
                <a
                  href={`https://instagram.com/${seller.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-zinc-500 hover:underline flex items-center gap-1 truncate text-[11px]"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@{seller.instagram}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div ref={tabsRef} className="px-6 border-t border-zinc-200 bg-zinc-50 flex items-center gap-4 overflow-x-auto no-scrollbar scroll-mt-6">
          <button
            id="seller-tab-catalogue"
            onClick={() => setActiveTab('catalogue')}
            className={`py-3.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalogue'
                ? 'border-zinc-900 text-zinc-950 font-black'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Kitchen Menu & Dishes ({sellerProducts.length})</span>
          </button>

          <button
            id="seller-tab-reviews"
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-zinc-900 text-zinc-950 font-black'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Customer Reviews ({sellerReviews.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* 1. Catalogue / Menu Tab */}
        {activeTab === 'catalogue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 font-display">
                  Handcrafted Creations & Dishes
                </h3>
                <p className="text-xs text-zinc-500">
                  Pre-order freshly prepared dishes direct from {seller.name} in {seller.neighborhood}.
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-500">
                {sellerProducts.length} Items Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sellerProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-zinc-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {prod.isSignature && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-zinc-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                        Signature Item
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white font-extrabold text-xs px-2.5 py-1 rounded-full">
                      S${prod.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 font-display">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {prod.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const matchingDrop = {
                          id: `item_${prod.id}`,
                          sellerId: seller.id,
                          productId: prod.id,
                          title: prod.name,
                          tagline: prod.unitLabel,
                          description: prod.description,
                          price: prod.price,
                          image: prod.image,
                          totalBatch: 20,
                          remainingBatch: 20,
                          openingTime: new Date().toISOString(),
                          closingTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
                          fulfillmentDate: 'Prepared Fresh Upon Order',
                          status: 'live' as const,
                          neighborhood: seller.neighborhood,
                          deliveryAvailable: true,
                          selfCollectionAvailable: seller.selfCollectionAvailable,
                          dietaryTags: prod.dietaryTags,
                          flavorNotes: [],
                        };
                        addToCart(matchingDrop, 1);
                      }}
                      className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add to Shopping Bag (S${prod.price.toFixed(2)})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            
            {/* Reviews Summary & Rating Distribution Header */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Score Big Display */}
                <div className="flex flex-col items-center justify-center text-center p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70">
                  <span className="text-4xl sm:text-5xl font-black text-zinc-900 font-display">
                    {averageRating}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 my-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600 font-semibold">
                    Based on {sellerReviews.length} community reviews
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>100% Verified Singapore Orders</span>
                  </div>
                </div>

                {/* Rating Bars Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = starCounts[stars as 1 | 2 | 3 | 4 | 5] || 0;
                    const percent = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                    return (
                      <button
                        key={stars}
                        onClick={() => setSelectedStarFilter(selectedStarFilter === stars ? 'all' : stars)}
                        className={`w-full flex items-center gap-2 text-xs text-left p-1 rounded-lg transition cursor-pointer ${
                          selectedStarFilter === stars ? 'bg-amber-100/70 font-bold' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <span className="w-12 flex items-center gap-1 text-zinc-700 font-semibold text-[11px]">
                          <span>{stars}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[11px] text-zinc-500 font-medium">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Hygiene & Quality Assurance Badge */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>SGHomeEats Quality Trust</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    All reviews are submitted by verified Singapore customers who ordered from {seller.name}. Taste notes, portion sizing, and delivery thermal bag checks are verified.
                  </p>
                </div>
              </div>

              {/* Filter chips & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 mt-5 border-t border-zinc-100">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setSelectedStarFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      selectedStarFilter === 'all'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    All Reviews ({sellerReviews.length})
                  </button>
                  {[5, 4, 3].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedStarFilter(star)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        selectedStarFilter === star
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{star} Stars ({starCounts[star as 1 | 2 | 3 | 4 | 5] || 0})</span>
                    </button>
                  ))}
                </div>

                {/* Search in reviews */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-800"
                  />
                  {reviewSearchQuery && (
                    <button
                      onClick={() => setReviewSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Reviews Grid: Reviews List (2 cols) + Leave a Review Form (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Customer Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-zinc-900 font-display">
                    Customer Reviews ({filteredReviews.length})
                  </h3>
                  {selectedStarFilter !== 'all' && (
                    <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
                      Filtering {selectedStarFilter} Stars only
                    </span>
                  )}
                </div>

                {filteredReviews.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-zinc-200 text-zinc-500 text-xs space-y-2">
                    <p className="font-semibold text-zinc-700">No reviews found matching your filter.</p>
                    <p className="text-zinc-400">Try clearing your search query or selecting "All Reviews".</p>
                    <button
                      onClick={() => {
                        setSelectedStarFilter('all');
                        setReviewSearchQuery('');
                      }}
                      className="mt-2 px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredReviews.map((rev) => {
                      const isVoted = userVotedHelpful.includes(rev.id);
                      const helpfulCount = (helpfulReviews[rev.id] || 0) + 3; // Baseline realistic helpful count

                      return (
                        <div
                          key={rev.id}
                          className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 transition hover:border-zinc-300"
                        >
                          {/* Review Header: User avatar initials, name, verified tag, stars, date */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center border border-amber-200">
                                {rev.customerName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-xs text-zinc-900">
                                    {rev.customerName}
                                  </span>
                                  {rev.verifiedBuyer && (
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                                      <span>Verified Buyer</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-zinc-400 font-medium">
                                  {rev.date}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < rev.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-zinc-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Ordered Dish tag */}
                          <div className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 rounded-xl text-[11px] text-zinc-700">
                            <Utensils className="w-3 h-3 text-amber-600" />
                            <span>Ordered: <strong className="text-zinc-900">{rev.dishName}</strong></span>
                          </div>

                          {/* Review Text */}
                          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                            "{rev.comment}"
                          </p>

                          {/* Helpful button action */}
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                            <span className="text-[10px] text-zinc-400">Singapore Heartland Community Review</span>
                            
                            <button
                              onClick={() => handleToggleHelpful(rev.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                isVoted
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200'
                              }`}
                            >
                              <ThumbsUp className={`w-3 h-3 ${isVoted ? 'fill-amber-600 text-amber-600' : ''}`} />
                              <span>Helpful ({helpfulCount})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Col: Interactive Leave a Review Form */}
              <div className="space-y-4">
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4 sticky top-6">
                  <div className="flex items-center gap-2 text-zinc-900 border-b border-zinc-100 pb-3">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <div>
                      <h4 className="font-bold text-sm">Write a Customer Review</h4>
                      <p className="text-[10.5px] text-zinc-400">Share your tasting experience</p>
                    </div>
                  </div>

                  {reviewSubmittedToast && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Thank you! Your verified review has been published.</span>
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1.5">
                        Your Overall Rating
                      </label>
                      <div className="flex items-center gap-1.5 p-2 bg-amber-50/60 rounded-2xl border border-amber-200/60 justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="p-1 transition hover:scale-125 cursor-pointer"
                              title={`${star} Stars`}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= newRating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-zinc-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-black text-amber-900 mr-1">
                          {newRating === 5 ? '5.0 ⭐ Sedap!' : `${newRating}.0 ⭐`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Dish / Item Ordered
                      </label>
                      <select
                        value={newDishName}
                        onChange={(e) => setNewDishName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 bg-white"
                      >
                        <option value="">Select dish or type custom...</option>
                        {sellerProducts.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} (S${p.price.toFixed(2)})
                          </option>
                        ))}
                      </select>
                      {!newDishName && (
                        <input
                          type="text"
                          placeholder="Or type custom item name..."
                          value={newDishName}
                          onChange={(e) => setNewDishName(e.target.value)}
                          className="w-full mt-1.5 px-3 py-1.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Review & Feedback
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell others about the taste, textures, portion size, and packaging..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Publish Customer Review</span>
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
};
