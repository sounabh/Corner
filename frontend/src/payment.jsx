/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';


const PaymentButton = () => {
    const amount = "100"

  const handlePayment = async () => {
    try {
      // Make API call to backend to create payment session
     /* const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_BASE_URL}/payment/create-checkout`, {
        amount,
        productId
      });
      
      // Redirect to Stripe checkout page
      //window.location.href = response.data.url;
    console.log(response);*/
   
    
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Pay ${amount}
    </button>
  );
};

export default PaymentButton;