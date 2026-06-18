import productsData from '@/services/catalog/data/products.json';

export type TProduct = (typeof productsData)[number];

export function getProducts(url: { [key: string]: string }) {
  const { category, subcategory, filter } = url;

  let productsFiltered: TProduct[] = [];

  if (filter) {
    productsFiltered = productsData.filter((product) => {
      if (
        product.filter === filter &&
        product.subcategory === subcategory &&
        product.category === category
      ) {
        console.log('caso 1');
        return product;
      }
      return null;
    });
  } else {
    productsFiltered = productsData.filter((product) => {
      if (product.subcategory === subcategory && product.category === category) {
        return product;
      }
      return null;
    });
  }

  return productsFiltered;
}
