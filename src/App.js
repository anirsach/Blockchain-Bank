import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import bank from "./bank"

class App extends React.Component {
  state = {
    password: "",
    message: "",
    amount: ""
  };

  async componentDidMount() {
    const password = "";
    const message = "";
    const amount = "";
    this.setState({ password, message, amount });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const customer = await bank.methods.customers(this.state.password).call();
    this.setState({ message: `your fd amount is ${customer.fdAmount} and your balance is ${customer.balance}`, password: "" });

  }

  onSubmit1 = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    if (this.state.message === "Yes") { this.setState({ password: 99 }) };

    this.setState({ message: "Your transaction is under process....." })

    await bank.methods.Deposit(this.state.password).send({
      from: accounts[0], gas: "1000000", value: this.state.amount
    });

    this.setState({ message: "Your transaction is successfull", password: "", amount: "" });
  }

  onSubmit2 = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Your transaction is under process....." })

    await bank.methods.Withdraw(this.state.password, this.state.amount).send({
      from: accounts[0], gas: "1000000"
    });

    this.setState({ message: "Your transaction is successfull", password: "", amount: "" });
  }

  onSubmit3 = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Your transaction is under process....." })

    await bank.methods.createFD(this.state.password, this.state.amount).send({
      from: accounts[0], gas: "1000000"
    });

    this.setState({ message: "Your transaction is successfull", password: "", amount: "" });
  }

  onSubmit4 = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Your transaction is under process....." })

    await bank.methods.breakFD(this.state.password).send({
      from: accounts[0], gas: "1000000"
    });

    this.setState({ message: "Your transaction is successfull", password: "", amount: "" });
  }

  render() {
    return (
      <div>
        <div>
          <h1>BANK</h1>
        </div>
        <div>
          <h2>Know your Details:</h2>
          <form onSubmit={this.onSubmit}>
            <label>Enter your password:</label>
            <input onChange={event => this.setState({ password: event.target.value })}></input>
            <button>Submit</button>
          </form>
        </div>
        <hr />
        <div>
          <h2>Deposit:</h2>
          <div>
            <label for="account">First time Deposit(Create an account):</label>
            <input onChange={event => this.setState({ message: event.target.value })} list="account_option" id="account" name="account" />

            <datalist id="account_option">
              <option value="Yes" />
              <option value="No" />
            </datalist>



          </div>


          <form onSubmit={this.onSubmit1}>
            <label>Enter your password:</label>
            <input onChange={event => this.setState({ password: event.target.value })} />


            <label>Enter the amount in wei:</label>
            <input onChange={event => this.setState({ amount: event.target.value })} />

            <button>Submit</button>
          </form>
        </div>
        <hr />
        <div>
          <h2>Withdraw:</h2>
          <form onSubmit={this.onSubmit2}>
            <label>Enter your password:</label>
            <input onChange={event => this.setState({ password: event.target.value })} />

            <label>Enter the amount in wei:</label>
            <input onChange={event => this.setState({ amount: event.target.value })} />

            <button>Submit</button>
          </form>
        </div>
        <hr />
        <div>
          <h2>Create FD:</h2>
          <form onSubmit={this.onSubmit3}>
            <label>Enter your password:</label>
            <input onChange={event => this.setState({ password: event.target.value })} />

            <label>Enter the amount in wei:</label>
            <input onChange={event => this.setState({ amount: event.target.value })} />

            <button>Submit</button>
          </form>
        </div>

        <hr />

        <div>
          <h2>Break FD:</h2>
          <form onSubmit={this.onSubmit4}>
            <label>Enter your password:</label>
            <input onChange={event => this.setState({ password: event.target.value })} />

            <button>Submit</button>
          </form>
        </div>

        <hr />
        <div>{this.state.message} </div>

      </div>
    );
  }
}
export default App;