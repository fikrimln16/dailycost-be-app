const catatanModel = require("../../models/catatan");


const deleteCatatan = (req, res) => {
  const { user_id, catatan_id } = req.body;

  catatanModel.deleteCatatan(user_id, catatan_id, (error, message) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Failed',
        message: 'Terjadi kesalahan pada server',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: message,
    });
  });
};

module.exports = deleteCatatan