"use client";
import { useState, useEffect, useRef } from "react";
import { Message } from "./lib/types/Types";
import MessageComponent from "./components/MessageComponent";
import './styles/styles.scss';

let conversationId = '';

export default function Home() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(()=> {
        bottomRef.current?.scrollIntoView({behavior:"smooth"})
    }, [messages])

    const handleSubmit = async (e: React.SubmitEvent) => {
        
        e.preventDefault();

        const userMessage: Message = { role: "human", content: input};
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");

        if (userMessage.content.includes("/id")) {
            conversationId = userMessage.content.slice(4);
        }

        const res = await fetch("http://localhost:9500/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({conversationId: conversationId, messages: [userMessage]})
        })

        const response = await res.json();
        console.log(response);
        conversationId = response.conversationId;

        setMessages(response.response);

    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex m-16 flex-1 w-full max-w-3xl flex-col items-center justify-between bg-white rounded-md shadow-xl overflow-hidden dark:bg-black sm:items-start">

                <div className="chatContainer h-full w-full flex flex-col p-5 gap-5">
                    {messages.map((message, index) => (
                        <MessageComponent key={index} role={message.role} content={message.content} toolCalls={message.toolCalls}/>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="interfaceContainer w-full bg-gray-100">
                    <form className="formControls w-full h-full p-5" onSubmit={handleSubmit}>
                        <div className="w-full h-full flex flex-col gap-2">
                            <label htmlFor="message"><small>Conversation Id: {conversationId}</small></label>
                            <div className="w-full flex flex-row">
                                <input name="message" className=" w-full h-full p-5 border-1 border-gray-300" placeholder="Type your message here" value={input} onChange={e => setInput(e.target.value)}></input>
                                <button type="submit" className="bg-black text-white p-5 h-full border-1 border-black hover:bg-white hover:text-black transition-all duration-300">Send</button>
                            </div>
                        </div>                        
                    </form>
                </div>

            </main>
        </div>
    );
}