'use client';

import { ReactNode } from 'react';

type ButtonProps = {
    icon: ReactNode;
    onClickHandler: () => void;
};

export function Button({ icon, onClickHandler }: ButtonProps) {
    return <div onClick={() => onClickHandler()}>{icon}</div>;
}
