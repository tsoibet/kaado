'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TopNav } from '@/components/TopNav';
import { IType } from '@/models/Type';

export const Form = ({
    name,
    editType,
    removeType,
}: {
    name: string;
    editType: (typeName: string) => Promise<{ type?: IType; error?: any }>;
    removeType: () => Promise<{ type?: IType; error?: any }>;
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [typeName, setTypeName] = useState(name);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await editType(typeName);

            setLoading(false);
            if (error) {
                setErrorMsg(error);
                return;
            }
            router.replace('/type');
        } catch (error: any) {
            setLoading(false);
            setErrorMsg(error);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            const isConfirm = window.confirm('This type will be deleted.');
            if (!isConfirm) {
                return;
            }
            const { error } = await removeType();
            if (error) {
                setErrorMsg(error);
                return;
            }
            router.replace('/type');
        } catch (error: any) {
            setErrorMsg(error);
        }
    };

    const getSaveBtn = () => (
        <button
            type="submit"
            className={`${loading ? 'text-primary-600' : 'text-info-600'}`}
            disabled={loading}
            onClick={handleSave}
        >
            {loading ? 'loading...' : 'Save'}
        </button>
    );
    const getDeleteBtn = () => (
        <button type="submit" className="text-danger-600 font-bold" onClick={handleDelete}>
            Delete
        </button>
    );

    return (
        <>
            <TopNav left={getDeleteBtn()} right={getSaveBtn()} />
            <div className="text-center">
                <div className="text-2xl m-4">Edit Card Type</div>
                <div className="text-2xl m-4 mt-8">Card Type Name</div>
                <div>
                    <input
                        required
                        type="name"
                        name="typeName"
                        value={typeName}
                        onChange={(evt) => setTypeName(evt.target.value)}
                        disabled={loading}
                        className="border text-center"
                    />
                </div>
                {errorMsg && <p className="text-center bg-red-300 py-4 mb-6 rounded">{errorMsg}</p>}
            </div>
        </>
    );
};
