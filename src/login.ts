import express from "express";
import { Request, Response, Router } from "express";
import * as bodyParser from "body-parser";
import { rpcClient } from "./rpcClient";

const app = express();
const router = Router();

//use bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.route("/login").post(async (req: Request, res: Response) => {
  req.body.action = "login";

  // create Rabbit RPC req to account services.
  const jwtToken = await rpcClient(req.body);
  res.status(200).send({ token: jwtToken });
});

app.use("/auth", router);
app.listen(8080, function() {
  console.log("TR API server running on port: " + String(8080));
});
