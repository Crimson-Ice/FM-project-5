import { Dispatch, SetStateAction, useState } from "react";
import {
    useAddCommentMutation,
    useChangeCommentMutation,
    useGetCurrentUserQuery,
} from "../Redux/apiSlice";
import { CommentInterface } from "../Interface";

interface BaseUserMessageProps {
    replyTo?: string;
    commentContent?: CommentInterface;
    setShowReplyUserMessage?: Dispatch<SetStateAction<boolean>>;
}

export function UserMessage({
    replyTo,
    commentContent,
    setShowReplyUserMessage,
}: BaseUserMessageProps) {
    return !replyTo ? (
        <div className="mt-2 flex h-auto min-h-[160px] w-[700px] flex-row rounded-md bg-White py-6">
            <BaseMessage />
        </div>
    ) : commentContent && replyTo === commentContent.user.username ? (
        <div className="mt-2 flex h-auto min-h-[160px] w-[700px] flex-row rounded-md bg-White py-6">
            <BaseMessage
                replyTo={replyTo}
                commentContent={commentContent}
                setShowReplyUserMessage={setShowReplyUserMessage}
            />
        </div>
    ) : (
        <div className="mt-2 flex h-auto min-h-[160px] w-[620px] flex-row rounded-md bg-White py-6">
            <BaseMessage
                replyTo={replyTo}
                commentContent={commentContent}
                setShowReplyUserMessage={setShowReplyUserMessage}
            />
        </div>
    );
}

function BaseMessage({
    replyTo,
    commentContent,
    setShowReplyUserMessage,
}: BaseUserMessageProps) {
    const [addComment] = useAddCommentMutation();
    const [changeComment] = useChangeCommentMutation();
    const { data: currentUser } = useGetCurrentUserQuery();

    const [commentText, setCommentText] = useState("");

    return (
        <>
            <img
                className="mx-4 h-[45px] w-[45px]"
                src={currentUser?.image.png}
                alt={currentUser?.username + " profile picture"}
            />
            <textarea
                className="h-[110px] w-full resize-none overflow-auto rounded-md border-[1px] border-b-Dark-blue p-2"
                name="comment"
                cols={30}
                rows={10}
                placeholder={
                    !replyTo ? "Write your comment...." : "write your reply...."
                }
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
            />
            <button
                onClick={() => {
                    if (!currentUser) return;
                    if (replyTo) {
                        if (!commentContent) return;

                        if (setShowReplyUserMessage) {
                            setShowReplyUserMessage((prev) => !prev);
                        } else {
                            console.log("error");
                        }

                        const lastReplyId =
                            commentContent.replies?.length !== 0 &&
                            commentContent.replies
                                ? parseInt(
                                      commentContent.replies[
                                          commentContent.replies.length - 1
                                      ].id
                                          .toString()
                                          .split(".")[1],
                                  ) + 1
                                : 1;

                        setTimeout(function () {
                            changeComment({
                                ...commentContent,
                                replies: [
                                    ...(commentContent.replies || []),
                                    {
                                        id: parseFloat(
                                            `${commentContent.id}.${lastReplyId}`,
                                        ),
                                        content: commentText,
                                        createdAt: "10 min ago",
                                        score: 0,
                                        user: {
                                            username: currentUser.username,
                                            image: {
                                                png: currentUser.image.png,
                                                webp: currentUser.image.webp,
                                            },
                                        },
                                        replyingTo: replyTo,
                                    },
                                ],
                            });
                        }, 150);
                    } else {
                        addComment({
                            id: 0,
                            content: commentText,
                            createdAt: "10 min ago",
                            score: 0,
                            user: {
                                username: currentUser.username,
                                image: {
                                    png: currentUser.image.png,
                                    webp: currentUser.image.webp,
                                },
                            },
                            replies: [],
                        });
                    }
                    setCommentText("");
                }}
                className="mx-4 h-12 w-36 rounded-lg bg-Moderate-blue text-White hover:bg-Light-grayish-blue"
            >
                {replyTo ? "REPLY" : "SEND"}
            </button>
        </>
    );
}
