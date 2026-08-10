import { Message } from "../lib/types/Types"
import Markdown from "react-markdown"
import remarkGfm from 'remark-gfm'

export default function MessageComponent({ role, content, toolCalls}: Message) {

    console.log(content);

    return (

        <div className={`message prose w-full p-3 rounded-md ${role === "user" ? "bg-white text-black text-right" : role === "tool" ? "bg-gray-200" : "bg-gray-100"}`}>
            {role === "tool" ? <small>{content}</small> : <Markdown>{content}</Markdown>}
            
            {
                toolCalls && toolCalls.length > 0 ? (<small>Tools Called: {toolCalls.map((tool,index)=><span>{tool.name} </span>)}</small>) : ""
            }
        </div>
    )
}