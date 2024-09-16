import React from 'react';
import { Product } from '../../../models/product';
import styles from './ProductItem.module.scss';
interface ProductItemProps {
    product: Product;
    onDelete: (id: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({product,onDelete,...props}) => {

    return (
     <div className={styles.productItem} {...props}>
        <img src={product.image} alt={product.name} className={styles.productImage} />
        <div className={styles.productDetails}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productDescription}>{product.description}</p>
          <p className={styles.productPrice}>${product.price}</p>
        </div>
        <button className={styles.deleteButton} onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
         }} >
          Delete
        </button>
      </div>
    );
};

export default ProductItem;
