const db = require("../../config/db"); // Impor file database.js

const putCatatan = (req, res) => {
  const { user_id, catatan_id, title, body } = req.body;

  try {
    db.query(
      "UPDATE catatan SET title = ?, body = ? WHERE catatan_id = ? AND user_id = ?",
      [title, body, catatan_id, user_id],
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            status: "Failed",
            message: "Terjadi kesalahan pada server!",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failed",
            message: "Catatan tidak ditemukan",
          });
        }

        return res.status(200).json({
          status: "Success",
          message: "Catatan berhasil diperbarui",
          data: { catatan_id: catatan_id, title: title, body: body },
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = putCatatan