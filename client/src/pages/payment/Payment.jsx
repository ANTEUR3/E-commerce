import React, { useContext, useMemo,useState } from 'react'
import { useEffect } from 'react';
import dropin from "braintree-web-drop-in";
import { useRef } from 'react';
import axios from 'axios';
import paypal from "../../assets/img/paypal.png";
import visa from "../../assets/img/visa.png";
import { Link, useParams } from 'react-router-dom';
import { ProductContext } from '../../Context/ProductContext';
const Payment = () => {
    const [token,setToken]=useState(null);
    const [nonce,setNonce]=useState(null);
    const dropInInstance = useRef(null);
    
    const { product, productDispatch,productContext,productListDispatch } = useContext(ProductContext);
       const {quantity}=useParams();
       const {productId}=useParams();
       useEffect(()=>{
       const productFound=productContext.find((p)=>p._id==productId)
       productDispatch({payload:productFound})
       },[productContext])
       useEffect(()=>{console.log(product)},[product])

  useEffect(()=>{
    axios
    .get('http://localhost:5555/clientToken')
    .then((response)=>{
            setToken(response.data.token)     
    })
    .catch((error)=>{
      console.log(error)
    })
  },[])

  useEffect(()=>{
    if(token!=null){
      const container = document.getElementById('dropin-container');
      container.innerHTML = '';
      dropin.create(
        {
            authorization: token.clientToken,
            container: '#dropin-container',
        },
        (err, instance) => {
            if (err) {
                console.error(err);
                return;
            }
            dropInInstance.current = instance;
        }
    );
    }

  },[token])
  useEffect(()=>{console.log(dropInInstance.current)},[dropInInstance.current])

  const handlePayment = (e) => {
    e.preventDefault();
    dropInInstance.current.requestPaymentMethod((err, payload) => {
      if (err) {
        console.error(err);
      } else {
        setNonce(payload.nonce);
        
      }
    });
    
  };
  useEffect(()=>{
    if(nonce!=null){
      axios
      .post('http://localhost:5555/payment',{amount:230,paymentMethodNonce:nonce})
      .then((response)=>{
            console.log(response)
      })
      .catch((error)=>{
           console.log(error)
      })
    }
  },[nonce])

  const handleSubmit = () => {
    // Send the nonce to your server-side endpoint
    fetch('/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nonce,
        amount: 10.00
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Payment successful!');
      } else {
        console.error('Payment failed:', data.error);
      }
    })
    .catch(error => {
      console.error('Error processing payment:', error);
    });
  };

  return (
    <div  className='w-full h-screen flex flex-col justify-start items-center px-[300px] pt-[100px] bg-gray-300'>
         {product !=null?<><div id="dropin-container"></div><div className='px-3 mt-5 flex justify-between items-center w-full'>
            <Link to={'/'} className="flex flex-col justify-center items-center py-2 bg-orange-600 w-1/6 hover:bg-orange-700 rounded-lg text-white font-bold text-xl"> 
                 Back
            </Link>
            <button onClick={handlePayment} className="flex flex-col justify-center items-center py-2 bg-black w-4/5 hover:bg-gray-700 rounded-lg text-white font-bold text-xl"> 
                 Pay {product.price * quantity} $
            </button>
            </div></>:''} 
    </div>
  )
}

export default Payment