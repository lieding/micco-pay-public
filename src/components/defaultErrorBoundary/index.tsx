import React from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends React.Component<
  { children: React.ReactElement },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <>
        <h1>Une erreur s'est produite.</h1>
        <Navigate to="/" replace={true} />
      </>
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;