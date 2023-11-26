'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import { TopNav } from '@/components/TopNav';
import { convertImgToBase64 } from '@/lib/imageConvertor';
import { ICard } from '@/models/Card';
import { IType } from '@/models/Type';
import CardAdaptor from '@/services/CardAdaptor';

export function Form({
    handleUpdateCard,
    cardData,
    getTypesResult,
}: {
    handleUpdateCard: ({
        image_front,
        image_back,
        name,
        type_id,
        number,
        note,
    }: {
        image_front: string;
        image_back: string;
        name: string;
        type_id: string;
        number: string;
        note: string;
    }) => Promise<{ id?: string; error?: string }>;
    cardData: ICard;
    getTypesResult: {
        types?: IType[];
    };
}) {
    const [card, setCard] = useState<{
        image_front: string;
        type_id: string;
        image_back?: string;
        name?: string;
        number?: string;
        note?: string;
    }>({
        image_front: cardData.image_front,
        type_id: cardData.type,
        image_back: cardData.image_back,
        name: cardData.name,
        number: cardData.number,
        note: cardData.note,
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    function handleImgChange(event: ChangeEvent<HTMLInputElement>) {
        const { name } = event.target;
        const file = event.target.files && event.target.files[0];
        if (!file) {
            setCard({ ...card, [name]: '' });
            return;
        }
        const reader = new FileReader();
        convertImgToBase64(
            reader,
            file,
            ({ resizedImgStr, error }: { resizedImgStr?: string; error?: string }) => {
                if (error) {
                    console.log(error);
                }
                setCard({ ...card, [name]: resizedImgStr ?? '' });
            }
        );
    }

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = event.target;
        setCard({ ...card, [name]: value });
    }

    async function saveBtnClickHandler(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        try {
            const { id, error } = await handleUpdateCard(new CardAdaptor(card));

            setLoading(false);
            if (id) {
                router.replace(`/cards/detail/${id}`);
            }
            if (error) {
                setErrorMsg(error);
            }
            return;
        } catch (error) {
            setLoading(false);
            setErrorMsg('Failed to add card');
        }
    }

    function getRightBtn() {
        return (
            <input
                type="submit"
                className={`${loading ? 'text-primary-600' : 'text-info-600'} cursor-pointer`}
                disabled={loading}
                value={loading ? 'loading...' : 'Save'}
            />
        );
    }

    function getLeftBtn() {
        return (
            <Link href={`/cards/detail/${cardData._id}`} className="text-danger-600">
                Cancel
            </Link>
        );
    }

    return (
        <form
            onSubmit={saveBtnClickHandler}
            className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-6"
        >
            <TopNav left={getLeftBtn()} right={getRightBtn()} />
            <div className="w-10/12 justify-self-center flex flex-col items-center gap-1.5">
                <p className="text-xs text-danger-600 h-4">{errorMsg}</p>
                <div className="w-full flex flex-col items-center">
                    <p className="text-xs">FRONT</p>
                    <input
                        id="image_front"
                        name="image_front"
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleImgChange(event)}
                        disabled={loading}
                        className="h-0 w-0 hidden"
                    />
                    <label
                        htmlFor="image_front"
                        className={`w-36 h-24 overflow-hidden rounded-xl border border-primary-400 ${
                            !loading && 'cursor-pointer'
                        }`}
                    >
                        <img
                            src={card.image_front || 'https://placehold.co/600x400?text=Required'}
                            alt="Image Preview for Front side"
                            className="w-full h-full object-cover object-center"
                        />
                    </label>
                </div>
                <div className="w-full flex flex-col items-center pb-1">
                    <p className="text-xs">BACK</p>
                    <input
                        id="image_back"
                        name="image_back"
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleImgChange(event)}
                        disabled={loading}
                        className="h-0 w-0 hidden"
                    />
                    <label
                        htmlFor="image_back"
                        className={`w-36 h-24 overflow-hidden rounded-xl border border-primary-400 ${
                            !loading && 'cursor-pointer'
                        }`}
                    >
                        <img
                            src={card.image_back || 'https://placehold.co/600x400?text=NoImage'}
                            alt="Image Preview for Back side"
                            className="w-full h-full object-cover object-center"
                        />
                    </label>
                </div>
                <div className="w-full flex flex-col gap-0.5">
                    <label htmlFor="name" className="text-xs self-start">
                        CARD NAME
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={card.name}
                        onChange={handleInputChange}
                        disabled={loading}
                        autoComplete="off"
                        className="py-1 px-3 rounded-lg border border-primary-600"
                    />
                </div>
                <div className="w-full flex flex-col gap-0.5">
                    <label htmlFor="type" className="text-xs self-start">
                        CARD TYPE
                    </label>
                    <select
                        id="type"
                        name="type_id"
                        value={card.type_id}
                        onChange={handleInputChange}
                        className="py-1 px-2 rounded-lg border border-primary-600"
                    >
                        {getTypesResult.types?.map((type) => (
                            <option value={type._id} key={type._id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full flex flex-col gap-0.5">
                    <label htmlFor="number" className="text-xs self-start">
                        CARD NUMBER
                    </label>
                    <input
                        id="number"
                        name="number"
                        type="text"
                        value={card.number}
                        onChange={handleInputChange}
                        disabled={loading}
                        autoComplete="off"
                        className="py-1 px-3 rounded-lg border border-primary-600"
                    />
                </div>
                <div className="w-full flex flex-col gap-0.5">
                    <label htmlFor="note" className="text-xs self-start">
                        NOTE
                    </label>
                    <textarea
                        id="note"
                        name="note"
                        value={card.note}
                        onChange={handleInputChange}
                        disabled={loading}
                        rows={3}
                        className="py-1 px-3 rounded-lg border border-primary-600 resize-none"
                    />
                </div>
            </div>
        </form>
    );
}
