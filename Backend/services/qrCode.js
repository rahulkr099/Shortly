
import QRCode from 'qrcode';

export const qrcode = async (req, res) => {
    const { url } = req.body;
    console.log('url in qrcode.js',url);
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }
    try {
        const qrCodeData = await QRCode.toDataURL(url);
        // console.log(qrCodeData)
        res.send({ qrCode: qrCodeData });
    } catch (error) {
        res.status(500).send({ error: 'Failed to generate QR code' });
    }
};


