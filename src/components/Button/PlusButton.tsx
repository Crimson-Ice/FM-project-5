import { CommentInterface, User } from "../../Interface";
import {
    useChangeCommentMutation,
    useChangeUserPropsMutation,
} from "../../Redux/apiSlice";
import { Dispatch, SetStateAction, useState } from "react";

interface PlusButtonProps {
    baseCommentContent: CommentInterface;
    currentUSer: User;
    setCommentScore: Dispatch<SetStateAction<number>>;
    likeOrDislike: { liked: boolean; disliked: boolean };
    setLikeOrDislike: Dispatch<
        SetStateAction<{ liked: boolean; disliked: boolean }>
    >;
    upperComment?: CommentInterface;
}

export function PlusButton({
    baseCommentContent,
    currentUSer,
    setCommentScore,
    likeOrDislike,
    setLikeOrDislike,
    upperComment,
}: PlusButtonProps) {
    const [changeScoreComment] = useChangeCommentMutation();
    const [changeUserProps] = useChangeUserPropsMutation();

    const [isLiking, setIsLiking] = useState(false); // État pour gérer le chargement

    const handleLikeClick = async () => {
        setIsLiking(true);

        const disliked = currentUSer.dislikedComments.includes(
            baseCommentContent.id,
        );

        const alreadyLiked = currentUSer.likedComments.includes(
            baseCommentContent.id,
        );

        try {
            // Mettre à jour localement
            const updatedScore = alreadyLiked
                ? baseCommentContent.score - 1
                : disliked
                ? baseCommentContent.score + 2
                : baseCommentContent.score + 1;

            const updatedLikedComments = alreadyLiked
                ? currentUSer.likedComments.filter(
                      (id) => id !== baseCommentContent.id,
                  )
                : [...currentUSer.likedComments, baseCommentContent.id];

            const updatedDislikedComments = disliked
                ? currentUSer.dislikedComments.filter(
                      (id) => id !== baseCommentContent.id,
                  )
                : currentUSer.dislikedComments;

            if (disliked)
                setLikeOrDislike((prev) => {
                    return {
                        liked: prev.liked,
                        disliked: false,
                    };
                });

            // Mettre à jour l'état local
            // Cela rendra le changement instantané
            setCommentScore(updatedScore);
            setLikeOrDislike((prev) => {
                return {
                    liked: !alreadyLiked,
                    disliked: prev.disliked,
                };
            });

            // Envoyer les requêtes au serveur
            await Promise.all([
                upperComment
                    ? changeScoreComment({
                          ...upperComment,
                          replies: upperComment.replies?.map((reply) => {
                              if (reply.id === baseCommentContent.id) {
                                  return {
                                      ...reply,
                                      score: updatedScore,
                                  };
                              }
                              return reply;
                          }),
                      })
                    : changeScoreComment({
                          ...baseCommentContent,
                          score: updatedScore,
                      }),
                changeUserProps({
                    ...currentUSer,
                    likedComments: updatedLikedComments,
                    dislikedComments: updatedDislikedComments,
                }),
            ]);

            setIsLiking(false); // Fin du chargement
        } catch (error) {
            setIsLiking(false); // Gérer les erreurs ici
        }
    };

    return (
        <button onClick={() => handleLikeClick()} disabled={isLiking}>
            <svg
                className={`h-4 w-4 ${
                    likeOrDislike.liked
                        ? "text-Moderate-blue"
                        : "text-[#C5C6EF]"
                } hover:text-Moderate-blue`}
                fill="currentColor"
                stroke="currentColor"
                viewBox="0 0 12 12"
            >
                <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" />
            </svg>
        </button>
    );
}
