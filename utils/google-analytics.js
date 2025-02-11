import ReactGA from "react-ga";

const TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your Measurement ID
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (path) => {
  console.log("Tracking page view:", path); // Debugging log
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};
