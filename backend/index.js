const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require("aws-sdk");
require('dotenv').config()

const PORT = 4000;

app.use(cors({
  origin: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
});

const docClient = new AWS.DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
});

app.post("/api/playbacks/:id", (req, res) => {
  const { id } = req.params;
  let { startDate, endDate } = req.body;
  console.log(startDate, endDate)
  const params = {
    TableName : "EscapeLog",
    IndexName: "GameId-Timestamp-index",
    KeyConditionExpression: "GameId = :g_id and #times BETWEEN :startDate AND :endDate",
    FilterExpression: "Move = :m_action",
    ExpressionAttributeNames: {
      "#times": "Timestamp"
    },
    ExpressionAttributeValues: {
      ":m_action": `{"action":"newgame"}`,
      ":g_id": id.toString(),
      ":startDate": startDate,
      ":endDate": new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString(),
    },
    ScanIndexForward: false,
  };
  
  docClient.query(params, async function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(400).send({
        result: JSON.stringify(err, null, 2)
      });
    } else {
      let list = [];
      // console.log("Query succeeded.", data);
      const result = data.Items.map(function(item) {
        return {
          Timestamp: item.Timestamp
        }
      });
      list.push(...result);
      let lastEvaluatedKey = data.LastEvaluatedKey;
      let count = 0;
      while(lastEvaluatedKey) {
        const newParams = Object.assign({}, params, { ExclusiveStartKey: lastEvaluatedKey });
        try {
          const response = await docClient.query(newParams).promise();
          const resList = response.Items.map(function(item) {
            return {
              Timestamp: item.Timestamp
            }
          });
          
          lastEvaluatedKey = response.LastEvaluatedKey
          list.push(...resList);
        } catch(err) {
          res.status(400).send({
            error: err
          });
        }
      }
      res.status(200).send({
        result: {
          list,
          lastEvaluatedKey
        }
      });
    }
  });
});

app.get("/api/playbacks/:id/:timestamp", (req, res) => {
  const { id, timestamp } = req.params;
  // const params = {
  //   TableName : "EscapeLog",
  //   FilterExpression: "Move = :m_action and GameId = :g_id and #dynobase_timestamp = :time",
  //   ExpressionAttributeNames: { "#dynobase_timestamp": "Timestamp" },
  //   ExpressionAttributeValues: {
  //     ":m_action": `{"action":"newgame"}`,
  //     ":g_id": id.toString(),
  //     ":time": timestamp.toString()
  //   }
  // };
  const params = {
    TableName : "EscapeLog"
  };
  
  docClient.scan(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(400).send({
        result: JSON.stringify(err, null, 2)
      });
    } else {
      console.log("Query succeeded.");
      res.status(200).send({
        result: data.Items
      });
    }
  });
});

app.listen(PORT, () => {
  console.log('Server is up!');
});
