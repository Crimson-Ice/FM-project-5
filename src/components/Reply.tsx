import { useState } from "react";
import { CommentInterface } from "../Interface";
import { BaseComment } from "./BaseComment";
import { UserMessage } from "./UserMessage";

interface ReplyProps {
    replyContent: CommentInterface;
    commentContent: CommentInterface;
    isLastReply: boolean | undefined;
}

export function Reply({
    commentContent,
    replyContent,
    isLastReply,
}: ReplyProps) {
    const [showReplyUserMessage, setShowReplyUserMessage] = useState(false);
    return (
        <div className="flex flex-row">
            <div className="ml-5 h-auto w-[2px] bg-grey "></div>
            <div className={`ml-10 ${isLastReply ? "pb-0" : "pb-4"}`}>
                <div className="h-auto min-h-[160px] w-[620px] rounded-md bg-White">
                    <BaseComment
                        baseCommentContent={replyContent}
                        upperComment={commentContent}
                        setShowReplyUserMessage={setShowReplyUserMessage}
                    />
                </div>
                {showReplyUserMessage && (
                    <UserMessage
                        replyTo={replyContent.user.username}
                        commentContent={commentContent}
                        setShowReplyUserMessage={setShowReplyUserMessage}
                    />
                )}
            </div>
        </div>
    );
}
