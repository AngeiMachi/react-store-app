import React from 'react';
import styles from './ActionBar.module.scss';

type SortOption = 'name' | 'creationDate';

interface ActionBarProps {
  searchTerm: string;
  sortOption: SortOption;
  onAdd: () => void;
  onSearchChange: (searchTerm:string) => void;
  onSortChange: ( sortOption: SortOption) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ searchTerm,sortOption,onAdd, onSearchChange, onSortChange }) => {
  return (
    <div className={styles.actionBar}>
      <button className={styles.addButton} onClick={onAdd}>+ Add</button>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search products"
        value={searchTerm}
        onChange={(e)=>onSearchChange(e.target.value)}
      />
      <select className={styles.filterSelect} value={sortOption} onChange={(e)=>onSortChange(e.target.value as SortOption)}>
        <option value="name">Sort by Name</option>
        <option value="creationDate">Sort by Creation Date</option>
      </select>
    </div>
  );
};

export default ActionBar;
