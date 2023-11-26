'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TopNav } from '@/components/TopNav';
import { IType } from '@/models/Type';

export const Form = ({
    createNewType,
}: {
    createNewType: (name: string) => Promise<{ type?: IType; error?: any }>;
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTypeName('');

        try {
            const { error } = await createNewType(typeName);

            if (error) {
                setLoading(false);
                setErrorMsg(error);
                return;
            }
            router.replace('/type');
        } catch (error: any) {
            setLoading(false);
            setErrorMsg(error);
        }
    };

    const getAddBtn = () => (
        <button
            type="submit"
            className={`${loading ? 'text-primary-600' : 'text-info-600'}`}
            disabled={loading}
            onClick={handleSave}
        >
            {loading ? 'loading...' : 'Add'}
        </button>
    );

    return (
        <>
            <TopNav right={getAddBtn()} />
            <div className="w-10/12 justify-self-center flex flex-col items-center gap-5">
                <div className="text-2xl p-4">Add New Card Type</div>
                <div className="w-full flex flex-col gap-0.5">
                    <label htmlFor="typeName" className="text-xs self-start">
                        CARD TYPE NAME
                    </label>
                    <input
                        required
                        type="name"
                        name="typeName"
                        value={typeName}
                        onChange={(evt) => setTypeName(evt.target.value)}
                        className="py-1 px-3 rounded-lg border border-primary-600"
                        disabled={loading}
                    />
                </div>

                <p className="text-xs text-danger-600 h-4">{errorMsg}</p>
            </div>
        </>
    );
};
