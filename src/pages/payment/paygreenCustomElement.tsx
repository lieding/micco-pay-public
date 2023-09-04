import { PgPaymentFlowStatus } from "../../typing";
import cls from "classnames";

interface IProps {
  flowStatus: PgPaymentFlowStatus;
}

export function checkShowPaymentForm(flowStatus: PgPaymentFlowStatus) {
  return ![PgPaymentFlowStatus.INIT, PgPaymentFlowStatus.EN_SELECTION].includes(
    flowStatus
  );
}

export function checkPaymentFormInteractive(flowStatus: PgPaymentFlowStatus) {
  return flowStatus === PgPaymentFlowStatus.FORM_FILLING;
}

export default function PayGreenElement({ flowStatus }: IProps) {
  const formVisible = checkShowPaymentForm(flowStatus);
  const formInteractive = checkPaymentFormInteractive(flowStatus);

  return (
    <div className={cls("paygreen-wrapper")}>
      <div id="paygreen-container"></div>
      <div className="title">Méthode de paiement</div>
      <div id="paygreen-methods-container"></div>
      <div
        className={cls("pay-form", {
          visible: formVisible,
          interactive: formInteractive,
        })}
      >
        <div>
          <label>Numéro de carte</label>
          <div id="paygreen-pan-frame" className="field-input-wrapper"></div>
        </div>
        <div className="line">
          <div>
            <label>Expiration</label>
            <div id="paygreen-exp-frame" className="field-input-wrapper"></div>
          </div>
          <div className="paygreen-cvv-container">
            <label>CVV</label>
            <div id="paygreen-cvv-frame" className="field-input-wrapper"></div>
            <i data-feather="help-circle"></i>
          </div>
        </div>
        <div id="paygreen-reuse-checkbox-container"></div>
      </div>
    </div>
  );
}
