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
            <div className="text-center">
                <div className="text-2xl m-4">Add New Card Type</div>
                <div className="text-2xl m-4 mt-8">Card Type Name</div>
                <div>
                    <input
                        required
                        type="name"
                        name="typeName"
                        value={typeName}
                        onChange={(evt) => setTypeName(evt.target.value)}
                        className="border text-center"
                        disabled={loading}
                    />
                </div>
                {errorMsg && <p className="text-center bg-red-300 py-4 mb-6 rounded">{errorMsg}</p>}
            </div>
        </>
    );
};
