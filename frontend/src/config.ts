export const config = {
  // Use relative URL for same-domain deployment, absolute for different domains
  apiUrl: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000'),
};
