import { document } from "../utils/dynamodbClient";

export const handle = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": user_id,
      },
    })
    .promise();

  const userAlreadyExists = response.Items[0];

  if (!userAlreadyExists) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "User does not exists.!",
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
  }

  const responseTodos = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "user_id = :id",
      ExpressionAttributeValues: {
        ":id": user_id,
      },
    })
    .promise();

    const todos = responseTodos.Items;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificate created!",
        todos
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
};
