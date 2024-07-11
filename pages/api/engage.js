import { init } from "@sitecore/engage";

let engage;

const loadEngage = async () => {
  engage = await init({
    clientKey: "sndbxus06p9cxhoqoiowkr1sbq5casz3",
    targetURL: "https://api-engage-us.sitecorecloud.io",
    pointOfSale: "Test_CDP_NEXT",
    cookieDomain: "",
    cookieExpiryDays: 365,
    forceServerCookieMode: false,
    includeUTMParameters: true,
    webPersonalization: false /* boolean or object. See Settings object for all options. Default: false */
  });
};

  // Initialize Engage SDK here
  loadEngage();


export const maxDuration = 50; // This function can run for a maximum of 50 seconds

export { engage };