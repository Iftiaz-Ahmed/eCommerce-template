import React, { useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate , useParams } from 'react-router-dom'

const EditProduct = ({token}) => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)
  const [image5,setImage5] = useState(false)

  const [image1Url,setImage1Url] = useState("")
  const [image2Url,setImage2Url] = useState("")
  const [image3Url,setImage3Url] = useState("")
  const [image4Url,setImage4Url] = useState("")
  const [image5Url,setImage5Url] = useState("")

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("Men");
   const [subCategory, setSubCategory] = useState("Topwear");
   const [bestseller, setBestseller] = useState(false);
   const [sizes, setSizes] = useState([]);
   const [oldImage, setOldImage] = useState([]);

   const getProductDetails = async ()=> {
    const response = await axios.post(backendUrl + "/api/product/single", { productId });

    if (response.data.success) {
      console.log(response.data.product)

      response.data.product.image?.[0] && setImage1Url(response.data.product.image[0]);
      response.data.product.image?.[1] && setImage2Url(response.data.product.image[1]);
      response.data.product.image?.[2] && setImage3Url(response.data.product.image[2]);
      response.data.product.image?.[3] && setImage4Url(response.data.product.image[3]);
      response.data.product.image?.[4] && setImage5Url(response.data.product.image[4]);

      response.data.product.name && setName(response.data.product.name);
      response.data.product.description && setDescription(response.data.product.description)
      response.data.product.category && setCategory(response.data.product.category)
      response.data.product.subCategory && setSubCategory(response.data.product.subCategory)
      response.data.product.price && setPrice(response.data.product.price)
      response.data.product.sizes && setSizes(response.data.product.sizes)
      response.data.product.image && setOldImage(response.data.product.image)
      response.data.product.bestseller && setBestseller(response.data.product.bestseller)
    } else {
      console.log(response.data.message);
    }
  }

  useEffect(()=> {
    getProductDetails()
  }, [token])

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("productId",productId)
      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      formData.append('oldImage', JSON.stringify(oldImage))

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)
      image5 && formData.append("image5",image5)

      const response = await axios.post(backendUrl + "/api/product/edit",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)

        setTimeout(()=> {
          navigate('/list');
        }, 3000)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
   }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <p className='mb-2 text-xl'>Edit Product</p>
        <div>
          <p className='mb-2'>Upload Image <span className='text-red-600'>(Upload all images again)</span></p>

          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1Url ? assets.upload_area : image1Url} alt="" />
              <input onChange={(e)=> { setImage1Url(URL.createObjectURL(e.target.files[0])); setImage1(e.target.files[0])}} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2Url ? assets.upload_area : image2Url} alt="" />
              <input onChange={(e)=> { setImage2Url(URL.createObjectURL(e.target.files[0])); setImage2(e.target.files[0])}} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3Url ? assets.upload_area : image3Url} alt="" />
              <input onChange={(e)=> { setImage3Url(URL.createObjectURL(e.target.files[0])); setImage3(e.target.files[0])}} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4Url ? assets.upload_area : image4Url} alt="" />
              <input onChange={(e)=> { setImage4Url(URL.createObjectURL(e.target.files[0])); setImage4(e.target.files[0])}} type="file" id="image4" hidden/>
            </label>
            <label htmlFor="image5">
              <img className='w-20' src={!image5Url ? assets.upload_area : image5Url} alt="" />
              <input onChange={(e)=> { setImage5Url(URL.createObjectURL(e.target.files[0])); setImage5(e.target.files[0])}} type="file" id="image5" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

            <div>
              <p className='mb-2'>Product category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Sub category</p>
              <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Product Price</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
            </div>

        </div>

        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter( item => item !== "S") : [...prev,"S"])}>
              <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>S</p>
            </div>
            
            <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter( item => item !== "M") : [...prev,"M"])}>
              <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>M</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter( item => item !== "L") : [...prev,"L"])}>
              <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>L</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter( item => item !== "XL") : [...prev,"XL"])}>
              <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XL</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter( item => item !== "XXL") : [...prev,"XXL"])}>
              <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XXL</p>
            </div>
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <div className='flex gap-10'>
          <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>Edit</button>
          <button onClick={() => navigate('/list')} className='w-28 py-3 mt-4 bg-red-600 text-white'>Cancel</button>
        </div>
        
    </form>
  )
}

export default EditProduct
