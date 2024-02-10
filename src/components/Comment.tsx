import { useState } from "react";
import { CommentInterface } from "../Interface";
import { BaseComment } from "./BaseComment";
import { Reply } from "./Reply";
import { UserMessage } from "./UserMessage";

interface CommentProps {
    commentContent: CommentInterface;
}

export function Comment({ commentContent }: CommentProps) {
    const { replies } = commentContent;
    const [showReplyUserMessage, setShowReplyUserMessage] = useState(false);
    return (
        <>
            <div className="h-auto min-h-[160px] w-[700px] rounded-md bg-White">
                <BaseComment
                    baseCommentContent={commentContent}
                    setShowReplyUserMessage={setShowReplyUserMessage}
                />
            </div>
            {commentContent.replies?.length ? (
                <div className="pl-5 pt-4">
                    {replies?.map((replyContent, index) => {
                        const isLastReply =
                            commentContent.replies &&
                            index === commentContent.replies.length - 1;
                        return (
                            <Reply
                                key={index}
                                commentContent={commentContent}
                                replyContent={replyContent}
                                isLastReply={isLastReply}
                            />
                        );
                    })}
                </div>
            ) : null}
            {showReplyUserMessage && (
                <UserMessage
                    commentContent={commentContent}
                    replyTo={commentContent.user.username}
                    setShowReplyUserMessage={setShowReplyUserMessage}
                />
            )}
        </>
    );
}
