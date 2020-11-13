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

app.get("/api/playbacks/:id", (req, res) => {
  const { id } = req.params;
  const params = {
    TableName : "EscapeLog",
    FilterExpression: "Move = :m_action and GameId = :g_id",
    ExpressionAttributeValues: {
      ":m_action": `{"action":"newgame"}`,
      ":g_id": id.toString()
    }
  };
  
  docClient.scan(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          res.status(400).send({
            result: JSON.stringify(err, null, 2)
          });
      } else {
          console.log("Query succeeded.");
          var list = data.Items.map(function(item) {
            return {
              Timestamp: item.Timestamp
            }
          })
          res.status(200).send({
            result: list
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
