import ReactGA from "react-ga";

const TRACKING_ID = import.meta.env.VITE_MEASUREMENT_ID;
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (path) => {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};
