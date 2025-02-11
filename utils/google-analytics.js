import ReactGA from "react-ga4";

const TRACKING_ID = import.meta.env.VITE_MEASUREMENT_ID; // Replace with your Measurement ID
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (path) => {
    console.log("Tracking GA4 Page:", path); // Debugging log
    ReactGA.send({ hitType: "pageview", page: path });
  };