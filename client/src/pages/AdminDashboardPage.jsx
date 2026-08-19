import React, { useState } from 'react';
import { useVendors } from '../context/VendorContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_USERS } from '../data/mockData';
import { ShieldCheck, Store, Users, ShoppingBag, CheckCircle, XCircle, Trash2, Check, AlertCircle } from 'lucide-react';

export const AdminDashboardPage = () => {
  const { vendors, approveVendor, deleteVendor } = useVendors();
  const { orders } = useOrders();
  const { showToast } = useAuth();
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [adminTab, setAdminTab] = useState('approvals'); // 'approvals', 'vendors', 'users'

  const pendingVendors = vendors.filter(v => !v.isApproved);
  const approvedVendors = vendors.filter(v => v.isApproved);

  const handleDeleteUser = (userId, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      setUsersList(prev => prev.filter(u => u.id !== userId));
      showToast(`Deleted user "${name}"`, 'info');
    }
  };

  const handleDeleteVendor = (vendorId, name) => {
    if (window.confirm(`Are you sure you want to remove vendor listing "${name}"?`)) {
      deleteVendor(vendorId);
      showToast(`Removed vendor "${name}"`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-emerald-400 font-black text-2xl flex items-center justify-center shrink-0 border border-white/10">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">VENDIGO Governance Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Approve new street food stalls, audit platform users & maintain food sanitation guidelines.</p>
          </div>
        </div>

        <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
          Super Admin Mode Active
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Stall Approvals</span>
          <p className="text-2xl font-black text-amber-600">{pendingVendors.length}</p>
          <p className="text-[10px] text-slate-500">Requires Sanitation Verification</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Vendors</span>
          <p className="text-2xl font-black text-primary">{approvedVendors.length}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">Active on discovery app</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Platform Users</span>
          <p className="text-2xl font-black text-slate-900">{usersList.length}</p>
          <p className="text-[10px] text-slate-500">Customers & Vendors</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Platform Orders</span>
          <p className="text-2xl font-black text-secondary">{orders.length}</p>
          <p className="text-[10px] text-slate-500">Cash on Delivery orders</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAdminTab('approvals')}
          className={`pb-3 text-sm font-extrabold transition-all relative ${
            adminTab === 'approvals' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pending Vendor Approvals</span>
          {pendingVendors.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingVendors.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('vendors')}
          className={`pb-3 text-sm font-extrabold transition-all relative ${
            adminTab === 'vendors' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Approved Vendors ({approvedVendors.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`pb-3 text-sm font-extrabold transition-all relative ${
            adminTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Manage Users ({usersList.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Approvals */}
      {adminTab === 'approvals' && (
        <div className="space-y-4">
          {pendingVendors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">All vendor applications approved!</p>
              <p className="text-xs text-slate-500 mt-1">There are no pending street vendor listings awaiting verification.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4">Vendor Stall Name</th>
                      <th className="px-6 py-4">Owner Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4 text-right">Approval Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {pendingVendors.map(vendor => (
                      <tr key={vendor.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{vendor.name}</td>
                        <td className="px-6 py-4">{vendor.ownerName}</td>
                        <td className="px-6 py-4 capitalize">{vendor.category}</td>
                        <td className="px-6 py-4 text-slate-500">{vendor.address}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              approveVendor(vendor.id);
                              showToast(`Approved street vendor listing for "${vendor.name}"`);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                          >
                            Approve Vendor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Approved Vendors List */}
      {adminTab === 'vendors' && (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Stall Name</th>
                  <th className="px-6 py-4">Owner & Contact</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {approvedVendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{vendor.name}</p>
                      <p className="text-[10px] text-slate-500">{vendor.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{vendor.ownerName}</p>
                      <p className="text-[10px] text-slate-500">{vendor.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700">★ {vendor.rating}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        vendor.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {vendor.isOpen ? 'OPEN' : 'CLOSED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                        title="Delete Vendor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Users List */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4 uppercase font-bold text-slate-500">{u.role}</td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
