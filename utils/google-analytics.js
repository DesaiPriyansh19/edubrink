import ReactGA from "react-ga4";

// const TRACKING_ID = import.meta.env.VITE_MEASUREMENT_ID;
const TRACKING_ID = "G-ZHSLDD53DK";

ReactGA.initialize(TRACKING_ID);

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
