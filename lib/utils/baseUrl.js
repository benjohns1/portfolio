export const getBaseUrl = () => {
  const confUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_MAIN_DOMAIN || process.env.VERCEL_URL;
  return confUrl ? `https://${confUrl}` : (process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:3000");
}
