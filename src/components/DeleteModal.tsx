import { Dispatch, SetStateAction } from "react";
import {
    useChangeUserPropsMutation,
    useDeleteCommentMutation,
    useDeleteReplyCommentMutation,
    useGetCurrentUserQuery,
} from "../Redux/apiSlice";
import { CommentInterface } from "../Interface";

interface DeleteModalProps {
    CommentId: number;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    upperComment?: CommentInterface;
}

export function DeleteModal({
    CommentId,
    setShowModal,
    upperComment,
}: DeleteModalProps) {
    const { data: currentUSer } = useGetCurrentUserQuery();
    const [deleteComment] = useDeleteCommentMutation();
    const [changeUserProps] = useChangeUserPropsMutation();
    const [deleteReplyComment] = useDeleteReplyCommentMutation();

    if (!currentUSer) return;

    return (
        <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-Dark-blue pt-12">
            <div className="flex h-[35%] w-[25%] flex-col justify-between rounded-md border-[1px] bg-White p-8">
                <h1 className="text-[22px] font-bold text-Dark-blue">
                    Delete comment
                </h1>
                <span className="text-Grayish-Blue">
                    {
                        "Are you sure you want to delete this comment? This will remove the comment and can't be undone."
                    }
                </span>
                <div className="flex w-full flex-row justify-between ">
                    <button
                        onClick={() => setShowModal(false)}
                        className="rounded-md bg-Grayish-Blue p-2 px-6 text-White hover:bg-grey"
                    >
                        NO, CANCEL
                    </button>
                    <button
                        onClick={() => {
                            changeUserProps({
                                ...currentUSer,
                                likedComments: currentUSer.likedComments.filter(
                                    (id) => id !== CommentId,
                                ),
                                dislikedComments:
                                    currentUSer.dislikedComments.filter(
                                        (id) => id !== CommentId,
                                    ),
                            });

                            if (upperComment) {
                                deleteReplyComment({
                                    ...upperComment,
                                    replies: upperComment.replies?.filter(
                                        (replie) => replie.id !== CommentId,
                                    ),
                                });
                            } else {
                                deleteComment(CommentId);
                            }

                            setShowModal(false);
                        }}
                        className=" rounded-md bg-Soft-Red p-2 px-6 text-White hover:bg-Pale-red"
                    >
                        YES, DELETE
                    </button>
                </div>
            </div>
        </div>
    );
}
