const catatanModel = require("../../models/catatan");

const getCatatanById = (req, res) => {
  const id = req.params.id;

  catatanModel.getCatatanById(id, (error, catatan) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Failed',
        message: 'Terjadi kesalahan pada server',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengambil catatan dengan user id: ${id}`,
      data: catatan,
    });
  });
};

module.exports = getCatatanById