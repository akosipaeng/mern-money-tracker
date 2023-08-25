import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    // console.log(url);

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        amount,
        name,
        description,
        datetime,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setTransactions([...transactions, json]);
        setName("");
        setAmount(0);
        setDatetime("");
        setDescription("");
        console.log("result", json);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.amount;
  }
  balance = balance.toFixed(2);
  //console.log(typeof balance);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];
  //console.log(balance);

  function inCompleteData(ev) {
    ev.preventDefault();
    alert("please input complete data.");
  }

  return (
    <main>
      <h1 className={balance < 0 ? "red" : "green"}>
        ${balance}
        <span>{fraction}</span>
      </h1>
      <form
        onSubmit={
          name !== "" && description !== "" && datetime !== "" && amount !== ""
            ? addNewTransaction
            : inCompleteData
        }
      >
        <div className="basic">
          <input
            className="cost"
            type="number"
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
            placeholder={"Amount"}
          />
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"Name of transaction"}
          />
          <input
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            type="text"
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
        {/* {transactions.length} */}
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.amount < 0 ? "red" : "green")
                  }
                >
                  {"$ " + transaction.amount}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
