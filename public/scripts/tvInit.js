'use strict'

// Generate a QR code for the root of wherever this site is hosted.
new QRCode(document.getElementById("qr-code"), {
    text: location.origin,
    width: 1024,
    height: 1024,
    colorDark : "#000000",
    colorLight : "#ffffff", 
});
