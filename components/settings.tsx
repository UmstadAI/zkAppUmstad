'use client'

import * as React from 'react'

import { ApiKeyButton } from "./api-key-button";
import { ApiKeyInput } from "./api-key-input";
import { DeleteApiKeyButton } from './delete-api-key-button';


export function Settings() {
    const [apiKey, setApiKey] = React.useState('')

    return (
        <div className="mx-auto max-w-2xl items-center justify-center px-4 py-12">
            <h1 className="mb-2 text-center text-lg font-semibold">
                Enter Your OPEN AI API KEY to use GPT-4. 
            </h1>
            <p className="mb-1 text-sm font-normal">
                We will store your API KEY on only Local Storage. 
                When you want to delete it from Local Storage please click Delete Button below.
            </p>
            <ApiKeyInput className="my-4" onChange={e => setApiKey(e.target.value)} />
            <ApiKeyButton className="mx-auto mb-4 items-center" apiKey={apiKey} />
            <DeleteApiKeyButton className='mx-auto items-center'/>
        </div>
    )
}