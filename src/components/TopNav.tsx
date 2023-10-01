'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
/**
 * React Component that serves as top nav bar. If left button is not defined, a back button which navigates back to the previous route in the browser’s history stack will be shown.
 */
export function TopNav(props: { left?: JSX.Element & ReactNode; right?: JSX.Element & ReactNode }) {
    const router = useRouter();

    const leftBtn = props.left ?? <div onClick={() => router.back()}>← Back</div>;

    return (
        <div className="flex justify-between items-center">
            <div className="flex cursor-pointer">{leftBtn}</div>
            <div className="flex cursor-pointer">{props.right}</div>
        </div>
    );
}
