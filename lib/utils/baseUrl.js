export const getBaseUrl = () => {
  const confUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_MAIN_DOMAIN || process.env.VERCEL_URL;
  return confUrl ? `http://${confUrl}` : (process.env.PORT ? `http://localhost:${process.env.PORT}` : "");
}
