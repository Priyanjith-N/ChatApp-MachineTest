import { config } from "dotenv";

config(); // config environment variables

import app from "./framework/config/app"; // importing application
import connectDB from "./framework/config/db"; // connect to db

connectDB(); // connecting to db

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Chat App Server is running on PORT ${PORT}`));