import express from 'express';
import authRouter from './app/routes/auth.routes.js';
import storeRouter from './app/routes/store.routes.js';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use(storeRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
