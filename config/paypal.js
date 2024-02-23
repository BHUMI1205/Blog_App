import paypal from 'paypal-rest-sdk';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIEND_ID,
    client_secret: process.env.PAYPAL_SECRET_KEY,
})

export { paypal }