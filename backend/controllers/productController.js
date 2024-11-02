import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

// Adding product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image4 && req.files.image5[0]

        const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

// Product List
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({
            success:true,
            products
        });
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

// Removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message: "Product Removed"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

// Get single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({success:true, product});
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

// Update Product details
const updateProduct = async (req, res) => {
    try {
        const { productId, oldImage=[], ...updateData } = req.body;
        
        let oldImageArray = JSON.parse(oldImage);
        // Extract images from request files
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0]; 

        // Create an array of images, filtering out undefined values
        const images = [image1, image2, image3, image4, image5].filter(item => item !== undefined);

        if (images.length > 0) {
            // Check and delete existing images from Cloudinary
            await Promise.all(
                oldImageArray.map(async (item) => {
                    try {
                        const parts = item.split('/');
                        const lastPart = parts.pop();
                        const publicIdWithFormat = lastPart.split('.')[0];
                        let result = await cloudinary.uploader.destroy(publicIdWithFormat, { resource_type: 'image' });
                        console.log(`Deleted image`, result);
                    } catch (error) {
                        console.error(`Error deleting image`, error);
                    }
                })
            );
        }
        

        // Upload new images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url; // Return the secure URL
                } catch (error) {
                    console.error(`Error uploading image: ${item.path}`, error);
                    return null; // Return null if upload fails
                }
            })
        );

        // Filter out any null values from imagesUrl
        updateData['image'] = imagesUrl.filter(url => url !== null);
        updateData['sizes'] = JSON.parse(updateData['sizes']);

        // Update product in the database
        await productModel.findByIdAndUpdate(productId, updateData, { new: true });

        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.json({ success: false, message: error.message });
    }
};


export {addProduct, listProducts, removeProduct, singleProduct, updateProduct}