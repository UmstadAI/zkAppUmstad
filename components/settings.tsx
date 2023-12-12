'use client'

import * as React from 'react'

import { ApiKeyButton } from "./api-key-button";
import { ApiKeyInput } from "./api-key-input";
import { DeleteApiKeyButton } from './delete-api-key-button';
import { ReturnChatButton } from './return-chat-button';


export function Settings() {
    const [apiKey, setApiKey] = React.useState('')

    return (
        <div className="mx-auto max-w-2xl items-center justify-center px-4 py-12">
            <h1 className="mb-2 text-center text-lg font-semibold">
                Enter Your OPEN AI API KEY to use your own API KEY. 
            </h1>
            <p className="mb-1 text-sm font-normal">
                We are using gpt-4-1106-preview model. In order to use GPT-4, you need to deposit some credit. For detailed information, 
                please visit 
                <b>
                    <a href="https://platform.openai.com/docs/models" target="_blank" rel="noopener noreferrer"> Open AI Documentation
                    </a>
                </b>.

                <br/>
                <br/>

                We will store your API KEY on only Local Storage. 
                When you want to delete it from Local Storage please click Delete Button below.
                If you are using a shared computer, please ensure to delete your API key after use.
            </p>
            <ApiKeyInput className="my-4" onChange={e => setApiKey(e.target.value)} />
            <ApiKeyButton className="mx-auto mb-4 items-center" apiKey={apiKey} />
            <DeleteApiKeyButton className='mx-auto mb-4 items-center'/>
            <ReturnChatButton className='mx-auto mb-4 items-center'/>
        </div>
    )
}