"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 에러 발생 시 렌더. reset()은 내부 상태 초기화 + onReset 호출. */
  fallback: (props: { error: Error; reset: () => void }) => ReactNode;
  /** 외부 캐시 리셋 등(예: QueryErrorResetBoundary reset). */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error !== null) {
      return this.props.fallback({ error, reset: this.reset });
    }
    return this.props.children;
  }
}
