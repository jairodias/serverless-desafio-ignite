import { document } from "../utils/dynamodbClient";

import { v4 as uuid } from "uuid";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

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

  await document
    .put({
      TableName: "users_certificates",
      Item: {
        id: uuid(),
        user_id,
        title,
        done: false,
        deadline: new Date(deadline),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Created!",
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
