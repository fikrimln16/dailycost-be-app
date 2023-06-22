const db = require("../config/db");
const storage = require("../config/storage")

const catatanModel = {
	getCatatan: (callback) => {
		db.query("SELECT * FROM catatan", (error, results) => {
			if (error) {
				return callback(error, null, 500);
			}
			if (results.length === 0) {
				return callback(null, [], 200);
			}
			return callback(null, results, 200);
		});
	},
	createCatatan: (title, body, date, user_id, imageUrl, callback) => {
		db.query(
			"INSERT INTO catatan VALUES (null, ?, ?, ?, ?, ?)",
			[title, body, date, user_id, imageUrl],
			(error, results) => {
				if (error) {
					return callback(error, null, 500);
				}
				const catatanId = results.insertId;
				return callback(null, catatanId, 200);
			}
		);
	},
	updateCatatan: (catatan_id, user_id, title, body, callback) => {
		db.query(
			"UPDATE catatan SET title = ?, body = ? WHERE catatan_id = ? AND user_id = ?",
			[title, body, catatan_id, user_id],
			(error, result) => {
				if (error) {
					return callback("Terjadi kesalahan pada server!", null, 500);
				}

				if (result.affectedRows === 0) {
					return callback("Catatan tidak ditemukan", null, 404);
				}

				return callback(null, { catatan_id, title, body }, 200);
			}
		);
	},deleteCatatan: (user_id, catatan_id, callback) => {
		const bucketName = "dailycost-catatan-images";
    db.query(
      'SELECT url FROM catatan WHERE user_id = ? AND catatan_id = ?',
      [user_id, catatan_id],
      (error, result) => {
        if (error) {
          return callback(error, null);
        } else if (result.length === 0) {
          return callback(null, 'Catatan tidak ditemukan');
        } else {
          const url = result[0].url;
          db.query(
            'DELETE FROM catatan WHERE user_id = ? AND catatan_id = ?',
            [user_id, catatan_id],
            (error, result) => {
              if (error) {
                return callback(error, null);
              } else {
                const fileName = url.substring(url.lastIndexOf('/') + 1);
                const file = storage.bucket(bucketName).file(fileName);
                file.delete()
                  .then(() => {
                    return callback(null, 'Catatan berhasil dihapus');
                  })
                  .catch((error) => {
                    return callback(error, null);
                  });
              }
            }
          );
        }
      }
    );
  },
	getCatatanById: (id, callback) => {
    db.query(
      'SELECT catatan_id, title, body, DATE_FORMAT(created_at, "%d %M %Y") AS created_at, UNIX_TIMESTAMP(created_at) AS created_at_epoch, user_id, url FROM catatan WHERE user_id = ? ORDER BY catatan_id DESC',
      [id],
      (error, results) => {
        if (error) {
          return callback(error, null);
        }
        return callback(null, results);
      }
    );
  },
};

module.exports = catatanModel;
