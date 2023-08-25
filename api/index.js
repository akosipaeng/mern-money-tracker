const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./model/Transaction");

const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/api/test", (req, res) => {
  res.json("test ok3");
});

app.post("/api/transaction", async (req, res) => {
  const transactionData = req.body;
  await mongoose.connect(process.env.MONGO_URL);
  // console.log(process.env.MONGO_URL);
  const { name, description, datetime, amount } = req.body;

  const transaction = await Transaction.create({
    name,
    description,
    datetime,
    amount,
  });

  //console.log("Received transaction data:", transactionData);

  res.json(transaction);
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
