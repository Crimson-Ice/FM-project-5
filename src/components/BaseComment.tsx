import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { CommentInterface } from "../Interface";
import { PlusButton } from "./Button/PlusButton";
import { MinusButton } from "./Button/MinusButton";
import { DeleteButton } from "./Button/DeleteButton";
import { EditButton } from "./Button/EditButton";
import { ReplyButton } from "./Button/ReplyButton";
import {
    useChangeCommentMutation,
    useGetCurrentUserQuery,
} from "../Redux/apiSlice";

interface BaseCommentProps {
    baseCommentContent: CommentInterface;
    upperComment?: CommentInterface;
    setShowReplyUserMessage: Dispatch<SetStateAction<boolean>>;
}

export function BaseComment({
    baseCommentContent,
    upperComment,
    setShowReplyUserMessage,
}: BaseCommentProps) {
    const { data: currentUSer } = useGetCurrentUserQuery();
    const [changeComment] = useChangeCommentMutation();

    const isCurrentUser = useMemo(() => {
        return baseCommentContent.user.username === currentUSer?.username;
    }, [baseCommentContent, currentUSer]);

    const [commentScore, setCommentScore] = useState(baseCommentContent.score);
    const [likeOrDislike, setLikeOrDislike] = useState({
        liked: false,
        disliked: false,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editCommentText, setEditCommentText] = useState(
        baseCommentContent?.replyingTo
            ? `@${baseCommentContent.replyingTo} ${baseCommentContent.content}`
            : baseCommentContent.content,
    );

    if (!currentUSer) return;

    return (
        <div className="flex h-full w-full flex-row">
            <div className="flex p-4">
                <div className="flex h-[120px] w-[40px] flex-col items-center justify-between rounded-lg bg-Light-gray p-4">
                    <PlusButton
                        baseCommentContent={baseCommentContent}
                        currentUSer={currentUSer}
                        setCommentScore={setCommentScore}
                        likeOrDislike={likeOrDislike}
                        setLikeOrDislike={setLikeOrDislike}
                        upperComment={upperComment}
                    />
                    <span className="font-bold text-Moderate-blue">
                        {commentScore}
                    </span>
                    <MinusButton
                        baseCommentContent={baseCommentContent}
                        currentUSer={currentUSer}
                        setCommentScore={setCommentScore}
                        likeOrDislike={likeOrDislike}
                        setLikeOrDislike={setLikeOrDislike}
                        upperComment={upperComment}
                    />
                </div>
            </div>
            <div className="flex w-full flex-col py-4">
                <div className="flex flex-row justify-between">
                    <div className="flex min-w-[240px] max-w-[340px] flex-row items-center justify-between">
                        <img
                            className="h-[40px] w-[40px]"
                            src={baseCommentContent.user.image.png}
                            alt="photo utilisateur"
                        />
                        <span className="px-3 font-bold">
                            {baseCommentContent.user.username}
                        </span>
                        {isCurrentUser && (
                            <span className="mr-3 bg-Moderate-blue px-2 text-[14px] text-White">
                                you
                            </span>
                        )}
                        <span className="text-Grayish-Blue">
                            {baseCommentContent.createdAt}
                        </span>
                    </div>
                    <div className="flex flex-row">
                        {isCurrentUser ? (
                            <>
                                <DeleteButton
                                    CommentId={baseCommentContent.id}
                                    upperComment={upperComment}
                                />
                                <EditButton setIsEditing={setIsEditing} />
                            </>
                        ) : (
                            <ReplyButton
                                setShowReplyUserMessage={
                                    setShowReplyUserMessage
                                }
                            />
                        )}
                    </div>
                </div>
                {isEditing ? (
                    <div className="h-full w-full p-4">
                        <textarea
                            className="h-[120px] w-full resize-none overflow-y-auto rounded-md border-[1px] border-b-Dark-blue p-3"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                className="h-[50px] w-[20%] rounded-md bg-Moderate-blue text-White hover:bg-Light-grayish-blue"
                                onClick={() => {
                                    if (
                                        baseCommentContent?.replyingTo &&
                                        upperComment?.replies
                                    ) {
                                        changeComment({
                                            ...upperComment,
                                            replies: upperComment.replies.map(
                                                (reply) => {
                                                    if (
                                                        reply.id ===
                                                        baseCommentContent.id
                                                    ) {
                                                        return {
                                                            ...reply,
                                                            content:
                                                                editCommentText,
                                                        };
                                                    }
                                                    return reply;
                                                },
                                            ),
                                        });
                                    } else {
                                        changeComment({
                                            ...baseCommentContent,
                                            content: editCommentText,
                                        });
                                    }
                                    setIsEditing(false);
                                }}
                            >
                                UPDATE
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="p-2 pr-6 text-[16px] text-Grayish-Blue">
                        {baseCommentContent?.replyingTo ? (
                            <>
                                <span className="font-bold text-Moderate-blue">
                                    {"@" + baseCommentContent.replyingTo}
                                </span>
                                {" " + baseCommentContent.content}
                            </>
                        ) : (
                            baseCommentContent.content
                        )}
                    </p>
                )}
            </div>
        </div>
    );
}
