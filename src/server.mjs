import express from "express";
import dotenv from "dotenv";
import route from "./routes/index.mjs";

dotenv.config();


console.log('PORT from env:', process.env.PORT);


const app = express();

app.use(express.json());
app.use("/api",route);

const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
	console.log(`The server is Running on PORT ${PORT}`);
});

app.get("/", (req,res) =>{

	return res.send({msg: "Welcome to the home page"});
});
