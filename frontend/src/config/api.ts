const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// Strip trailing slash and trailing /api to ensure consistency with fetch(`${API_URL}/api/...`)
export const API_URL = rawUrl.replace(/\/$/, '').replace(/\/api$/, '');
