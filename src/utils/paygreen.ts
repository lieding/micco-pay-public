import { IS_DEV } from '../consts'
import { PgPaymentMethod } from '../typing';

export function importResources () {
  // <link href="https://pgjs.paygreen.fr/latest/paygreen.min.css" type="text/css" rel="stylesheet" />
  // <script defer type="text/javascript" src="https://pgjs.paygreen.fr/latest/paygreen.min.js"></script>
  // const link = document.createElement('link');
  // link.href = 'https://pgjs.paygreen.fr/latest/paygreen.min.css';
  // link.type = 'text/css';
  // link.rel = 'stylesheet';
  // document.head.appendChild(link);
  const script = document.createElement('script');
  script.defer = true;
  script.type = 'text/javascript';
  script.src = IS_DEV ? 'https://sb-pgjs.paygreen.fr/latest/paygreen.min.js' :
    'https://pgjs.paygreen.fr/latest/paygreen.min.js';
  document.body.appendChild(script);
}

export function init (
  paymentOrderID: string,
  objectSecret: string,
  publicKey: string,
  paymentMethod: PgPaymentMethod,
  callbacks: {
    onFinished?: () => void,
    onFormFilling?: (paymentFlow: any) => void,
    onError?: (err?: any) => void,
    onSelection?: () => void,
  },
) {
  const paygreenjs = window.paygreenjs;
  if (!paygreenjs) return console.error("'paygreenjs' has not been loaded");

  paygreenjs.attachEventListener(
    paygreenjs.Events.FULL_PAYMENT_DONE,
    (event: any) => {
      console.log("Payment success");
      callbacks.onFinished?.();
    },
  );

  paygreenjs.attachEventListener(
    paygreenjs.Events.REUSABLE_ALLOWED_CHANGE,
    (event: any) => console.log(event.detail.reusable_allowed),
  );

  paygreenjs.attachEventListener(
    paygreenjs.Events.PAYMENT_FLOW_ONCHANGE,
    () => {
      const flows = paygreenjs.status()?.flows;
      console.log('PAYMENT_FLOW_ONCHANGE', flows);
      const lastFlow = flows[flows.length - 1];
      if (!lastFlow?.method && lastFlow?.status === 'pending') {
        callbacks.onFormFilling?.(lastFlow);
      } else if (!lastFlow?.method && lastFlow?.status === 'pending') {
        callbacks.onSelection?.();
      } else {
        console.error("last usable payment flow has no valid 'method' paramter");
      }
    },
  );

  paygreenjs.attachEventListener(
    paygreenjs.Events.ERROR,
    (err: any) => {
      console.error('the error happens', err);
      callbacks.onError?.();
    },
  );

  paygreenjs.attachEventListener(
    paygreenjs.Events.CARD_ONCHANGE,
    (cardValidity: any) => {
      console.log('the card validity', cardValidity);
    },
  );

  paygreenjs.attachEventListener(
    paygreenjs.Events.PAYMENT_FAIL,
    (err: any) => {
      console.error('payment authorization has been refused', err);
      callbacks.onError?.();
    },
  );

  paygreenjs.init({
    paymentOrderID,
    objectSecret,
    publicKey,
    mode: "payment",
    style,
    paymentMethod,
  });
}

const style = {
  input: {
    base: {
      color: 'black',
      fontSize: '18px',
    },
    hover: {
      color: 'grey',
    },
    focus: {
      color: 'grey',
    },
    invalid: {
      color: 'red',
    },
    placeholder: {
      base: {
        color: 'grey',
      },
    },
  },
  checkbox: {
    label: {
      base: {
        color: 'black',
      },
      unchecked: {
        color: 'black',
      },
    },
    box: {
      base: {
        color: '#002B5B',
        hover: {
          color: '#424242',
        },
      },
      unchecked: {
        color: '#002B5B',
      },
    },
  },
};