import {APIGatewayProxyHandler} from 'aws-lambda';
import { document } from 'src/utils/dynamodbClient';

export const handle: APIGatewayProxyHandler = async (event) =>{
    const {userId} = event.pathParameters;
    
    const response = await document.query({
        TableName: "todos",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    }).promise();

    const todos = response.Items;

    if(!todos){
        return{
            statusCode: 204,
            body: JSON.stringify({
                error: "Usuário sem todos :/"
            }),
            headers:{
                "Content-Type": "application/json"
            }
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            todos: todos
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}