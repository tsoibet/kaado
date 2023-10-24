'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import { Card } from '@/components/Card';
import { AddCardIcon } from '@/components/icons/AddCardIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { FilterIcon } from '@/components/icons/FilterIcon';
import { SortIcon } from '@/components/icons/SortIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { ICard } from '@/models/Card';
import { IType } from '@/models/Type';

export default function HomePage({
    cards,
    types,
}: {
    cards: ICard[] | undefined;
    types: IType[] | undefined;
}) {
    const sortOptions = [
        {
            name: 'By type Asc',
            func: (a: ICard, b: ICard) => {
                return a.type > b.type ? 1 : -1;
            },
        },
        {
            name: 'By type Desc',
            func: (a: ICard, b: ICard) => {
                return a.type > b.type ? -1 : 1;
            },
        },
        {
            name: 'By Creation Date Asc',
            func: (a: ICard, b: ICard) => {
                return a.created_at > b.created_at ? 1 : -1;
            },
        },
        {
            name: 'By Creation Date Desc',
            func: (a: ICard, b: ICard) => {
                return a.created_at > b.created_at ? -1 : 1;
            },
        },
    ];

    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    const [sortOption, setSortOption] = useState(0);
    const [filteredOption, setFilteredOption] = useState<string[]>(
        types?.map((type) => type._id as string) ?? []
    );

    const sortDropdownRef = useRef<HTMLDivElement | null>(null);
    const filterDropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(!isSortDropdownOpen);
    };
    const toggleFilterDropdown = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
            setIsSortDropdownOpen(false);
        }
        if (
            filterDropdownRef.current &&
            !filterDropdownRef.current.contains(event.target as Node)
        ) {
            setIsFilterDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleFilterChange = (typeId: string) => {
        if (filteredOption.includes(typeId)) {
            setFilteredOption(filteredOption.filter((item) => item !== typeId));
        } else {
            setFilteredOption([...filteredOption, typeId]);
        }
    };

    return (
        <>
            <header className="flex justify-between items-center">
                <div className="text-3xl font-bold">Kaado</div>
                <div className="flex gap-2">
                    <Link href="/cards/add">
                        <AddCardIcon />
                    </Link>
                    <div className="relative" ref={sortDropdownRef} onClick={toggleSortDropdown}>
                        <SortIcon />
                        {isSortDropdownOpen && (
                            <div
                                className={`origin-top-right absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-primary-50 overflow-hidden`}
                            >
                                {sortOptions.map((so, idx) => (
                                    <div
                                        key={`sort${idx}`}
                                        className="flex gap-2 px-4 py-2 text-xs text-primary-800 hover:bg-primary-200 last:border-none border-b border-b-primary-200"
                                        onClick={() => setSortOption(idx)}
                                    >
                                        <div className="w-3 self-center">
                                            {sortOption === idx ? <CheckIcon /> : <></>}
                                        </div>
                                        <div>{so.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {types && (
                        <div
                            className="relative"
                            ref={filterDropdownRef}
                            onClick={toggleFilterDropdown}
                        >
                            <FilterIcon />
                            {isFilterDropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-lg shadow-lg bg-primary-50 overflow-hidden">
                                    {types.map((type) => (
                                        <div
                                            key={type._id}
                                            className="flex gap-2 px-4 py-2 text-xs text-primary-800 hover:bg-primary-200 last:border-none border-b border-b-primary-200"
                                            onClick={() => handleFilterChange(type._id)}
                                        >
                                            <div className="w-3 self-center">
                                                {filteredOption.includes(type._id) ? (
                                                    <CheckIcon />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <div>{type.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <Link href="/user">
                        <UserIcon />
                    </Link>
                </div>
            </header>
            {cards?.length ? (
                <div className="justify-self-center flex flex-col">
                    {cards
                        .filter((card) => filteredOption.includes(card.type))
                        .sort(sortOptions[sortOption].func)
                        .map((card) => (
                            <Card key={card._id} card={card} />
                        ))}
                </div>
            ) : (
                <div className="p-4 self-center">
                    Keep all the cards you use every day all in one place.
                </div>
            )}
        </>
    );
}
