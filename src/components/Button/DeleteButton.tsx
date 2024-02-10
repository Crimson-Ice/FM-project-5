import { useState } from "react";
import { DeleteModal } from "../DeleteModal";
import { CommentInterface } from "../../Interface";

interface DeleteButtonProps {
    CommentId: number;
    upperComment?: CommentInterface;
}

export function DeleteButton({ CommentId, upperComment }: DeleteButtonProps) {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <button className="mr-6" onClick={() => setShowModal(true)}>
                <a className="flex h-full w-full flex-row items-center text-Soft-Red hover:text-Pale-red">
                    <svg
                        className="mr-1"
                        width="14"
                        height="14"
                        fill="currentColor"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                            fill="currentColor"
                        />
                    </svg>
                    <span className="font-bold">Delete</span>
                </a>
            </button>
            {showModal && (
                <DeleteModal
                    CommentId={CommentId}
                    setShowModal={setShowModal}
                    upperComment={upperComment}
                />
            )}
        </>
    );
}
