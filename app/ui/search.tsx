'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, SyntheticEvent, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

type InvoiceSearchInput = {
  value: string;
};

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const { register, watch } = useForm<InvoiceSearchInput>({
    defaultValues: { value: searchParams.get('query')?.toString() || '' },
  });

  const [searchValue] = watch(['value']);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set('page', '1');

    const timeoutId = setTimeout(() => {
      if (searchValue) {
        urlSearchParams.set('query', searchValue);
      } else {
        urlSearchParams.delete('query');
      }
      replace(`${pathName}?${urlSearchParams.toString()}`);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        value={searchValue}
        {...register('value')}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
