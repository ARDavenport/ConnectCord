// import dotenv to use here, speciffaclly config
import { config } from "dotenv"; 
import express from "express"; // import express

const app = express(); // create a variable to put express in it as a middleware

// listen on port
const server = app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
});
  