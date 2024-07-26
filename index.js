import express from 'express';
import { createClient } from '@clickhouse/client';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const client = createClient({
  url: 'https://chvqyh6vdu.ap-south-1.aws.clickhouse.cloud',
  username: 'default',
  password: 'h8vPT7aZ1_FMN',
  database: 'default',
  isUseGzip: false,
  format: 'json',
});

app.use(bodyParser.json());

app.post('/insert', async (req, res) => {
  const { id, name } = req.body;

  try {
    await client.insert({
      table: 'clickhouse_js_example_table',
      values: [{ id, name }],
      format: 'JSONEachRow',
    });
    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting data');
  }
});

app.get('/data', async (req, res) => {
  try {
    const rows = await client.query({
      query: 'SELECT * FROM clickhouse_js_example_table',
      format: 'JSONEachRow',
    });
    res.json(await rows.json());
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
