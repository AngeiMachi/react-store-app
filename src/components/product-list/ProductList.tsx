import React, { useState } from 'react';
import { Product } from '../../models/product';
import ProductItem from './product-item/ProductItem';
import styles from './ProductList.module.scss';
interface ProductListProps {
  products: Product[];
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products,onClick,onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; 

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle pagination
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  return (
    <div className={styles.protductListContainer}>
      
      <div>
        {currentProducts.map((product) => (
          <div key={product.id} onClick={()=>onClick(product.id)}>
            <ProductItem product={product} onDelete={()=>onDelete(product.id)} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
