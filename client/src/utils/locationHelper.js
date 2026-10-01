export const matchVendorLocation = (vendor, selectedLocation) => {
  if (!selectedLocation || selectedLocation === 'all') return true;

  const target = (selectedLocation || '').toLowerCase().trim();
  const locId = (vendor.locationId || '').toLowerCase().trim();
  const address = (vendor.address || '').toLowerCase();
  const locality = (vendor.locality || '').toLowerCase();

  // If user selected "All Mumbai" or "mumbai"
  if (target === 'all-mumbai' || target === 'mumbai') {
    return address.includes('mumbai') || locality.includes('mumbai') || locId.includes('dahisar') || locId.includes('borivali') || locId.includes('kandivali') || locId.includes('malad') || locId.includes('andheri') || locId.includes('bandra') || locId.includes('dadar') || locId.includes('colaba') || locId.includes('ghatkopar') || locId.includes('thane') || (vendor.coordinates && vendor.coordinates[0] > 15);
  }

  // If user selected "All Bangalore" or "bangalore"
  if (target === 'all-bangalore' || target === 'bangalore') {
    return address.includes('bangalore') || address.includes('bengaluru') || locality.includes('bangalore') || locId.includes('indiranagar') || locId.includes('koramangala') || locId.includes('vvpuram') || locId.includes('hsr') || locId.includes('mgroad') || (vendor.coordinates && vendor.coordinates[0] < 15);
  }

  // Exact locationId match (e.g. 'andheri-w' === 'andheri-w')
  if (locId === target) return true;

  // Specific area key extraction helper
  const extractAreaKey = (str) => {
    if (!str) return null;
    if (str.includes('dahisar')) return 'dahisar';
    if (str.includes('borivali')) return 'borivali';
    if (str.includes('kandivali')) return 'kandivali';
    if (str.includes('malad')) return 'malad';
    if (str.includes('andheri')) return 'andheri';
    if (str.includes('bandra')) return 'bandra';
    if (str.includes('dadar')) return 'dadar';
    if (str.includes('colaba') || str.includes('cst')) return 'colaba';
    if (str.includes('ghatkopar')) return 'ghatkopar';
    if (str.includes('thane')) return 'thane';
    if (str.includes('indiranagar')) return 'indiranagar';
    if (str.includes('koramangala')) return 'koramangala';
    if (str.includes('vvpuram') || str.includes('jayanagar')) return 'vvpuram';
    if (str.includes('hsr')) return 'hsr';
    if (str.includes('mgroad') || str.includes('brigade') || str.includes('commercial')) return 'mgroad';
    return null;
  };

  const targetKey = extractAreaKey(target);
  const vendorKey = extractAreaKey(locId) || extractAreaKey(locality) || extractAreaKey(address);

  if (targetKey && vendorKey) {
    return targetKey === vendorKey;
  }

  // Substring check
  if (locality.includes(target) || address.includes(target)) {
    return true;
  }

  return false;
};

export const getCityCoordinates = (selectedLocation) => {
  const target = (selectedLocation || '').toLowerCase().trim();

  if (target.includes('indiranagar')) return [12.9716, 77.6412];
  if (target.includes('koramangala')) return [12.9352, 77.6245];
  if (target.includes('vvpuram'))     return [12.9430, 77.5770];
  if (target.includes('hsr'))         return [12.9121, 77.6445];
  if (target.includes('mgroad'))      return [12.9756, 77.6066];

  if (target.includes('dahisar-e')) return [19.2570, 72.8640];
  if (target.includes('dahisar'))   return [19.2500, 72.8590];
  if (target.includes('borivali'))  return [19.2300, 72.8560];
  if (target.includes('kandivali')) return [19.2070, 72.8350];
  if (target.includes('malad'))     return [19.1860, 72.8480];
  if (target.includes('andheri'))   return [19.1363, 72.8277];
  if (target.includes('bandra'))    return [19.0596, 72.8295];
  if (target.includes('dadar'))     return [19.0269, 72.8397];
  if (target.includes('colaba'))    return [18.9220, 72.8346];
  if (target.includes('ghatkopar')) return [19.0860, 72.9080];
  if (target.includes('thane'))     return [19.2183, 72.9781];

  return [19.0760, 72.8777]; // Default Mumbai center
};
