const pengeluaranModel = require("../../models/pengeluaran")

const deletePengeluaran = (req, res) => {
  const { user_id, pengeluaran_id } = req.body

  let pembayaran;
  let jumlah;

  pengeluaranModel.deletePengeluaran(user_id, pengeluaran_id, (error, result) => {
    if(error){
      return res.status(500).json({
        status: "Failed",
        message: "Terjadi kesalahan!",
      });
    }

    pembayaran = result[0]
    jumlah = result[1]
    return res.json({
      test: pembayaran
    })
  })
}

module.exports = deletePengeluaran