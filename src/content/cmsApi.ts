const configuredApiUrl = (import.meta.env.VITE_CMS_API_URL ?? "").trim();

export const cmsApiBase = (() => {
  if (!configuredApiUrl) return "";

  const configuredUrl = new URL(configuredApiUrl, window.location.origin);
  const isLoopback = ["localhost", "127.0.0.1", "::1"].includes(configuredUrl.hostname);

  if (import.meta.env.DEV && isLoopback) {
    return `${configuredUrl.pathname.replace(/\/+$/, "")}${configuredUrl.search}`;
  }

  return configuredUrl.href.replace(/\/+$/, "");
})();
