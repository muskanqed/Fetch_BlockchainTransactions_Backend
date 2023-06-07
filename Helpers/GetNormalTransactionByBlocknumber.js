const axios = require('axios');
require('dotenv').config();

const _getNormalTransactionsByBlockNumber = async (currentBlockNumber,previousBlockNumber,walletAddress) =>{
    try{
        const etherScanAPIKey = process.env.ETHERSCAN_API || '';
        const response = await axios.default.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=${previousBlockNumber}&endblock=${currentBlockNumber}&sort=asc&apikey=${etherScanAPIKey}`);
        return response.data.result;
    }
    catch{
        throw new Error(error.message);
    }
};

module.exports = _getNormalTransactionsByBlockNumber;
