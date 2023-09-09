'use client';

import styles from './Button.module.css';

type ButtonProps = {
    icon: string;
    onClickHandler: () => void;
};

export function Button({ icon, onClickHandler }: ButtonProps) {
    return (
        <div onClick={() => onClickHandler()} className={styles.button}>
            {icon}
        </div>
    );
}
