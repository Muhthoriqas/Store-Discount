import express from 'express';
import authRouter from './app/routes/auth.routes.js';
import storeRouter from './app/routes/store.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use(storeRouter);

app.listen(port, () => {
  console.log(`BarKit App listening on port ${port}`);
});
