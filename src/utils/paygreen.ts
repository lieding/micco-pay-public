import { IS_DEV } from "../consts";
import { PgPaymentFlowStatus, PgPaymentFlowStatusEnum, PgPaymentMethod } from "../typing";

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
    onFormFilling?: (paymentFlow?: any) => void;
    onError?: (err?: { message: string, reset?: boolean }) => void;
    onSelection?: () => void;
    onSubmit?: () => void;
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
      const flows = paygreenjs.status()?.flows;
      console.log("PAYMENT_FLOW_ONCHANGE", flows);
      const lastFlow = flows[flows.length - 1];
      if (!lastFlow) return;
      const { method, status } = lastFlow;
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
        callbacks.onFormFilling?.(lastFlow);
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
      callbacks.onFormFilling?.(null);
    }
  )

  paygreenjs.attachEventListener(
    paygreenjs.Events.REQUEST_SUBMIT_TOKENIZE_FORM,
    () => {
      console.log('REQUEST_SUBMIT_TOKENIZE_FORM');
      callbacks.onSubmit?.();
    }
  );

  paygreenjs.attachEventListener(paygreenjs.Events.PAYMENT_FAIL, (err: any) => {
    console.error("payment authorization has been refused", err);
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
      el.onclick = () => window.paygreenjs.setPaymentMethod("apple_pay" as PgPaymentMethod);
    } else {
      el.style.display = 'none';
    }
  }
}