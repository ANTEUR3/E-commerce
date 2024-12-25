import React, { useCallback, useContext, useMemo,useState } from 'react'
import { useEffect } from 'react';
import dropin from "braintree-web-drop-in";
import { useRef } from 'react';
import axios from 'axios';
import paypal from "../../assets/img/paypal.png";
import visa from "../../assets/img/visa.png";
import { Link, useParams } from 'react-router-dom';
import { ProductContext } from '../../Context/ProductContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from 'react-loading-spinner';
import { PulseLoader } from 'react-spinners';
import { AuthContext } from '../../Context/AuthContext';

const Payment = () => {
    const [token,setToken]=useState(null);
    const [nonce,setNonce]=useState(null);
    const dropInInstance = useRef(null);
    const navigate=useNavigate();
    const [price,setPrice]=useState(0)
    const [back,setBack]=useState(false)
    const {user,dispatch}=useContext(AuthContext);

  
   

  const Back=useCallback(()=>{

  navigate('/');},[])

    const { product, productDispatch,productContext,productListDispatch } = useContext(ProductContext);
       const {quantity}=useParams();
       const {productId}=useParams();
       useEffect(()=>{
       const productFound=productContext.find((p)=>p._id==productId)
       productDispatch({payload:productFound})
       },[productContext])
       useEffect(()=>{console.log(product)},[product])

       useEffect(()=>{
        if(quantity!=null && product!=null){
               if(quantity>=3){
                setPrice(quantity*product.price - 30)
               }
               else{
                setPrice(quantity*product.price)
               }
        }

       },[product,quantity])

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
  const ConfirmPurchase=()=>{
    
    
    const Total=quantity*product.price;
if(Total<=user.balance){
console.log('first')
axios
.post('http://localhost:5555/purchase', { productId: product._id, ...user, quantityP:quantity, Total:quantity*product.price })
.then((response) => {
console.log(response.data.newBalance.balance)
  
  dispatch({ type: 'incrementBalance', payload: { balance: response.data.newBalance.balance } })
  localStorage.setItem('user', JSON.stringify({ ...user, balance: user.balance - Total }))
  productListDispatch({ type: 'updateOne', payload: { product, quantity: quantity } })
  productDispatch({ payload: null })
  setBack(true)
  
})
.catch(() => {
  
})

}else{
setError('you can not buy , your balance is Not enough')

}
   
  
 
}
  useEffect(()=>{
    if(nonce!=null){
      axios
      .post('http://localhost:5555/payment',{amount:price,paymentMethodNonce:nonce})
      .then((response)=>{
        ConfirmPurchase();
            
      })
      .catch((error)=>{
           console.log(error)
      })
    }
  },[nonce])

  

  return (
    <div  className={`w-full h-screen flex flex-col  items-center px-[300px] pt-[100px] bg-gray-300 ${token && product ?'justify-start':'justify-center'}`}>
         {  token !=null ?<>
         <div id="dropin-container"></div>
         {!back?
         <div className='px-3 mt-5 flex justify-between items-center w-full'>
            <Link to={'/'} className="flex flex-col justify-center items-center py-2 bg-orange-600 w-1/6 hover:bg-orange-700 rounded-lg text-white font-bold text-xl"> 
                 Back
            </Link>
            <button onClick={handlePayment} className="flex flex-col justify-center items-center py-2 bg-black w-4/5 hover:bg-gray-700 rounded-lg text-white font-bold text-xl"> 
                 Pay {price} $
            </button>
            </div>:   <button 
            onClick={Back}
                
                className="rounded-xl flex flex-col justify-center items-center py-2 px-6 mt-5 bg-green-500 text-white text-xl font-semibold"
            >
                Back!
            </button>}
          
            </>:<PulseLoader color="#000" size={30} margin={8} />
          } 
    </div>
  )
}

export default Payment