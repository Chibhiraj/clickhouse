import express from 'express';
import { createClient } from '@clickhouse/client';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const client = createClient({
  url: 'https://chvqyh6vdu.ap-south-1.aws.clickhouse.cloud',
  username: 'default',
  password: 'h8vPT7aZ1_FMN',
  database: 'default',
  isUseGzip: false,
  format: 'json',
});


app.post('/insert', async (req, res) => {
  const { id, name } = req.body;

  try {
    await client.insert({
      table: 'users',
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
      query: 'SELECT * FROM users',
      format: 'JSONEachRow',
    });
    res.json(await rows.json());
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  } 
});


app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const {  name } = req.body;

  try {
    await client.query({
      query: `ALTER TABLE users UPDATE  name = '${name}' WHERE id = '${id}'`,
      format: 'JSONEachRow',
    });
    res.status(200).send('Data updated successfully');
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});

app.delete('/delete/:uuid', async (req, res) => {
  const { uuid } = req.params;
  try {
    const rows = await client.query({
      query: `ALTER TABLE users DELETE WHERE uuid  = '${uuid}'`,
      format: 'JSONEachRow',
    });
    res.json(await rows.json());
  } catch (error) {
    console.error('Error Deleting data:', error);
    res.status(500).send('Error Deleting data');
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
