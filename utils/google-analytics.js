import ReactGA from "react-ga4";

const TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your Measurement ID
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (path) => {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};
