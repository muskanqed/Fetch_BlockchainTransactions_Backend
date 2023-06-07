const Transaction = require("../Models/Transactions");
const BlockTracker = require("../Models/BlockTrackers");
const ethers = require("ethers");
const _getNormalTransaction = require("../Helpers/GetNormalTransactions");
const _getNormalTransactionsByBlockNumber = require("../Helpers/GetNormalTransactionByBlocknumber");
const _getCurrentBlockNumber = require("../Helpers/GetCurrentBlocknumber");
const _attachWalletAddressToTransaction = require("../utilities/AttachWalletaddressToTransaction");

const GetTransactionByAddress = async (request, response) => {
  try {
    const walletAddress = request.params.walletAddress; //get walletAddress by Parameters
    const page = request.query.page; //get page number through query
    const perPage = 10;
    //To check whether the walletAddress is valid
    if (!(walletAddress !== null && walletAddress !== ":walletAddress")) {
      return response.status(404).json({
        success: false,
        message: "Please provide valid values for walletAddress",
      });
    }

    const isWalletAddressValid = await ethers.isAddress(walletAddress);

    if (!isWalletAddressValid) {
      return response.status(400).json({
        sucess: false,
        reason: "Provided Wallet Address is not a valid Ethereum address",
      });
    }

    const getCurrentBlocknumberTransaction = _getCurrentBlockNumber();
    const getLastFetchedBlockNumBerTransaction = BlockTracker.findOne({
      walletAddress: walletAddress,
    });
    const [currentBlockNumber, previousBlockNumber] = await Promise.all([
      getCurrentBlocknumberTransaction,
      getLastFetchedBlockNumBerTransaction,
    ]);
    if (!previousBlockNumber) {
      const _transactionRecords = _getNormalTransaction(
        currentBlockNumber,
        walletAddress
      );
      const addBlockTrackerTransaction = BlockTracker.create({
        walletAddress: walletAddress,
        blockNumber: currentBlockNumber,
      });
      const [_transaction, addBlockTrackerResponse] = await Promise.all([
        _transactionRecords,
        addBlockTrackerTransaction,
      ]);
      if (_transaction.length > 0) {
        const walletAddressAttachTransactions =
          _attachWalletAddressToTransaction(_transaction, walletAddress);
        const bulkAddTransactionResponse = await Transaction.insertMany(
          walletAddressAttachTransactions
        );
        const count = await Transaction.count({ walletAddress: walletAddress });

        const totalNumberOfPages = parseInt(count / perPage);
        let transactionsResponse;
        if (page) {
          transactionsResponse = await Transaction.find({
            walletAddress: walletAddress,
          })
            .skip(page ? perPage * parseInt(page) : "")
            .limit(perPage);
        } else {
          transactionsResponse = await Transaction.find({
            walletAddress: walletAddress,
          })
            .skip()
            .limit(perPage);
        }

        return response.status(200).json({
          sucess: true,
          message: "Transaction found",
          nextPage: page
            ? parseInt(page) === parseInt(totalNumberOfPages)
              ? 0
              : parseInt(page) + 1
            : 1,
          totalPages: totalNumberOfPages,
          result: transactionsResponse,
        });
      } else {
        return response.status(204).json({
          sucess: true,
          message: "No transactions were found",
          result: [],
        });
      }
    }
    if (previousBlockNumber) {
      const _transactions = await _getNormalTransactionsByBlockNumber(
        currentBlockNumber,
        previousBlockNumber.blockNumber,
        walletAddress
      );
      if (!_transactions.length > 0) {
        const transactioncount = await Transaction.count({
          walletAddress: walletAddress,
        });
        const totalNumberOfPages = parseInt(transactioncount / perPage);
        const transactionsResponse = await Transaction.find({
          walletAddress: walletAddress,
        })
          .skip(page ? perPage * parseInt(page) : "")
          .limit(perPage);

        return response.status(200).json({
          sucess: true,
          message: "Transaction found",
          nextPage: page
            ? parseInt(page) === parseInt(totalNumberOfPages)
              ? 0
              : parseInt(page) + 1
            : 1,
          totalPages: totalNumberOfPages,
          result: transactionsResponse,
        });
      }
      if (_transactions.length > 0) {
        const attachWalletAddressToTransaction =
          _attachWalletAddressToTransaction(_transactions, walletAddress);
        await Transaction.insertMany(attachWalletAddressToTransaction);
        const count = await Transaction.count({ walletAddress: walletAddress });
        const totalNumberOfPages = parseInt(count / perPage);
        const transactionsResponse = await Transaction.find({
          walletAddress: walletAddress,
        })
          .skip(page ? perPage * page : 0)
          .limit(perPage);

        return response.status(200).json({
          sucess: true,
          message: "Transaction found",
          nextPage: page
            ? parseInt(totalNumberOfPages) === parseInt(page)
              ? 0
              : parseInt(page) + 1
            : 1,
          totalPages: totalNumberOfPages,
          result: transactionsResponse,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      sucess: false,
      error: error.message,
    });
  }
};

module.exports = { GetTransactionByAddress };
