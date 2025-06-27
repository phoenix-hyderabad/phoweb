import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import corsOptions from "@/config/cors";
import type { ErrorRequestHandler } from "express";
import api from "@/api";
import { AppError, HttpCode } from "@/config/errors";
import { errorHandler } from "@/lib/middleware/errorhandler";
import logger from "@/lib/logger";
import requestIp from "request-ip";

const app = express();
if (process.env.DOCKER_ENVIRONMENT === "true") {
    logger.info("RUNNING IN DOCKER");
    app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        keyGenerator: (req) => requestIp.getClientIp(req) ?? "127.0.0.1",
    })
);
app.set("view engine", "jade");
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

app.use("/api/", api);

// catch 404
app.use((_req, _res, next) => {
    next(
        new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: "Requested endpoint does not exist",
        })
    );
});

// error handler
const expressErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    errorHandler.handleError(err as Error | AppError, req, res);
};
app.use(expressErrorHandler);

process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception`);
    errorHandler.handleError(error);
});

export default app;
