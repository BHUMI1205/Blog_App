import paypal from 'paypal-rest-sdk';

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIEND_ID,
    client_secret: process.env.PAYPAL_SECRET_KEY,
})

export { paypal }