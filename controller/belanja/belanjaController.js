const belanjaModel = require("../../models/belanja");

// belanjaController.js
const belanja = (req, res) => {
  const { nama, tanggal, jumlah, pembayaran, user_id, kategori } = req.body;
  
  belanjaModel.belanja(nama, tanggal, jumlah, pembayaran, user_id, (error, message) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Failed',
        message: 'Terjadi kesalahan pada server saat melakukan pembelanjaan.',
      });
    }
    
    return res.status(200).json({
      status: 'Success',
      message: message,
      data: req.body,
    });
  });
};

module.exports = belanja;
