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

loadEngage();
export { engage };