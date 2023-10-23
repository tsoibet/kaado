'use client';

import { useState } from 'react';

import { ShareIcon } from '@/components/icons/ShareIcon';
import { ISharing } from '@/models/Sharing';

export const ShareButton = ({
    getSharingData,
}: {
    getSharingData: () => Promise<{ sharing?: ISharing; error?: any }>;
}) => {
    const [shareMsg, setshareMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    const handleShareClick = async () => {
        const { sharing, error } = await getSharingData();
        if (error || !sharing) {
            return;
        }
        const sharingLink = `${window.location.origin}/sharing/${sharing._id}`;
        if (navigator.share) {
            navigator
                .share({
                    title: 'KAADO',
                    text: `A card is shared with you. Click the link to add the card to your KAADO`,
                    url: sharingLink,
                })
                .then(() => {
                    setIsSuccess(true);
                    setshareMsg('Successfully shared');
                })
                .catch((e) => {
                    setIsSuccess(false);
                    setshareMsg('Error sharing');
                    console.error('Error sharing:', e);
                });
        } else {
            // Fallback for browsers that don't support the Web Share API
            try {
                await navigator.clipboard.writeText(sharingLink);
                setIsSuccess(true);
                setshareMsg('Copied to clipboard');
                console.log('Copied to clipboard');
            } catch (e) {
                setIsSuccess(false);
                setshareMsg('Error copying to clipboard');
                console.error('Error copying to clipboard:', e);
            }
        }
    };

    return (
        <>
            <button onClick={handleShareClick}>
                <ShareIcon />
            </button>
            {shareMsg && (
                <div
                    className={`fixed transition-all w-max transform left-1/2 -translate-x-1/2 border px-2 py-3 ${
                        shareMsg ? 'bottom-10' : ' -bottom-20'
                    } ${isSuccess ? ' text-info-600' : 'text-danger-600'}`}
                >
                    {shareMsg}
                </div>
            )}
        </>
    );
};
