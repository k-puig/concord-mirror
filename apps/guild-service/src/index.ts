import { Elysia } from "elysia";

const app = new Elysia().get("/", "Hello world!");
app.listen(3000);

export default app;
