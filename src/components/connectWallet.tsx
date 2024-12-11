import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const ConnectWallet: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setError("MetaMask is not installed");
    }
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum!.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const balanceWei = await web3.eth.getBalance(accounts[0]);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        setBalance(balanceEth);

        setError(null);
      } catch (err) {
        setError("Failed to connect wallet"); 
      }
    } else {
      setError("Web3 not initialized");
    }
  };

  const sendTransaction = async () => {
    if (web3 && account) {
      try {
        const tx = {
          from: account,
          to: recipient,
          value: web3.utils.toWei(amount, "ether"),
          gas: 21000,
        };

        await window.ethereum!.request({
          method: "eth_sendTransaction",
          params: [tx],
        });

        setError(null);
        alert("Transaction sent successfully!");
      } catch (err: any) {
        setError(err.message || "Transaction failed");
      }
    } else {
      setError("Please connect your wallet first");
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        React + Wallet Connect
      </Typography>

      {account ? (
        <>
          <Typography variant="h6" gutterBottom>
            Connected Account: {account}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Balance: {balance} ETH
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Send Transaction
            </Typography>
            <TextField
              label="Recipient Address"
              fullWidth
              margin="normal"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "white" },
              }}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 1,
              }}
            />
            <TextField
              label="Amount (ETH)"
              type="number"
              fullWidth
              margin="normal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "white" },
              }}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 1,
              }}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={sendTransaction}
            >
              Send Transaction
            </Button>
          </Box>
        </>
      ) : (
        <Button variant="contained" color="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ConnectWallet;
