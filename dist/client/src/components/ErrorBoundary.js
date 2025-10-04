import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Something went wrong." }), _jsx("p", { children: "Please refresh the page or try again later." }), _jsx("button", { onClick: () => window.location.reload(), children: "Refresh Page" })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
