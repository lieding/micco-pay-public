import { useMemo, useRef, useState } from "react";
import { AwesomeQRCode, AwesomeQRCodeState } from "@awesomeqr/react";
import cls from "classnames";
import { FullWidthBtn } from '../../components';
import styles from "./index.module.scss";

function OrderQrcode(props: {
  id: string
  restaurantId: string
  orderNumber: string
  restaurantName: string | undefined
}) {
  const [downloadBtnVis, setDownloadBtnVis] = useState(false);
  const qrcodeWrapperRef = useRef<HTMLDivElement | null>(null);
  const onStateChange = (state: AwesomeQRCodeState) => {
    if (state === 'idle')
      setDownloadBtnVis(true);
  }
  const options = useMemo(
    () => ({
      text: `${window.location.origin}/scanOrder?id=${props.id}&restaurantId=${props.restaurantId}`,
    }),
    []
  );

  const download = () => {
    const imgDiv = qrcodeWrapperRef.current?.childNodes?.[0]?.childNodes?.[0] as HTMLDivElement | undefined;
    const { restaurantName = '', id, orderNumber } = props;
    const fileName = `${[restaurantName, orderNumber || id].join('-')}.png`;
    if (imgDiv) {
      const back = imgDiv.style?.backgroundImage;
      back && downloadFile(back, fileName);
    }
  }

  return (
    <>
      <div
        className={cls(styles.qrCodeWrapper, "textAlign")}
        ref={el => qrcodeWrapperRef.current = el}
      >
        <AwesomeQRCode options={options} onStateChange={onStateChange} />
      </div>
      {
        downloadBtnVis ? <div className={styles.downloadBtnRow}>
          <FullWidthBtn cbk={download}>
            <span>Télécharger l'image de Qrcode comme preuve</span>
          </FullWidthBtn>
        </div> : null
      }
    </>
  );
}

export default OrderQrcode;

/**
 * Download Base64 picture
 */
function downloadFile(content: string, fileName: string) {
  let aLink = document.createElement('a');
  aLink.download = fileName;
  aLink.href = content.slice(5, -2);
  aLink.click();
};

