const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const db = require('../utils/db')

module.exports.list = async (event) => {
    const response = { statusCode: 200 };

    try {
        const { Items } = await db.send(new ScanCommand({ TableName: process.env.TABLE_NAME }));

        response.body = JSON.stringify({
            message: "Successfully retrieved all devices.",
            data: Items.map((item) => unmarshall(item)),
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve devices.",
            errorMessage: e.message,
        });
    }

    return response;
};
