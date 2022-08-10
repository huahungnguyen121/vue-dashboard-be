import morgan from "morgan";

export default function loggingMiddleware(expressApp) {
    expressApp.use(
        morgan(":method :url :status :res[content-length] - :response-time ms")
    );
}
