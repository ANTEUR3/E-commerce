import React, { useContext,useState,useEffect } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { ProductContext } from '../../Context/ProductContext';
import NavBarè from "../../components/NavBarè";
import { TbTruckDelivery } from "react-icons/tb";
import { LuFileDown } from "react-icons/lu";
import axios from 'axios';
const ProductBrows = ({handleConfirm,setQuantiy,quantity}) => {
    const {user,dispatch}=useContext(AuthContext);
    const {product,productDispatch}=useContext(ProductContext);
    const [productWithSameType, setProductWithSameType] = useState([]);
    const [error,setErorr]=useState('')
    const { productContext, productListDispatch } = useContext(ProductContext);
    const [confirm,setConfirm]=useState(false);
    const decrementQuantity=()=>{
        setErorr('')
        if(quantity>1){
          setQuantiy(quantity-1)
        }
      }
      const incrementQuantity=()=>{
        setErorr('')
        if(quantity<product.quantity){
          setQuantiy(quantity+1)
        }
      }
      
  const addToCart=(id)=>{
    axios
    .post('http://localhost:5555/cart',{userId:user.userId,productId:id})
    .then((response)=>{
  console.log(response)
    })
    .catch((error)=>{
  console.log(error)
    })
  }  

      const goToConfirm=()=>{
        if(user!=null){
          
          handleConfirm()
        }else{
          navigate('/Singin')
        }
       }
      
       const goToAddToCart=()=>{
        if(user!=null){
          addToCart(product._id)
        }else{
          navigate('/Singin')
        }
       }

      useEffect(() => {
        if(product !=null){
          const productType = productContext.filter(
            (pro) => pro.productType == product.productType
          );
          setProductWithSameType(productType);
        }
        else{
          setConfirm(false)
        }
        
        setQuantiy(1);
      }, [product]);

      const displayProductWithSameType = [...Array(4)].map((_, i) => {
        if (productWithSameType.length > i) {
          return (
            <img
            onClick={()=>{productDispatch({payload:productWithSameType[i]})}}
              key={i}
              src={productWithSameType[i].imgUrl}
              className="w-[67px] h-[67px] cursor-pointer"
            />
          );
        } else {
          return "";
        }
      });
  return (
    <div>
          <NavBarè/>
          <div className="px-10 w-full pt-3">
            <p className="text-md text-gray-600 ">
              Electronics / {product.productType} /{" "}
              <span className="text-black font-semibold">{product.name}</span>
            </p>
            <div className="w-full flex justify-start items-center px-5 ">
              <div className="relative flex flex-col gap-y-5 justify-start items-center pt-3 border w-1/2">
              <button  onClick={()=>{productDispatch({payload:null})}} className="absolute flex flex-col justify-center items-center py-1  w-[120px] left-3 top-3  rounded-lg text-black font-bold text-lg bg-gray-200 "> 
                 Back
            </button>
                <div className="flex flex-col justify-center items-center px-6 py-6 w-full ">
                  <img
                    src={product.imgUrl}
                    className="w-[300px] h-[300px]"
                    alt=""
                  />
                </div>
                <div className=" flex justify-start items-center px-2 gap-x-7 w-1/2 mx-auto">
                  {displayProductWithSameType}
                </div>
              </div>
              <div className="w-1/2 border py-5 px-10">
                <p className=" font-bold text-3xl">{product.name}</p>
                <p className="text-gray-600 px-3">{product.description}</p>
                <p className="font-bold text-2xl  pt-3">{product.price} $</p>
                <p className="text-gray-600 px-3 ">suggetion: buy 3 article by {product.price*3 -30} $</p>
                
                <div className="pt-8 flex justify-start items-center gap-x-6 w-full">
                  <div className="cursor-pointer flex justify-start items-center gap-x-7 bg-gray-400 px-3 ">
                    <p onClick={decrementQuantity} className="text-2xl font-semibold hover:text-white">-</p>
                    <p className="text-xl font-semibold">{quantity}</p>
                    <p onClick={incrementQuantity} className="text-2xl font-semibold hover:text-white">+</p>

                  </div>
                  <div className="">
                    <p className="text-gray-600 text-sm">only <span className="font-semibold text-orange-600">{product.quantity} item </span> Left !</p>
                    <p className="text-gray-600 text-sm">Don't miss it</p>
                  </div>

                </div>

                <div className=" pt-5 flex justify-start items-center gap-x-5 ">
                  <button onClick={goToConfirm} className="hover:bg-gray-800 hover:border-gray-800  border border-orange-600 px-6 py-2 bg-orange-600 text-white  font-semibold ">Buy Now</button>
                  <button onClick={goToAddToCart} className=" hover:text-white hover:bg-green-800 hover:border-green-800  px-6 py-2 bg-white text-black border border-black  font-semibold ">Add to Cart</button>
                </div>

                <div>
                  <div className="flex justify-start items-center pt-7 gap-x-3">
<TbTruckDelivery className="text-black font-semibold text-2xl"/>
<p className="text-md font-semibold text-black">Delivery</p>
                  </div>
                  <p className="px-7 text-gray-600 text-sm"> enter your postal code for free delivery</p>
                </div>
                <div className="flex flex-col jutify-start items-start pt-3">
                  <div className="flex justify-start items-center gap-x-3 ">
                     <LuFileDown className="text-black font-semibold text-2xl"/>
                     <p className="text-md font-semibold text-black">Return Delivery</p>
                  </div>
                  <div className="w-full px-7 text-gray-600 text-sm">
                    Free 30 Day Delivery Returns Details
                  </div>

                </div>
                <div className="w-full flex justify-center items-center pt-3 text-xl text-red-800 font-semibold">
                  {error} 
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ProductBrows