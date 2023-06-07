const _attachWalletAddressToTransaction = (transactions, walletAddress) => {
 transactions.forEach((transaction) => {
    transaction.walletAddress = walletAddress;
 }) 
 return transactions
}
module.exports = _attachWalletAddressToTransaction;