const db = require("../config/db");

const pengeluaranModel = {
  deletePengeluaran: (user_id, pengeluaran_id, callback) => {
    db.query("SELECT jumlah, pembayaran FROM pengeluaran WHERE user_id = ? AND pengeluaran_id = ?", [user_id, pengeluaran_id], (error, result) => {
      if(error){
        return callback(error, null);
      }
      return callback(null, result)
    })
  },
}

module.exports = pengeluaranModel