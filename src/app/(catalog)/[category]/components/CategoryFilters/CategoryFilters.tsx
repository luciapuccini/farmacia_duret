import type { ComponentPropsWithRef } from 'react';
import type { TCategory } from '@/types/types';
import CollapsibleSection from '../CollapsibleSection/collapsibleSection';
import styles from './CategoryFilters.module.scss';
import { Accordion } from '@/components/ui/accordion';
// import { Slug } from '../../page';

type TCategoryFiltersProps = ComponentPropsWithRef<'aside'> & {
  category: TCategory;
  activeSc?: string;
};

function CategoryFilters({ category, activeSc }: TCategoryFiltersProps) {
  return (
    <aside className={styles.sidebar}>
      <Accordion defaultValue={activeSc ? [activeSc] : []} multiple>
        {category.subcategories?.map((sc) => (
          <CollapsibleSection key={sc.name} subcategory={sc} />
        ))}
      </Accordion>
    </aside>
  );
}

export default CategoryFilters;
