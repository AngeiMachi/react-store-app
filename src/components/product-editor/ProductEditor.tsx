import React, { useState, useEffect } from 'react';
import { Product } from '../../models/product'; 
import {  z } from 'zod';
import styles from './ProductEditor.module.scss';

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name must be 30 characters or less"),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),
  price: z.number().min(0.01, "Price must be greater than zero"),
});

interface ProductEditorProps {
  product: Product | null; 
  isCreateMode: boolean;
  onSave: (product: Product) => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, isCreateMode, onSave, ...props }) => {
  const [productName, setProductName] = useState(product?.name || '');
  const [productDescription, setProductDescription] = useState(product?.description || '');
  const [productPrice, setProductPrice] = useState(product?.price.toString() || '');
  const [productImage, setProductImage] = useState(product?.image || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const isSubmitDisabled = Object.keys(errors).length > 0;
  useEffect(() => {
    setProductName(product?.name || '');
    setProductDescription(product?.description || '');
    setProductPrice(product?.price.toString() || '');
    setProductImage(product?.image || '');
    setErrors({});
    if (isCreateMode) {
        validate();
    }
  }, [product]);

  const validate = () => {
    const parsed = productSchema.safeParse({
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
      });
  
      if (!parsed.success) {
        const newErrors: { [key: string]: string } = {};
        parsed.error.errors.forEach((err) => {
          if (err.path.length) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({});
      }
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    

    const newProduct: Product = {
      id: product ? product.id : Math.random().toString(36).substr(2, 9),
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      image: productImage,
      creationDate: isCreateMode ? new Date() : (product?.creationDate || new Date())
    };

    onSave(newProduct);
  };

  return (
    <div className={styles.productEditor} {...props}>
      <h2>{`Product Details ${isCreateMode ? '- New Product:' : ''}`}</h2>
      <form onSubmit={handleSubmit}>
        <img src={productImage} alt={productName} className={styles.productImage} />
        {isCreateMode && (
          <div className={styles.formGroup}>
            <label htmlFor="image">Image</label>
            <input 
              type="text"
              id="image"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              required
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input 
            type="text"
            id="name"
            value={productName}
            onChange={(e) => {
                setProductName(e.target.value)
                validate();
            }}
            required
          />
          <div className={styles.error}>
            {errors?.name && <p className={styles.error}>{errors.name}</p>}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            className={styles.descriptionInput}
            id="description"
            value={productDescription}
            onChange={(e) => {
                setProductDescription(e.target.value)
                validate();}
            }
          ></textarea>
          <div className={styles.error}>
                {errors?.description && <p className={styles.error}>{errors.description}</p>}
          </div>
          
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <div>
            <input
              type="number"
              id="price"
              value={productPrice}
              onChange={(e) => {
                setProductPrice(e.target.value)
                validate();
              }}
              required
            />
            <span>$</span>
          </div>
          <div className={styles.error}>
            {errors?.price && <p className={styles.error}>{errors.price}</p>}
          </div> 
        </div>
        <div className={styles.formActions }>
          <button type="submit" disabled={isSubmitDisabled} >{'save'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;
