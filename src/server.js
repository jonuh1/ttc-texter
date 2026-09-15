import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';

const app = express();
app.use(express.urlencoded({ extended: false })); //Twilio sends form-encoded data, not JSON

app.post('/sms', async (req, res) => {

    const incomingMessage = req.body.Body; // the text the person sent
    console.log('Received: ', incomingMessage);


    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Hello, This is a test reply');
    
    res.type('text/xml');
    res.send(twiml.toString());

});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));