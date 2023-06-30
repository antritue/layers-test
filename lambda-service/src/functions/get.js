const db = require('../utils/db')
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

module.exports.get = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: marshall({ id: event.pathParameters.id }),
        };
        const { Item } = await db.send(new GetItemCommand(params));

        if (Item) {
            response.body = JSON.stringify({
                message: "Successfully retrieved device.",
                data: unmarshall(Item)
            })
        } else {
            response.statusCode = 404;
            response.body = JSON.stringify({
                message: "ID does not exist."
            });
        }

    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get device.",
            errorMessage: e.message,
        });
    }

    return response;
};
