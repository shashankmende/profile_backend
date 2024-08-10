require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDb = require('./utils/db');
const router = require('./router/router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/exam_profile/', router);

connectDb().then(() => {
    app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
}).catch((err) => {
    console.error("Error connecting to database:", err);
});
