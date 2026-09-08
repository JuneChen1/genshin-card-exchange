require('dotenv').config();

const { dataSource } = require('./db/data-source');

async function main() {
  try {
    await dataSource.initialize();
    console.log('資料庫連線成功');
  } catch (error) {
    console.error('資料庫連線失敗：', error);
    process.exit(1);
  }

  const express = require('express');
  const cors = require('cors');

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));

  app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Page Not Found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`伺服器啟動中：http://localhost:${PORT}`));
}

main();
