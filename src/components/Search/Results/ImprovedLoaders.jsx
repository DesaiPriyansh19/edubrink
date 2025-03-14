// Option 1: Pulse Dots Loader
export function PulseDotsLoader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="pulse-dots-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  )
}

// Option 2: Gradient Spinner
export function GradientSpinnerLoader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="gradient-spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  )
}

// Option 3: Bouncing Bars
export function BouncingBarsLoader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="bouncing-bars-loader">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  )
}

// Option 4: Circular Progress
export function CircularProgressLoader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="circular-progress-loader">
        <svg className="circular" viewBox="25 25 50 50">
          <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10" />
        </svg>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  )
}

// Full page version of any loader
export function FullPageLoader({ type = "gradient", message = "Loading content..." }) {
  const LoaderComponent =
    type === "pulse"
      ? PulseDotsLoader
      : type === "bars"
        ? BouncingBarsLoader
        : type === "circular"
          ? CircularProgressLoader
          : GradientSpinnerLoader

  return (
    <div className="fullpage-loader-overlay">
      <LoaderComponent message={message} />
    </div>
  )
}

// Default export - you can choose which one to use as default
export default GradientSpinnerLoader

