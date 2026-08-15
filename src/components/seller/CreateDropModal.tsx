import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MAIN_CATEGORIES, FOOD_STATUS_CONFIG } from '../../data/categoriesAndLocations';
import { MainCategory, FoodStatus } from '../../types';
import {
  X,
  Flame,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  DollarSign,
  Image,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Utensils
} from 'lucide-react';

export const CreateDropModal: React.FC = () => {
  const {
    isCreateDropModalOpen,
    setIsCreateDropModalOpen,
    createFlashDrop,
    products,
    sellers,
  } = useApp();

  const seller = sellers[0]; // The Flourist or active seller
  const sellerProducts = products.filter((p) => p.sellerId === seller.id);

  const [formData, setFormData] = useState({
    productId: sellerProducts[0]?.id || 'prod_flourist_sourdough',
    title: 'Weekend Secret Sourdough Babka Batch',
    tagline: 'Valrhona dark chocolate and toasted hazelnut swirls',
    description: 'Slow 36-hour wild starter dough rolled with Belgian butter, pure Valrhona Guanaja 70% chocolate ganache, and roasted crunchy hazelnuts.',
    price: 18.50,
    originalPrice: 22.00,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    totalBatch: 16,
    fulfillmentDate: 'Saturday, Delivery 2:00 PM - 5:00 PM',
    isVipEarlyAccess: true,
    vipEarlyWindowMinutes: 30,
    flavorNotes: 'Valrhona Guanaja, Roasted Hazelnut, Caramelized Butter',
    mainCategory: '🍰 Bakes & Desserts' as MainCategory,
    subCategory: 'Sourdough',
    foodStatus: 'muslim_owned' as FoodStatus,
  });

  if (!isCreateDropModalOpen) return null;

  const currentCategoryObj = MAIN_CATEGORIES.find((c) => c.name === formData.mainCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createFlashDrop({
      sellerId: seller.id,
      productId: formData.productId,
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      image: formData.image,
      totalBatch: Number(formData.totalBatch),
      openingTime: new Date().toISOString(),
      closingTime: new Date(Date.now() + 1000 * 60 * 180).toISOString(), // 3 hours window
      fulfillmentDate: formData.fulfillmentDate,
      isVipEarlyAccess: formData.isVipEarlyAccess,
      vipEarlyWindowMinutes: formData.vipEarlyWindowMinutes,
      neighborhood: seller.neighborhood,
      deliveryAvailable: true,
      selfCollectionAvailable: true,
      dietaryTags: ['Organic Flour', 'Small Batch', 'Freshly Baked'],
      flavorNotes: formData.flavorNotes.split(',').map((s) => s.trim()).filter(Boolean),
      mainCategory: formData.mainCategory,
      subCategory: formData.subCategory,
      foodStatus: formData.foodStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        id="create-drop-modal-container"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
              🔥
            </div>
            <div>
              <h3 className="font-bold text-base font-display">Schedule & Launch Secret Batch Drop</h3>
              <p className="text-[11px] text-zinc-400">
                Instantly notifies Singapore foodies and sets limited pre-order slots
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateDropModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[calc(85vh-160px)] overflow-y-auto">
          
          {/* Drop Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Drop Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                placeholder="e.g. Suji Pandan Chiffon Morning Drop"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Hook / Tagline (1 sentence) *
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                placeholder="e.g. Fresh cold-pressed organic pandan extract with creamy santan"
              />
            </div>
          </div>

          {/* Core Classification: Main Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Main Category *
              </label>
              <select
                value={formData.mainCategory}
                onChange={(e) => {
                  const newCat = e.target.value as MainCategory;
                  const catObj = MAIN_CATEGORIES.find((c) => c.name === newCat);
                  setFormData({
                    ...formData,
                    mainCategory: newCat,
                    subCategory: catObj ? catObj.subcategories[0] : '',
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none"
              >
                {MAIN_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Subcategory *
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none"
              >
                {currentCategoryObj?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Food Status Selection (Halal / Muslim-Owned / No Pork No Lard / Non-Halal) */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <label className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">
                Food & Halal Status Integrity *
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(
                [
                  'halal_certified',
                  'muslim_owned',
                  'no_pork_no_lard',
                  'non_halal',
                  'not_specified',
                ] as FoodStatus[]
              ).map((st) => {
                const cfg = FOOD_STATUS_CONFIG[st];
                const isSelected = formData.foodStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormData({ ...formData, foodStatus: st })}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? `${cfg.badgeBg} ${cfg.badgeBorder} ring-2 ring-zinc-900/10 font-bold shadow-2xs`
                        : 'bg-white hover:bg-zinc-100/80 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.badgeDot}`}></span>
                    <span className="truncate">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Batch Size */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                Drop Price (S$) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                Original Price (S$)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                Total Batch Boxes *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={formData.totalBatch}
                onChange={(e) => setFormData({ ...formData, totalBatch: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-amber-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Fulfillment Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Delivery / Pickup Date & Window *
              </label>
              <input
                type="text"
                required
                value={formData.fulfillmentDate}
                onChange={(e) => setFormData({ ...formData, fulfillmentDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                placeholder="e.g. Saturday, 2:00 PM - 5:00 PM"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Key Flavor Notes (Comma separated)
              </label>
              <input
                type="text"
                value={formData.flavorNotes}
                onChange={(e) => setFormData({ ...formData, flavorNotes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                placeholder="e.g. Valrhona Dark Choc, Pistachio Lava, Maldon Salt"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Drop Photo URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Batch Description & Story *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
            />
          </div>

          {/* VIP Pass Early Access Perk Toggle */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Enable VIP Early Drop Window (30 mins)</p>
                <p className="text-[11px] text-zinc-400">Allows VIP subscribers early access before opening to the public</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isVipEarlyAccess}
              onChange={(e) => setFormData({ ...formData, isVipEarlyAccess: e.target.checked })}
              className="rounded w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Launch Live Batch Drop Now</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
