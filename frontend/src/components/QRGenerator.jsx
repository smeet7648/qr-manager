// frontend/src/components/QRGenerator.jsx

import { QRCodeCanvas } from "qrcode.react";

export default function QRGenerator({ value }) {

  return (

    <div className="qrBox">

      <QRCodeCanvas
        value={value}
        size={250}
      />

      <p>{value}</p>

    </div>

  );

}