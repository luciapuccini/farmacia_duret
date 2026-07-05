import productsData from '@/services/catalog/data/products.json';

export function getProducts(url: { [key: string]: string }) {
  const { category, subcategory, filter } = url;

  return productsData.filter((product) => {
    if (product.category !== category) return false;
    if (subcategory && product.subcategory !== subcategory) return false;
    if (filter && product.filter !== filter) return false;
    return true;
  });
}
