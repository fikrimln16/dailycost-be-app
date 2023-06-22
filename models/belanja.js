const db = require('../config/db');

const belanjaModel = {
  belanja: (nama, tanggal, jumlah, pembayaran, user_id, kategori, callback) => {
    if (
      pembayaran === 'GOPAY' ||
      pembayaran === 'CASH' ||
      pembayaran === 'REKENING'
    ) {
      try {
        db.query(
          'INSERT INTO pengeluaran VALUES(null, ?, ?, ?, ?, ?, ?) ',
          [nama, tanggal, jumlah, pembayaran, user_id, kategori],
          (error, results) => {
            if (error) {
              return callback(error, null);
            }

            db.query(
              `SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ${user_id}`,
              (error, results) => {
                if (error) {
                  return callback(error, null);
                }

                const uang_gopay = results[0].uang_gopay;
                const uang_cash = results[0].uang_cash;
                const uang_rekening = results[0].uang_rekening;

                if (pembayaran === 'GOPAY') {
                  const uang_gopay_update = uang_gopay - jumlah;
                  db.query(
                    `UPDATE tabungan SET uang_gopay = ${uang_gopay_update} WHERE id = ${user_id}`,
                    (error, results) => {
                      if (error) {
                        return callback(error, null);
                      }
                      return callback(null, 'Berhasil Membeli Barang!');
                    }
                  );
                } else if (pembayaran === 'REKENING') {
                  const uang_rekening_update = uang_rekening - jumlah;
                  db.query(
                    `UPDATE tabungan SET uang_rekening = ${uang_rekening_update} WHERE id = ${user_id}`,
                    (error, results) => {
                      if (error) {
                        return callback(error, null);
                      }
                      return callback(null, 'Berhasil Membeli Barang!');
                    }
                  );
                } else if (pembayaran === 'CASH') {
                  const uang_cash_update = uang_cash - jumlah;
                  db.query(
                    `UPDATE tabungan SET uang_cash = ${uang_cash_update} WHERE id = ${user_id}`,
                    (error, results) => {
                      if (error) {
                        return callback(error, null);
                      }
                      return callback(null, 'Berhasil Membeli Barang!');
                    }
                  );
                }
              }
            );
          }
        );
      } catch (error) {
        return callback(error, null);
      }
    } else {
      return callback('Metode pembayaran tidak valid',"Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`.", 400);
    }
  }
};

module.exports = belanjaModel;
