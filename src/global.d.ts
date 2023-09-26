import { PgPaymentMethod } from "./typing"

export interface IPaymentFlowStatus {
  method?: PgPaymentMethod
  status?: 'pending' | 'success' | 'failed'
}

export {}

export interface InitConfiguration {
  paymentOrderID: string
  objectSecret: string
  publicKey: string
  mode: "payment"
  style?: { [key: string]: any }
  paymentMethod?: PgPaymentMethod
  displayAuthentication?: "inline" | "modal"
} 


declare global {
  interface Window {
    initParams: any
    paygreenjs: {
      init(confguration: InitConfiguration): void
      unmount(): void
      Events: Record<string, string>
      attachEventListener(eventName: string, callback: Function): void
      detachEventListener(eventName: string, callback: Function): void
      submitPayment(): void
      status(): {
        flows: IPaymentFlowStatus[]
      }
      setPaymentMethod(method: PgPaymentMethod | null): void
    }
    $resetMenuPosBeforeSlide?: Function | null 
  }
}

// @ts-ignore
window.paygreenjs = window.paygreenjs || {};
