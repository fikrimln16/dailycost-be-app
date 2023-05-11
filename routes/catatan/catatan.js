const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')
const multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // batasan ukuran file 5MB
  },
});

// inisialisasi client Google Cloud Storage
const storage = new Storage({
  projectId: 'astute-acolyte-381310',
  keyFilename: path.join(__dirname, 'keyfile.json'),
});


router.get('/catatan', verifyToken, (req, res) => {
  
    db.query('SELECT * FROM catatan', (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada' });
      // }
      return res.status(200).json({
        message : 'berhasil',
        data : results
      });
    });
  }
) 

router.get('/catatan/:id', verifyToken,  (req, res) => {
    const id  = req.params.id;
  
    db.query('SELECT catatan_id, title, body, DATE_FORMAT(created_at, "%d %M %Y") AS created_at, user_id, url FROM catatan WHERE user_id = ? ORDER BY catatan_id DESC', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada' });
      // }
      return res.status(200).json({
        message : 'berhasil',
        data : results
      });
    });
  }
)

router.post('/catatan', upload.single('file'), verifyToken, (req, res) => {
    const { title, body, date, user_id }  = req.body;
    const file = req.file;

    const bucketName = 'dailycost-catatan-images';  
          
    if (!file) {
      res.status(400).send('Mohon unggah file gambar!');
      return;
    }

    // Buat nama file baru tanpa spasi
    const newFileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '');

    // buat instance bucket
    const myBucket = storage.bucket(bucketName);
    // upload gambar ke bucket
    const blob = myBucket.file(newFileName); // gunakan nama file baru
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Terjadi kesalahan saat mengunggah gambar.');
    });
        
    var publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru
    blobStream.on('finish', () => {
      // set public access untuk file
      blob.makePublic().then(() => {
        // dapatkan public link dari file
        publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru
      });
    });
    blobStream.end(file.buffer);


    db.query('INSERT INTO catatan VALUES(null, ?, ?, ?, ?, ?) ', [title, body, date, user_id, publicUrl], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada' });
      // }
      return res.status(200).json({
        message : 'berhasil',
        url : publicUrl,
        data : results
      });
    });
  }
)

// tentukan nama bucket

router.post('/upload/image', upload.single('image'), (req, res, next) => {
  const bucketName = 'dailycost-catatan-images';  
  const file = req.file;
  
  if (!file) {
    res.status(400).send('Mohon unggah file gambar!');
    return;
  }

  // buat instance bucket
  const myBucket = storage.bucket(bucketName);

  // upload gambar ke bucket
  const blob = myBucket.file(file.originalname);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat mengunggah gambar.');
  });

  blobStream.on('finish', () => {
    // set public access untuk file
    blob.makePublic().then(() => {
      // dapatkan public link dari file
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.originalname}`;
      res.status(200).send({ publicUrl });
    });
  });

  blobStream.end(file.buffer);
});

module.exports = router;