import { config } from "dotenv";

config(); // config environment variables

import httpServer from "./framework/config/app"; // importing application
import connectDB from "./framework/config/db"; // connect to db
import { connectSocket } from "./framework/utils/socket.utils";

connectDB(); // connecting to db

const emitSocketEvent = connectSocket(httpServer); // socket configuration and event listn initailazation

const PORT: string | number = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`Chat App Server is running on PORT ${PORT}`));

export default emitSocketEvent;