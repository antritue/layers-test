const crypto = require('crypto');
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const db = require('../utils/db')
const validateDevice = require('../utils/validator')

module.exports.create = async (event) => {
    const response = { statusCode: 201 };

    try {
        const body = JSON.parse(event.body);

        const { error, value } = validateDevice(body);
        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message })
            };
        }

        const id = body.id ? body.id : crypto.randomUUID()
        const params = {
            TableName: process.env.TABLE_NAME,
            Item: marshall({
                id,
                ...value
            }),
        };

        await db.send(new PutItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully created device.",
            data: { id, ...value },
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create device.",
            errorMessage: e.message,
        });
    }

    return response;
};
