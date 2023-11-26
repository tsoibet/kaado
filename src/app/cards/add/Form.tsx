'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import { TopNav } from '@/components/TopNav';
import { convertImgToBase64 } from '@/lib/imageConvertor';
import { IType } from '@/models/Type';
import CardAdaptor from '@/services/CardAdaptor';

export function Form({
    handleCreateCard,
    getTypesResult,
}: {
    handleCreateCard: ({
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
    getTypesResult: {
        types?: IType[];
    };
}) {
    const router = useRouter();

    const [card, setCard] = useState<{
        image_front: string;
        type_id: string;
        image_back?: string;
        name?: string;
        number?: string;
        note?: string;
    }>({ image_front: '', type_id: '' });
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    function handleImgChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files && event.target.files[0];
        if (!file) {
            if (progress) {
                setCard({ ...card, image_back: '' });
                return;
            }
            setCard({ ...card, image_front: '' });
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
                if (progress) {
                    setCard({ ...card, image_back: resizedImgStr ?? '' });
                    return;
                }
                setCard({ ...card, image_front: resizedImgStr ?? '' });
            }
        );
    }

    async function addBtnClickHandler(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        try {
            const { id, error } = await handleCreateCard(new CardAdaptor(card));

            if (id) {
                router.replace(`/cards/${id}`);
            }
            if (error) {
                setLoading(false);
                setErrorMsg(error);
            }
            return;
        } catch (error) {
            setLoading(false);
            setErrorMsg('Failed to add card');
        }
    }

    function nextBtnClickHandler() {
        if (progress === 0) {
            if (!card.image_front) {
                setErrorMsg('Please upload a photo.');
                return;
            }
        }
        setProgress((prevProgress) => prevProgress + 1);
        setErrorMsg('');
    }

    function backBtnClickHandler() {
        if (!progress) {
            router.replace('/');
        } else {
            setProgress((prevProgress) => prevProgress - 1);
        }
    }

    function getRightBtn() {
        if (progress < 2) {
            return (
                <div onClick={nextBtnClickHandler} className={'text-info-600'}>
                    Next
                </div>
            );
        } else {
            return (
                <input
                    type="submit"
                    className={`${loading ? 'text-primary-600' : 'text-info-600 cursor-pointer'}`}
                    disabled={loading}
                    value={loading ? 'loading...' : 'Add'}
                />
            );
        }
    }

    function getLeftBtn() {
        return <div onClick={backBtnClickHandler}>Back</div>;
    }

    let inputfields;
    if (!progress) {
        inputfields = (
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                    <p>Photo of front side of card</p>
                    <p className="text-xs italic text-danger-500">Required</p>
                </div>
                <input
                    id="image_front"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImgChange(event)}
                    required
                    className="border border-primary-400 rounded text-sm"
                />
                <img
                    id="imagePreview"
                    src={card.image_front || 'https://placehold.co/793x500?text=Front'}
                    alt="Image Preview"
                    className="w-80 h-52 overflow-hidden rounded-3xl border-2 object-cover object-center"
                />
                <p className="text-sm text-danger-600">{errorMsg}</p>
            </div>
        );
    } else if (progress === 1) {
        inputfields = (
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                    <p>Photo of back side of card</p>
                    <p className="text-xs italic text-primary-400">Optional</p>
                </div>
                <input
                    id="image_back"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImgChange(event)}
                    required
                    className="border border-primary-400 rounded text-sm"
                />
                <img
                    id="imagePreview"
                    src={card.image_back || 'https://placehold.co/793x500?text=Back'}
                    alt="Image Preview"
                    className="w-80 h-52 overflow-hidden rounded-3xl border-2 object-cover object-center"
                />
                <p className="h-5 text-sm text-danger-600">{errorMsg}</p>
            </div>
        );
    } else {
        if (getTypesResult.types) {
            inputfields = (
                <div className="w-full flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center">
                        <p>Card Details</p>
                        <p className="text-xs italic text-primary-400">Optional</p>
                    </div>

                    <div className="w-10/12 flex flex-col gap-1">
                        <label htmlFor="name" className="text-xs self-start">
                            CARD NAME
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={card.name}
                            onChange={(event) => setCard({ ...card, name: event.target.value })}
                            disabled={loading}
                            autoComplete="off"
                            className="py-1 px-3 rounded-lg border border-primary-600"
                        />

                        <label htmlFor="type" className="text-xs self-start">
                            CARD TYPE
                        </label>
                        <select
                            id="type"
                            value={card.type_id}
                            onChange={(event) => setCard({ ...card, type_id: event.target.value })}
                            className="py-1 px-2 rounded-lg border border-primary-600"
                        >
                            {getTypesResult.types.map((type) => (
                                <option value={type._id} key={type._id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="number" className="text-xs self-start">
                            CARD NUMBER
                        </label>
                        <input
                            id="number"
                            type="text"
                            value={card.number}
                            onChange={(event) => setCard({ ...card, number: event.target.value })}
                            disabled={loading}
                            autoComplete="off"
                            className="py-1 px-3 rounded-lg border border-primary-600"
                        />

                        <label htmlFor="note" className="text-xs self-start">
                            NOTE
                        </label>
                        <textarea
                            id="note"
                            value={card.note}
                            onChange={(event) => setCard({ ...card, note: event.target.value })}
                            disabled={loading}
                            rows={3}
                            className="py-1 px-3 rounded-lg border border-primary-600 resize-none"
                        />
                    </div>

                    <p className="h-5 text-sm text-danger-600">{errorMsg}</p>
                </div>
            );
        } else {
            inputfields = (
                <>
                    <p className="h-5 text-sm text-danger-600">Error: Unable to add card details</p>
                    <p className="h-5 text-sm text-center text-danger-600">Please try again later. <br/>You may still add the card with photos only.</p>
                </>
            );
        }
    }

    return (
        <form
            onSubmit={addBtnClickHandler}
            className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-10"
        >
            <TopNav left={getLeftBtn()} right={getRightBtn()} />
            <div className="flex flex-col items-center gap-8">
                <div className="text-2xl">Add New Card</div>
                {inputfields}
            </div>
        </form>
    );
}
