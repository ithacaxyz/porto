import * as React from 'react'
import * as Errors from '~/lib/DialogErrors'
import { ErrorScreen } from '~/routes/-components/ErrorScreen'

export class ErrorBoundary extends React.Component<
  ErrorBoundary.Props,
  ErrorBoundary.State
> {
  static getDerivedStateFromError(error: Error): ErrorBoundary.State {
    return {
      dialogError: Errors.createRuntimeError(error),
    }
  }
  state = {
    dialogError: null,
  }
  render() {
    const { dialogError } = this.state
    if (!dialogError) return this.props.children
    return <ErrorScreen dialogError={dialogError} />
  }
}

export declare namespace ErrorBoundary {
  type Props = {
    children: React.ReactNode
  }
  type State = {
    dialogError: Errors.DialogError | null
  }
}
