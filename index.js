import dotenv from 'dotenv'
import express from 'express'
import initApp from './src/index.router.js'
// //set directory dirname 
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// dotenv.config({ path: path.join(__dirname, './.env') })
dotenv.config();

const app = express();
initApp(app ,express)

app.listen(process.env.PORT,()=>{console.log(`Server Running ${process.env.PORT}`);});
