const pengeluaranModel = require("../../models/pengeluaran");

const deletePengeluaran = (req, res) => {
	const { user_id, pengeluaran_id } = req.body;

	var pembayaran;
	var jumlah;

	pengeluaranModel.deletePengeluaran(
		user_id,
		pengeluaran_id,
		(error, result) => {
			if (error) {
				return res.status(500).json({
					status: "Failed",
					message: "Terjadi kesalahan!",
				});
			}

      //mengambil data pembayaran dan jumlah terlebih dahulu
			pembayaran = result[0].pembayaran;
			jumlah = result[0].jumlah;
      
		}
	);

	return res.json({
		pembayaran: pembayaran,
    jumlah: jumlah
	});
};

module.exports = deletePengeluaran;
