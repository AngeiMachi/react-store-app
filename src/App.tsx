import styles from './App.module.scss'; 
import ProductList from './components/product-list/ProductList';
import ProductEditor from './components/product-editor/ProductEditor';
import ActionBar from './components/action-bar/ActionBar';
import { productData } from './models/data';
import { useState, useEffect } from 'react';
import { Product } from './models/product';
import { useNavigate, useParams } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'creationDate'>('name');
  const [productList, setProductList] = useState<Product[]>(localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products') || '') : productData);

  const filteredAndSortedProducts = productList
    .filter((product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      return (sortOption === 'name' ? a.name.localeCompare(b.name) : new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
    });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [isCreateMode, setIsCreated] = useState<boolean>(!!newProduct);

  useEffect(() => {
    if (id) {
      const selectedProduct = productList.find((product: Product) => product.id === id);
      if (selectedProduct) {
        setIsCreated(false);
        setSelectedProduct(selectedProduct);
    } else {
      setSelectedProduct(null); 
    }
  }
  }, [id, productList]);

  const handleProductSelection = (id: string) => {
    setIsCreated(false);
    const selectedProduct = productList.find((product: Product) => product.id === id);
    if (selectedProduct) {
      setSelectedProduct(selectedProduct);
      navigate(`/products/${id}`); 
    }
  };

  const handleProductSave = (product: Product) => {
    if (isCreateMode) {
      const updatedProducts = [...productList, product];
      setProductList(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setIsCreated(false);
      setNewProduct(null);
    } else {
      const updatedProducts = productList.map((p: Product) => (p.id === product.id ? product : p));
      setProductList(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const handleProductDelete = (id: string) => {
    const updatedProducts = productList.filter((product: Product) => product.id !== id);
    setProductList(updatedProducts);

    if (selectedProduct?.id === id || updatedProducts.length === 0) {
      setSelectedProduct(null);
    }
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleAddProduct = () => {
    const newProductInit: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: 0,
      description: '',
      image: '', 
      creationDate: new Date(),
    };
    setIsCreated(true);
    setNewProduct(newProductInit);
    navigate('/products/');
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>My Store</h1>
      </header>
      <ActionBar
        onAdd={handleAddProduct}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      <div className={styles.container}>
        <div className={styles.sideBySide}>
          <ProductList products={filteredAndSortedProducts} onClick={(id) => handleProductSelection(id)} onDelete={(id) => handleProductDelete(id)} />
          {(selectedProduct || isCreateMode) && <ProductEditor isCreateMode={isCreateMode} product={isCreateMode ? newProduct : selectedProduct} onSave={(product) => handleProductSave(product)} />}
        </div>
      </div>
    </>
  );
}

export default App;
