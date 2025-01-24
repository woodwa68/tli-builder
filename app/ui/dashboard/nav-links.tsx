'use client';


import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

const trees = [

  { name: 'God_of_Might' },
  { name: 'God_of_War' },
  { name: 'The_Brave' },
  { name: 'Marksman' },
  { name: 'Magister' },
  { name: 'Shadowdancer' },
  { name: 'Shadowmaster' },
  { name: 'Machinist' },
  { name: 'Goddess_of_Hunting' },
  { name: 'Goddess_of_Deception' },
  { name: 'Onslaughter' },
  { name: 'Bladerunner' },
  { name: 'Arcanist' },
  { name: 'Roning' },
  { name: 'Psychic' },
  { name: 'Steel_Vanguard' },
  { name: 'God_of_Machines' },
  { name: 'Goddess_of_Knowledge' },
  { name: 'Warlord' },
  { name: 'Druid' },
  { name: 'Elementalist' },
  { name: 'Ranger' },
  { name: 'Warlock' },
  { name: 'Alchemist' },
]

export default function NavLinks() {
  const pathname = usePathname();
  const search = useSearchParams()

  return (
    <>
      {trees.map((link) => {
        return (
          <Link
            key={link.name}
            href={'/dashboard?tree=' + link.name}
            className={clsx(
              'flex h-[36px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': !search.get('tree').indexOf(link.name),
              },
            )}
          >
            <DocumentDuplicateIcon className="w-6" />
            <p>{(link.name).replaceAll('_', ' ')}</p>
          </Link>
        );
      })}
    </>
  );
}
