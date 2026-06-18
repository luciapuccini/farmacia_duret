'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { TSubcategory } from '@/types/types';
import { Checkbox } from '@/components/ui/checkbox';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { nameToSlug } from '@/utils/nameToSlug';

type CollapsibleSectionProps = {
  subcategory: TSubcategory;
};

const CollapsibleSection = ({ subcategory }: CollapsibleSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeF = searchParams.get('f');

  function setFilter(url: string) {
    router.push(url);
  }

  return (
    <AccordionItem value={nameToSlug(subcategory.name)}>
      <AccordionTrigger>{subcategory.name}</AccordionTrigger>
      <AccordionContent>
        <ul className="flex flex-col gap-2 py-1">
          {subcategory.filters?.map((f) => {
            const filterF = new URL(f.url, 'http://x').searchParams.get('f');
            return (
              <li key={f.url} className="flex items-center gap-2">
                <Checkbox
                  id={f.url}
                  checked={activeF === filterF}
                  onCheckedChange={() => setFilter(f.url)}
                />
                <label htmlFor={f.url} className="cursor-pointer text-sm">
                  {f.name}
                </label>
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CollapsibleSection;
