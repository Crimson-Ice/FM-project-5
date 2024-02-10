import { Dispatch, SetStateAction, useState } from "react";
import { CommentInterface, User } from "../../Interface";
import {
    useChangeCommentMutation,
    useChangeUserPropsMutation,
} from "../../Redux/apiSlice";

interface MinusButtonProps {
    baseCommentContent: CommentInterface;
    currentUSer: User;
    setCommentScore: Dispatch<SetStateAction<number>>;
    likeOrDislike: { liked: boolean; disliked: boolean };
    setLikeOrDislike: Dispatch<
        SetStateAction<{ liked: boolean; disliked: boolean }>
    >;
    upperComment?: CommentInterface;
}

export function MinusButton({
    baseCommentContent,
    currentUSer,
    setCommentScore,
    likeOrDislike,
    setLikeOrDislike,
    upperComment,
}: MinusButtonProps) {
    const [changeScoreComment] = useChangeCommentMutation();
    const [changeUserProps] = useChangeUserPropsMutation();

    const [isDisliking, setIsDisliking] = useState(false); // État pour gérer le chargement

    const handleDisikeClick = async () => {
        const liked = currentUSer.likedComments.includes(baseCommentContent.id);

        const alreadyDisliked = currentUSer.dislikedComments.includes(
            baseCommentContent.id,
        );

        setIsDisliking(true);
        try {
            // Mettre à jour localement
            const updatedScore = alreadyDisliked
                ? baseCommentContent.score + 1
                : liked
                ? baseCommentContent.score - 2
                : baseCommentContent.score - 1;

            const updatedLikedComments = liked
                ? currentUSer.likedComments.filter(
                      (id) => id !== baseCommentContent.id,
                  )
                : currentUSer.likedComments;

            const updatedDislikedComments = alreadyDisliked
                ? currentUSer.dislikedComments.filter(
                      (id) => id !== baseCommentContent.id,
                  )
                : [...currentUSer.dislikedComments, baseCommentContent.id];

            if (liked)
                setLikeOrDislike((prev) => {
                    return {
                        liked: false,
                        disliked: prev.disliked,
                    };
                });

            // Mettre à jour l'état local
            // Cela rendra le changement instantané
            setCommentScore(updatedScore);
            setLikeOrDislike((prev) => {
                return {
                    liked: prev.liked,
                    disliked: !alreadyDisliked,
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

            setIsDisliking(false); // Fin du chargement
        } catch (error) {
            setIsDisliking(false); // Gérer les erreurs ici
        }
    };

    return (
        <button onClick={() => handleDisikeClick()} disabled={isDisliking}>
            <svg
                className={`h-4 w-4 ${
                    likeOrDislike.disliked
                        ? "text-Moderate-blue"
                        : "text-[#C5C6EF]"
                } hover:text-Moderate-blue`}
                fill="currentColor"
                stroke="currentColor"
                viewBox="0 -4 10 12"
            >
                <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" />
            </svg>
        </button>
    );
}
