export type Message = {
    role: "assistant" | "human" | "system";
    content: string;
    toolCalls: array;
}