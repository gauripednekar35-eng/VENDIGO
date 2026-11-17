// Admin Gmail addresses — anyone who signs in with Google using these emails
// will automatically get the ADMIN role.
// Add more emails to the array if needed.

export const ADMIN_EMAILS = [
  'gauripednekar35@gmail.com',
];

// Vendor Gmail addresses — these get the VENDOR role automatically.
export const VENDOR_EMAILS = [];

/**
 * Returns the role for a given Gmail address.
 * Falls back to 'customer' for everyone else.
 */
export function getRoleForEmail(email) {
  if (!email) return 'customer';
  const lower = email.toLowerCase().trim();
  if (ADMIN_EMAILS.map(e => e.toLowerCase()).includes(lower)) return 'admin';
  if (VENDOR_EMAILS.map(e => e.toLowerCase()).includes(lower)) return 'vendor';
  return 'customer';
}
