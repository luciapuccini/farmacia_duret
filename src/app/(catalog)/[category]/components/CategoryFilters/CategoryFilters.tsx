import type { ComponentPropsWithRef } from 'react';
import type { TCategory } from '@/types/types';
import CollapsibleSection from '../CollapsibleSection/collapsibleSection';

import { Accordion } from '@/components/ui/accordion';

type TCategoryFiltersProps = ComponentPropsWithRef<'aside'> & {
  category: TCategory;
  activeSc?: string;
};

function CategoryFilters({ category, activeSc }: TCategoryFiltersProps) {
  return (
    <aside className="w-60">
      <Accordion defaultValue={activeSc ? [activeSc] : []} multiple>
        {category.subcategories?.map((sc) => (
          <CollapsibleSection key={sc.name} subcategory={sc} />
        ))}
      </Accordion>
    </aside>
  );
}

export default CategoryFilters;
