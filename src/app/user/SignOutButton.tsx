'use client';
import { signOut } from 'next-auth/react';
import React from 'react';

export function SignOutButton() {
    return (
        <button
            className="w-full py-1.5 px-3 rounded-lg border border-primary-800 text-primary-800 bg-primary-50"
            onClick={() => signOut()}
        >
            Sign out
        </button>
    );
}
