import express, { Router } from "express";
import { getTest } from "../controllers/test.controller";
import verifyJWT from "../middleware/verifyJWT";

const testRoutes = express.Router();

testRoutes.use(verifyJWT as express.RequestHandler);

testRoutes.get("/", getTest);

export default testRoutes;
