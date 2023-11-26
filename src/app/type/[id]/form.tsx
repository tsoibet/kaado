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
            <div className="w-10/12 justify-self-center flex flex-col items-center gap-5">
                <div className="text-2xl p-4">Edit Card Type</div>
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
                        disabled={loading}
                        className="py-1 px-3 rounded-lg border border-primary-600"
                    />
                </div>
                <p className="text-xs text-danger-600 h-4">{errorMsg}</p>
            </div>
        </>
    );
};
