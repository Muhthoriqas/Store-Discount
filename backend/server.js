import express from 'express';
import storeRouter from './app/routes/store.routes.js';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(storeRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
