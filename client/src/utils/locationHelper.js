export const matchVendorLocation = (vendor, selectedLocation) => {
  if (!selectedLocation || selectedLocation === 'all') return true;

  const locId = (vendor.locationId || '').toLowerCase();
  const address = (vendor.address || '').toLowerCase();
  const locality = (vendor.locality || '').toLowerCase();
  const target = selectedLocation.toLowerCase();

  const isBlrTarget = ['indiranagar', 'koramangala', 'vvpuram', 'hsr', 'mgroad', 'bangalore'].some(k => target.includes(k));
  const isMumTarget = ['dahisar', 'borivali', 'bandra', 'andheri', 'mumbai', 'colaba', 'dadar', 'ghatkopar', 'thane'].some(k => target.includes(k));

  // 1. Direct locationId or name or address match
  if (locId === target || locality.includes(target) || address.includes(target)) {
    return true;
  }

  // 2. Specific area checks
  if (target === 'indiranagar' && (locality.includes('indiranagar') || address.includes('indiranagar'))) return true;
  if (target === 'koramangala' && (locality.includes('koramangala') || address.includes('koramangala'))) return true;
  if (target === 'vvpuram' && (locality.includes('vv puram') || locality.includes('jayanagar') || address.includes('vv puram') || address.includes('jayanagar'))) return true;
  if (target === 'hsr' && (locality.includes('hsr') || address.includes('hsr'))) return true;
  if (target === 'mgroad' && (locality.includes('mg road') || locality.includes('commercial') || address.includes('mg road') || address.includes('brigade'))) return true;

  if (target.includes('dahisar') && (locality.includes('dahisar') || address.includes('dahisar'))) return true;
  if (target.includes('borivali') && (locality.includes('borivali') || address.includes('borivali'))) return true;
  if (target.includes('bandra') && (locality.includes('bandra') || address.includes('bandra'))) return true;
  if (target.includes('andheri') && (locality.includes('andheri') || address.includes('andheri'))) return true;

  // 3. Broad City-level fallback so stalls are NEVER empty
  const isVendorBlr = address.includes('bangalore') || address.includes('bengaluru') || locality.includes('bangalore') || (vendor.coordinates && vendor.coordinates[0] < 15);
  const isVendorMum = address.includes('mumbai') || locality.includes('mumbai') || (vendor.coordinates && vendor.coordinates[0] > 15);

  if (isBlrTarget && isVendorBlr) return true;
  if (isMumTarget && isVendorMum) return true;

  // 4. Default fallback for newly registered vendors without location tags
  if (!locId && !locality && !address) return true;

  return false;
};

export const getCityCoordinates = (selectedLocation) => {
  const target = (selectedLocation || '').toLowerCase();

  if (target === 'indiranagar') return [12.9716, 77.6412];
  if (target === 'koramangala') return [12.9352, 77.6245];
  if (target === 'vvpuram')     return [12.9430, 77.5770];
  if (target === 'hsr')         return [12.9121, 77.6445];
  if (target === 'mgroad')      return [12.9756, 77.6066];
  if (target.includes('dahisar')) return [19.2505, 72.8585];
  if (target.includes('borivali')) return [19.2310, 72.8555];
  if (target.includes('bandra'))  return [19.0596, 72.8295];
  if (target.includes('andheri')) return [19.1370, 72.8280];

  return [12.9716, 77.5946];
};
