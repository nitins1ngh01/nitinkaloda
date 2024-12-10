const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const JDoodleClientID = 'bfd55a887db0512278f726759f303bce';
const JDoodleClientSecret = 'fa8e5e06dbd1c86a679260741982db95fbe6efba0c364ed00a931fa48570e128';


app.post('/compile', async (req, res) => {
  const { code, input, language } = req.body;
  console.log(language);

  const requestPayload = {
      script: code,
      language: language,
      clientId: JDoodleClientID,
      versionIndex:0,
      clientSecret: JDoodleClientSecret,
      stdin: input,
  };



  try {
      const response = await axios.post('https://api.jdoodle.com/v1/execute', requestPayload);

      res.json({
          status: 'success',
          output: response.data.output,
      });
  } catch (error) {
      console.error('Error executing code:', error);
      res.json({
          status: 'error',
          message: 'Failed to execute code',
      });
  }
});

  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });