import React, { useState } from 'react';
import './App.css';

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

const __DEV__ = document.domain === 'localhost';

function App() {
    const [name, setName] = useState('Mehul');
    const [paymentDetails, setPaymentDetails] = useState({});

    async function displayRazorpay() {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const data = await fetch('https://razorpay-backend-33fwfket3q-el.a.run.app/razorpay', { method: 'POST' }).then((t) =>
            t.json()
        );

        const options = {
            key: "rzp_live_QygxIzCeS0vaNt", //'ZJ2kYrxRWYUWIDOolE4IGGoV',
            currency: data.currency,
            amount: data.amount.toString(),
            order_id: data.id,
            name: 'equaljustice.ai',
            description: 'Thank you for nothing. Please give us some money',
            handler: function(response) {
                setPaymentDetails(response);
            },
            prefill: {
                name,
                email: 'sdfdsjfh2@ndsfdf.com',
                phone_number: '9899999999'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
                    <div className="App">
                <header className="App-header">
                    <p>Equaljustice.ai</p>
                    <button onClick={displayRazorpay} className="App-link">
                        Pay via Razorpay
                    </button>
                    <p>Do not close this window. You will get the Order ID on this webpage after your payment is confirmed by Razorpay. Copy the Order ID and paste it in the Custom ChatGPT chat window to continue with your session. The Order ID is only valid for one session on our CustomGPT and will also have a certain time limit within which you need to complete your session.</p>
                    {paymentDetails.razorpay_payment_id && (
                        <div className="payment-details">
                            <p>Payment ID: {paymentDetails.razorpay_payment_id}</p>
                            <p>Order ID: {paymentDetails.razorpay_order_id}</p>
                            <p>Signature: {paymentDetails.razorpay_signature}</p>
                        </div>
                    )}
                </header>
            </div>
    );
}

export default App;