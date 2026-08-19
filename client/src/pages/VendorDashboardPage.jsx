import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVendors } from '../context/VendorContext';
import { useOrders } from '../context/OrderContext';
import {
  Star, Utensils, Store, ChevronRight, Plus, Edit2, Trash2,
  ToggleLeft, ToggleRight, X, Check, MapPin, Clock, FileText,
  Phone, Image as ImageIcon, Save
} from 'lucide-react';

export const VendorDashboardPage = () => {
  const { user, showToast } = useAuth();
  const { vendors, getVendorById, toggleVendorOpen, updateVendorDetails, getMenuItemsByVendor, fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } = useVendors();
  const { getOrdersForVendor, updateOrderStatus, fetchOrders } = useOrders();

  const vendorId = user?.vendorId || vendors[0]?.id;
  const currentVendor = getVendorById(vendorId) || vendors[0];

  React.useEffect(() => {
    if (currentVendor?.id) {
      fetchMenuItems(currentVendor.id);
      fetchOrders('', currentVendor.id);
    }
  }, [currentVendor?.id]);

  const vendorMenuItems = currentVendor ? getMenuItemsByVendor(currentVendor.id) : [];
  const vendorOrders    = currentVendor ? getOrdersForVendor(currentVendor.id) : [];

  const [activeSubTab, setActiveSubTab] = useState('overview');

  // ── Menu Item Modal ──
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem,   setEditingItem]   = useState(null);
  const [itemName,      setItemName]      = useState('');
  const [itemPrice,     setItemPrice]     = useState('');
  const [itemCategory,  setItemCategory]  = useState('Chaat');
  const [itemIsVeg,     setItemIsVeg]     = useState(true);
  const [itemImage,     setItemImage]     = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2MB'); return; }
    setImageUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => { setItemImage(reader.result); setImageUploading(false); };
    reader.readAsDataURL(file);
  };

  // ── Business Profile form ──
  const [bpName,        setBpName]        = useState(currentVendor?.name || '');
  const [bpCategory,    setBpCategory]    = useState(currentVendor?.category || '');
  const [bpDescription, setBpDescription] = useState(currentVendor?.description || '');
  const [bpAddress,     setBpAddress]     = useState(currentVendor?.address || '');
  const [bpPhone,       setBpPhone]       = useState(currentVendor?.phone || '');
  const [bpOpenTime,    setBpOpenTime]    = useState(currentVendor?.openTime || '08:00');
  const [bpCloseTime,   setBpCloseTime]   = useState(currentVendor?.closeTime || '22:00');
  const [bpBannerUrl,   setBpBannerUrl]   = useState(currentVendor?.banner || '');
  const [bpSaving,      setBpSaving]      = useState(false);
  const [bpPhotoUploading, setBpPhotoUploading] = useState(false);

  const handleStallPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { showToast('Photo must be under 3MB'); return; }
    setBpPhotoUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => { setBpBannerUrl(reader.result); setBpPhotoUploading(false); };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingItem(null); setItemName(''); setItemPrice('');
    setItemCategory('Chaat'); setItemIsVeg(true); setItemImage('');
    setIsAddEditModalOpen(true);
  };
  const handleOpenEdit = (item) => {
    setEditingItem(item); setItemName(item.name); setItemPrice(item.price);
    setItemCategory(item.category); setItemIsVeg(item.isVeg); setItemImage(item.image || '');
    setIsAddEditModalOpen(true);
  };
  const handleSaveItem = (e) => {
    e.preventDefault();
    const data = { name: itemName, price: parseFloat(itemPrice), category: itemCategory, isVeg: itemIsVeg, image: itemImage };
    if (editingItem) {
      updateMenuItem(currentVendor.id, editingItem.id, data);
      showToast('Menu item updated!');
    } else {
      addMenuItem(currentVendor.id, data);
      showToast('Menu item added!');
    }
    setIsAddEditModalOpen(false);
  };

  const handleSaveBusinessProfile = async (e) => {
    e.preventDefault();
    setBpSaving(true);
    try {
      await updateVendorDetails(currentVendor.id, {
        name: bpName, category: bpCategory, description: bpDescription,
        address: bpAddress, phone: bpPhone,
        openTime: bpOpenTime, closeTime: bpCloseTime, banner: bpBannerUrl,
      });
      showToast('Business profile updated! ✅');
    } catch {
      showToast('Failed to save. Try again.');
    } finally {
      setBpSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-slate-900 to-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center space-x-2">
            <span>Hello, {user?.name || currentVendor?.name || 'Vendor'}</span>
            <span>👋</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400">Here's your real-time stall overview</p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 shrink-0">
          {[['120', 'Total Views'], ['85', 'Total Reviews'], ['4.6 ★', 'Avg Rating']].map(([val, label], i) => (
            <div key={i} className="bg-[#1E293B] px-4 py-3 rounded-2xl text-center border border-slate-700/60">
              <span className={`text-lg md:text-2xl font-black block ${i === 2 ? 'text-emerald-400' : 'text-white'}`}>{val}</span>
              <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-[#1E293B] p-1.5 rounded-2xl border border-slate-800/80 max-w-lg overflow-x-auto scroll-hide">
        {[
          { id: 'overview',         label: 'Overview' },
          { id: 'menu-manage',      label: `Menu Items (${vendorMenuItems.length})` },
          { id: 'orders',           label: `Orders (${vendorOrders.length})` },
          { id: 'business-profile', label: 'Business Profile' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-shrink-0 flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Stall Status */}
          <div className="bg-[#1E293B] rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Stall Status</h3>
              <p className="text-xs text-slate-400">
                {currentVendor?.isOpen ? 'Currently accepting live orders' : 'Closed for new orders'}
              </p>
            </div>
            <button
              onClick={() => toggleVendorOpen(currentVendor.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentVendor?.isOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {currentVendor?.isOpen ? 'ONLINE (OPEN)' : 'OFFLINE (CLOSED)'}
            </button>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div onClick={() => setActiveSubTab('menu-manage')} className="bg-[#1E293B] rounded-2xl p-5 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Menu Management</h4>
                  <p className="text-xs text-slate-400">Add, edit or toggle food items</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
            </div>

            <div onClick={() => setActiveSubTab('business-profile')} className="bg-[#1E293B] rounded-2xl p-5 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-orange-500/50 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">Business Profile</h4>
                  <p className="text-xs text-slate-400">Update stall name &amp; location</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400" />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: MENU MANAGEMENT ── */}
      {activeSubTab === 'menu-manage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manage Menu Items</h3>
            <button onClick={handleOpenAdd} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center space-x-1 shadow-lg">
              <Plus className="w-4 h-4" /><span>Add Item</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendorMenuItems.map((item) => (
              <div key={item.id} className="bg-[#1E293B] rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Dish Photo */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={item.isVeg !== false ? 'veg-indicator' : 'nonveg-indicator'} />
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    </div>
                    <p className="text-xs font-bold text-emerald-400">₹{item.price}</p>
                    <p className="text-[10px] text-slate-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {/* Availability Toggle with label */}
                  <button
                    onClick={() => toggleMenuItemAvailability(currentVendor.id, item.id)}
                    title="Toggle availability"
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                      item.isAvailable !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-slate-700/50 text-slate-500 border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {item.isAvailable !== false
                      ? <><ToggleRight className="w-3.5 h-3.5" /><span>Available</span></>
                      : <><ToggleLeft className="w-3.5 h-3.5" /><span>Sold Out</span></>
                    }
                  </button>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-700/50 transition-all" title="Edit item"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteMenuItem(currentVendor.id, item.id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700/50 transition-all" title="Delete item"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ORDERS ── */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Live Orders</h3>
          {vendorOrders.length === 0 ? (
            <div className="bg-[#1E293B] rounded-2xl p-8 text-center border border-slate-800 text-xs text-slate-400 max-w-md">No orders active for your stall.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendorOrders.map((ord) => (
                <div key={ord.id || ord._id} className="bg-[#1E293B] rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-xs font-bold text-white">{ord.id || ord._id}</span>
                    <span className="text-sm font-bold text-emerald-400">₹{ord.totalAmount}</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-200">Customer: {ord.customerName}</p>
                    <p className="text-slate-400">Items: {ord.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 px-2.5 py-1 rounded-full border border-orange-500/30">
                      {ord.orderStatus || 'Pending'}
                    </span>
                    {ord.orderStatus === 'Pending' && (
                      <button onClick={() => updateOrderStatus(ord.id || ord._id, 'Preparing')} className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-emerald-700">
                        Accept &amp; Prepare
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: BUSINESS PROFILE ── */}
      {activeSubTab === 'business-profile' && (
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Business Profile</h3>
              <p className="text-xs text-slate-400">Update your stall details visible to customers</p>
            </div>
          </div>

          <form onSubmit={handleSaveBusinessProfile} className="space-y-5">

            {/* Stall Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Store className="w-3.5 h-3.5 text-slate-400" /><span>Stall Name</span>
              </label>
              <input
                type="text" required value={bpName} onChange={e => setBpName(e.target.value)}
                placeholder="e.g. Dahisar Famous Vada Pav"
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /><span>Food Category</span>
              </label>
              <select
                value={bpCategory} onChange={e => setBpCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all"
              >
                {['Vada Pav','Dosa & South Indian','Chaat','Biryani','Momos','Fast Food','Juice & Beverages','Chai & Snacks','Sandwich','Frankie','Pani Puri'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /><span>Description</span>
              </label>
              <textarea
                rows={3} value={bpDescription} onChange={e => setBpDescription(e.target.value)}
                placeholder="Tell customers what makes your stall special..."
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /><span>Stall Address / Location</span>
              </label>
              <input
                type="text" value={bpAddress} onChange={e => setBpAddress(e.target.value)}
                placeholder="e.g. Near Dahisar Station, Gate No. 2, Mumbai"
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /><span>Contact Number</span>
              </label>
              <input
                type="tel" value={bpPhone} onChange={e => setBpPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Opening Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /><span>Opening Hours</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Opens At</span>
                  <input
                    type="time" value={bpOpenTime} onChange={e => setBpOpenTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Closes At</span>
                  <input
                    type="time" value={bpCloseTime} onChange={e => setBpCloseTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Stall Photo Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" /><span>Stall / Banner Photo</span>
              </label>

              {bpBannerUrl ? (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-700 group">
                  <img
                    src={bpBannerUrl}
                    alt="Stall banner preview"
                    className="w-full h-full object-cover"
                    onError={e => e.target.style.display='none'}
                  />
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-3">
                    <label className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-emerald-700 transition-all">
                      <input type="file" accept="image/*" className="hidden" onChange={handleStallPhotoUpload} />
                      Change Photo
                    </label>
                    <button
                      type="button"
                      onClick={() => setBpBannerUrl('')}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-3 text-[10px] text-white/70 font-semibold">Hover to change</div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500 cursor-pointer transition-all bg-[#0F172A] group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleStallPhotoUpload} />
                  {bpPhotoUploading ? (
                    <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 group-hover:border-emerald-500/50 transition-all">
                        <ImageIcon className="w-7 h-7 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">Upload Stall Photo</span>
                      <span className="text-[11px] text-slate-600 mt-1">JPG, PNG, WebP — max 3MB</span>
                      <span className="text-[10px] text-slate-600 mt-0.5">This photo appears on your public stall page</span>
                    </>
                  )}
                </label>
              )}
            </div>

            {/* Save Button */}
            <button
              type="submit" disabled={bpSaving}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              {bpSaving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
              ) : (
                <><Save className="w-4 h-4" /><span>Save Business Profile</span></>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── Add/Edit Menu Item Modal ── */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-800 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveItem} className="space-y-3">

              {/* Dish Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Dish Photo</label>
                <div className="relative">
                  {itemImage ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-700 group">
                      <img src={itemImage} alt="Dish preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setItemImage('')}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-600 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500 cursor-pointer transition-all bg-[#1E293B] group">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      {imageUploading ? (
                        <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-emerald-400 mb-1.5 transition-colors" />
                          <span className="text-[11px] text-slate-500 group-hover:text-emerald-400 font-semibold transition-colors">Click to upload photo</span>
                          <span className="text-[10px] text-slate-600 mt-0.5">JPG, PNG — max 2MB</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Item Name</label>
                <input type="text" required placeholder="e.g. Special Vada Pav" value={itemName} onChange={e => setItemName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Price (₹)</label>
                <input type="number" required placeholder="e.g. 25" value={itemPrice} onChange={e => setItemPrice(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                <select value={itemCategory} onChange={e => setItemCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white focus:outline-none focus:border-emerald-500">
                  {['Chaat','South Indian','Beverages','Snacks','Fast Food','Biryani'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="vegCheck" checked={itemIsVeg} onChange={e => setItemIsVeg(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded border-slate-600 bg-[#1E293B]" />
                <label htmlFor="vegCheck" className="text-xs font-bold text-slate-300">Vegetarian Item</label>
              </div>
              <div className="flex items-center space-x-2 pt-3">
                <button type="button" onClick={() => setIsAddEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E293B] text-slate-400 text-xs font-bold border border-slate-700">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-lg">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
