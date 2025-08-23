import React from "react";
import PortfolioApp from "./PortfolioApp.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[App ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
          <h2>Something went wrong.</h2>
          <p>Please check the browser console for details. Try a hard refresh (Ctrl/Cmd+Shift+R).</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioApp />
    </ErrorBoundary>
  );
}
