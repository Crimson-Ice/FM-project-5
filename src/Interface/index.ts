export interface User {
    image: {
        png: string;
        webp: string;
    };
    username: string;
    likedComments: number[];
    dislikedComments: number[];
}

interface ReplyInterface {
    id: number;
    content: string;
    createdAt: string;
    score: number;
    replyingTo: string;
    user: Pick<User, "username" | "image">;
}

export interface CommentInterface {
    id: number;
    content: string;
    createdAt: string;
    score: number;
    replyingTo?: string;
    user: Pick<User, "username" | "image">;
    replies?: ReplyInterface[] | [];
}
