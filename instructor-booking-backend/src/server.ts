import app from "./app.js";
import { env } from "./config/environment.js";
import connectDB from "./config/database.js";

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`);
            console.log(`Environment: ${env.NODE_ENV}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();