import ReactGA from "react-ga4";

const TRACKING_ID = import.meta.env.VITE_MEASUREMENT_ID;
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
