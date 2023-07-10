import "./index.css";

export default function Loadding() {
  return (
    <div className="lds-wrapper">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}