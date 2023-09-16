import { IS_DEV } from "../consts";
import { PgPaymentFlowStatus, PgPaymentFlowStatusEnum, PgPaymentMethod } from "../typing";
import { submitErrLog } from './log';

function getLastFlow (log?: boolean) {
  const flows = window.paygreenjs.status()?.flows;
  if (log) console.log(flows);
  const lastFlow = flows?.length ? flows[flows.length - 1] : {};
  return { method: lastFlow?.method, status: lastFlow?.status };
}

export function importResources() {
  // <link href="https://pgjs.paygreen.fr/latest/paygreen.min.css" type="text/css" rel="stylesheet" />
  // <script defer type="text/javascript" src="https://pgjs.paygreen.fr/latest/paygreen.min.js"></script>
  // const link = document.createElement('link');
  // link.href = 'https://pgjs.paygreen.fr/latest/paygreen.min.css';
  // link.type = 'text/css';
  // link.rel = 'stylesheet';
  // document.head.appendChild(link);
  const script = document.createElement("script");
  script.defer = true;
  script.type = "text/javascript";
  script.src = IS_DEV
    ? "https://sb-pgjs.paygreen.fr/latest/paygreen.min.js"
    : "https://pgjs.paygreen.fr/latest/paygreen.min.js";
  document.body.appendChild(script);
}

export function init(
  paymentOrderID: string,
  objectSecret: string,
  publicKey: string,
  paymentMethod: PgPaymentMethod,
  callbacks: {
    onFinished?: () => void;
    onFormFilling?: () => void;
    onError?: (err?: { message: string, reset?: boolean }) => void;
    onSelection?: () => void;
    onSubmit?: () => void;
    setApplePayFailVis?: (visible: boolean) => void
  }
) {
  const paygreenjs = window.paygreenjs;
  if (!paygreenjs) return console.error("'paygreenjs' has not been loaded");

  paygreenjs.attachEventListener(
    paygreenjs.Events.FULL_PAYMENT_DONE,
    (event: any) => {
      console.log("Payment success");
      callbacks.onFinished?.();
    }
  );

  paygreenjs.attachEventListener(
    paygreenjs.Events.REUSABLE_ALLOWED_CHANGE,
    (event: any) => console.log(event.detail.reusable_allowed)
  );

  paygreenjs.attachEventListener(
    paygreenjs.Events.PAYMENT_FLOW_ONCHANGE,
    () => {
      const { method, status } = getLastFlow(true); 
      // if the payment method/platform is "conecs", once payment is done, it would not redirect automatically
      // so we need to detect its payment status update manually, just like below
      if (method === PgPaymentMethod.CONECS) {
        if (status === PgPaymentFlowStatusEnum.SUCCESS)
          callbacks.onFinished?.();
        else if (status === PgPaymentFlowStatusEnum.FAILED)
          callbacks.onError?.({ message: '' });
        else if (status === PgPaymentFlowStatusEnum.PENDING)
          callbacks.onFormFilling?.();
      } else if (method && status === PgPaymentFlowStatusEnum.PENDING) {
        callbacks.onFormFilling?.();
      } else if (!method && status === PgPaymentFlowStatusEnum.PENDING) {
        callbacks.onSelection?.();
      } else {
        console.log("last usable payment flow has no valid 'method' paramter");
      }
    }
  );

  paygreenjs.attachEventListener(paygreenjs.Events.ERROR, (err: any) => {
    console.error("the error happens", err);
    callbacks.onError?.();
  });

  paygreenjs.attachEventListener(
    paygreenjs.Events.TOKEN_FAIL,
    () => {
      console.log('TOKEN_FAIL');
      callbacks.onFormFilling?.();
    }
  )

  paygreenjs.attachEventListener(
    paygreenjs.Events.REQUEST_SUBMIT_TOKENIZE_FORM,
    () => {
      console.log('REQUEST_SUBMIT_TOKENIZE_FORM');
      callbacks.onSubmit?.();
    }
  );

  paygreenjs.attachEventListener(paygreenjs.Events.PAYMENT_FAIL, (ev: CustomEvent) => {
    console.error("payment authorization has been refused", ev);
    const flows = paygreenjs.status()?.flows;
    if (flows?.length) {
      const lastFlow = flows[flows.length - 1];
      submitErrLog({ desc: 'payment authorization has been refused', flow: lastFlow  });
    }
    callbacks.onError?.({ message: "L'autorisation de paiement est refusée. Veuillez réessayer le paiement", reset: true });
  });
  const params = {
    paymentOrderID,
    objectSecret,
    publicKey,
    mode: "payment" as 'payment',
    style,
    displayAuthentication: 'modal' as 'modal',
    paymentMethod,
  };
  if (paymentMethod === PgPaymentMethod.APPLE_PAY) {
    // @ts-ignore
    delete params.paymentMethod;
    applePayExceptionHandler = applePayExceptionHandlerCreator(callbacks.setApplePayFailVis);
    paygreenjs.attachEventListener(
      paygreenjs.Events.PAYMENT_FLOW_ONCHANGE,
      displayOnlyApplePayBtn
    );
  }
  paygreenjs.init(params);
}

const style = {
  input: {
    base: {
      color: "black",
      fontSize: "18px",
    },
    hover: {
      color: "grey",
    },
    focus: {
      color: "grey",
    },
    invalid: {
      color: "red",
    },
    placeholder: {
      base: {
        color: "grey",
      },
    },
  },
  checkbox: {
    label: {
      base: {
        color: "black",
      },
      unchecked: {
        color: "black",
      },
    },
    box: {
      base: {
        color: "#002B5B",
        hover: {
          color: "#424242",
        },
      },
      unchecked: {
        color: "#002B5B",
      },
    },
  },
};

let applePayExceptionHandler: Function | undefined

function applePayExceptionHandlerCreator (setApplePayFailVis: Function | undefined) {
  const ONCHANGE_EV = window.paygreenjs.Events.PAYMENT_FLOW_ONCHANGE;
  function listener4AppleBtn () {
    console.log("listener4AppleBtn");
    window.paygreenjs.detachEventListener(ONCHANGE_EV, listener4AppleBtn);
    const { method, status } = getLastFlow();
    if (!method && status === PgPaymentFlowStatusEnum.PENDING)
      setApplePayFailVis?.(false);
  }
  function listener4Failed () {
    console.log("listener4Failed");
    const { method, status } = getLastFlow();
    if (method === PgPaymentMethod.APPLE_PAY) {
      if (status === PgPaymentFlowStatusEnum.PENDING) return;
      if (status === PgPaymentFlowStatusEnum.FAILED) {
        window.paygreenjs.attachEventListener(ONCHANGE_EV, listener4AppleBtn);
        setApplePayFailVis?.(true);
      }
    }
    window.paygreenjs.detachEventListener(ONCHANGE_EV, listener4Failed);
  }
  return () => window.paygreenjs.attachEventListener(ONCHANGE_EV, listener4Failed);
}

/**
 * it is asked by paygreenjs, when it comes to apple_pay,
 * this detailed info: https://developers.paygreen.fr/docs/apple-pay
 * in this sitution, we must hide other payment method options, and just display our own 
 * apple_pay button
*/
function displayOnlyApplePayBtn () {
  // window.paygreenjs.detachEventListener(
  //   window.paygreenjs.Events.PAYMENT_FLOW_ONCHANGE,
  //   displayOnlyApplePayBtn
  // );
  const paymentMethodEls: NodeListOf<HTMLDivElement> = document.querySelectorAll('.pg-payment-method') ?? [];
  for (const el of paymentMethodEls) {
    if (el.className.includes('apple')) {
      // @ts-ignore
      el.style['-webkit-appearance'] = '-apple-pay-button';
      // @ts-ignore
      el.style['-apple-pay-button-type'] = 'check-out';
      el.onclick = () => {
        applePayExceptionHandler?.();
        window.paygreenjs.setPaymentMethod("apple_pay" as PgPaymentMethod);
      }
    } else {
      el.style.display = 'none';
    }
  }
}