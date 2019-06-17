import express from "express";
import { Request, Response, Router } from "express";
import * as bodyParser from "body-parser";
import { rpcClient } from "./rpcClient";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "./.env") });
const app = express();
const router = Router();

//use bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.route("/login").post(async (req: Request, res: Response) => {
  req.body.action = "login";

  // create Rabbit RPC req to account services.
  const response = await rpcClient(req.body);
  if (response.error) {
    return res.status(401).send({ Error: response.error });
  }
  res.status(200).send({ token: response.token });
});

app.use("/auth", router);
app.listen(Number(process.env.LOGIN_PORT), function() {
  console.log(
    "TR API server running on port: " + String(process.env.LOGIN_PORT)
  );
});
