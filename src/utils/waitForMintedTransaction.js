const waitForMintedTransaction = ({ provider, tx }) =>
  new Promise((resolve) => {
      const maxAttempts = 40;
      let attempts = 0;
      const intervalId = setInterval(async () => {
        attempts++;

        const receipt = await provider.getTransactionReceipt(tx);

        if (!receipt && attempts <= maxAttempts) {
          console.log(`receipt attempt ${attempts}`);
          return;
        }
        console.log("receipt", { receipt }); // TODO delete

        if (!receipt) {
          console.log("transaction not found")
          clearInterval(intervalId);
          resolve({ success: false, error: "Transaction not found" });
          return;
        }

        if (!receipt.blockNumber) {
          console.log("not minted yet")
          return;
        }

        if (receipt.blockNumber && receipt.status === 1) {
          console.log("transaction success");
          clearInterval(intervalId);
          resolve({ success: true });
          return;
        }

        console.log("transaction end");
        clearInterval(intervalId);
        resolve({ success: false, error: "Transaction reverted" });
      }, 5000)
    }
  )

export default waitForMintedTransaction;
