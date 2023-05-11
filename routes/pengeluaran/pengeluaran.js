const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')


router.get('/pengeluaran/:id',  verifyToken, (req, res) => {
    const  id   = req.params.id;

    db.query('SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran FROM pengeluaran WHERE user_id = ? ORDER BY pengeluaran_id DESC ', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Data Tidak ada' });
        }

        let totalPembayaranGOPAY = 0;
        let totalPembayaranREKENING = 0;
        let totalPembayaranCASH = 0;

        for (let i = 0; i < results.length; i++) {
            if (results[i].pembayaran === "GOPAY") {
                totalPembayaranGOPAY += results[i].jumlah;
            } 
            if (results[i].pembayaran === "REKENING") {
                totalPembayaranREKENING += results[i].jumlah;
            } 
            if (results[i].pembayaran === "CASH") {
                totalPembayaranCASH += results[i].jumlah;
            } 
        }
 
        const pengeluaran = {
            pengeluaran_gopay: totalPembayaranGOPAY,
            pengeluaran_rekening: totalPembayaranREKENING,
            pengeluaran_cash: totalPembayaranCASH
        }

        return res.status(200).json({
            results,
            pengeluaran
        });
    });
})

router.get('/pengeluaran/chart/:id',  verifyToken, (req, res) => {
    const  id   = req.params.id;

    db.query(`SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, SUM(jumlah) AS jumlah FROM pengeluaran WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND user_id = ${id} GROUP BY DATE(tanggal) ORDER BY "tanggal" DESC`, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Data Tidak ada' });
        }
        
        const formattedResults = results.map(result => result.tanggal);
        const formattedJumlah = results.map(result => result.jumlah);

        const data = {
            tanggal: formattedResults,
            jumlah: formattedJumlah
        }

        return res.status(200).json({
            results: data
        });
        
    });
})

router.get('/pengeluaran/:id/list/:bulan/:tahun', verifyToken, (req, res) => {
    const id = req.params.id;
    const bulan = req.params.bulan;
    const tahun = req.params.tahun;
    db.query(`SELECT nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran FROM pengeluaran WHERE DATE_FORMAT(tanggal, '%Y-%m') = '${tahun}-${bulan}' && user_id = ${id}`, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada', print: tanggal });
      // }
        let totalPembayaranGOPAY = 0;
        let totalPembayaranREKENING = 0;
        let totalPembayaranCASH = 0;

        let totalPengeluaranGOPAY = 0;
        let totalPengeluaranREKENING = 0;
        let totalPengeluaranCASH = 0;

        for (let i = 0; i < results.length; i++) {
            if (results[i].pembayaran === "GOPAY") {
                totalPembayaranGOPAY += results[i].jumlah;
                totalPengeluaranGOPAY++;
            } 
            if (results[i].pembayaran === "REKENING") {
                totalPembayaranREKENING += results[i].jumlah;
                totalPengeluaranREKENING++;
            } 
            if (results[i].pembayaran === "CASH") {
                totalPembayaranCASH += results[i].jumlah;
                totalPengeluaranCASH++;
            } 
        }

        const pengeluaran = {
            pengeluaran_gopay: totalPembayaranGOPAY,
            pengeluaran_rekening: totalPembayaranREKENING,
            pengeluaran_cash: totalPembayaranCASH,
            pembelian_gopay: totalPengeluaranGOPAY,
            pembelian_rekening: totalPengeluaranREKENING,
            pembelian_cash: totalPengeluaranCASH,
            total: totalPengeluaranGOPAY + totalPengeluaranREKENING + totalPengeluaranCASH,
            total_pembelian : totalPembayaranCASH + totalPembayaranREKENING + totalPembayaranGOPAY
        }


        return res.status(200).json({
            results,
            pengeluaran
        });
    });
})

router.get('/pengeluaran/:id/list/:tanggal', verifyToken, (req, res) => {
    const id = req.params.id;
    const tanggal = req.params.tanggal;
    db.query(`SELECT nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran FROM pengeluaran WHERE user_id = ${id} && tanggal BETWEEN "${tanggal} 00:00:00" AND "${tanggal} 23:59:59"`, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada', print: tanggal });
      // }

      let totalPembayaranGOPAY = 0;
      let totalPembayaranREKENING = 0;
      let totalPembayaranCASH = 0;

      let totalPengeluaranGOPAY = 0;
      let totalPengeluaranREKENING = 0;
      let totalPengeluaranCASH = 0;

      for (let i = 0; i < results.length; i++) {
          if (results[i].pembayaran === "GOPAY") {
              totalPembayaranGOPAY += results[i].jumlah;
              totalPengeluaranGOPAY++;
          } 
          if (results[i].pembayaran === "REKENING") {
              totalPembayaranREKENING += results[i].jumlah;
              totalPengeluaranREKENING++;
          } 
          if (results[i].pembayaran === "CASH") {
              totalPembayaranCASH += results[i].jumlah;
              totalPengeluaranCASH++;
          } 
      }

      const pengeluaran = {
          pengeluaran_gopay: totalPembayaranGOPAY,
          pengeluaran_rekening: totalPembayaranREKENING,
          pengeluaran_cash: totalPembayaranCASH,
          pembelian_gopay: totalPengeluaranGOPAY,
          pembelian_rekening: totalPengeluaranREKENING,
          pembelian_cash: totalPengeluaranCASH,
          total: totalPengeluaranGOPAY + totalPengeluaranREKENING + totalPengeluaranCASH,
          total_pembelian : totalPembayaranCASH + totalPembayaranREKENING + totalPembayaranGOPAY,
          date: tanggal
      }


      return res.status(200).json({
          results,
          pengeluaran
      });
    });
})


module.exports = router;