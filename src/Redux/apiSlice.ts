import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CommentInterface, User } from "../Interface";

// Define a service using a base URL and expected endpoints
export const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
    tagTypes: ["Comment", "User"],
    endpoints: (builder) => ({
        ///User
        getCurrentUser: builder.query<User, void>({
            query: () => "currentUser",
            providesTags: ["User"],
        }),
        changeUserProps: builder.mutation<User, User>({
            query: (body) => ({
                url: `currentUser`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        ///Comment
        getAllComment: builder.query<CommentInterface[], void>({
            query: () => "comments",
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Comment" as const,
                              id,
                          })),
                          "Comment",
                      ]
                    : ["Comment"],
        }),
        addComment: builder.mutation<CommentInterface, CommentInterface>({
            query: (body) => ({
                url: `comments`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Comment"],
        }),
        deleteComment: builder.mutation<CommentInterface, number>({
            query: (id) => ({
                url: `comments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Comment"],
        }),
        deleteReplyComment: builder.mutation<
            CommentInterface,
            CommentInterface
        >({
            query: (body) => ({
                url: `comments/${body.id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Comment"],
        }),
        changeComment: builder.mutation<CommentInterface, CommentInterface>({
            query: (body) => ({
                url: `comments/${body.id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Comment"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    //User
    useGetCurrentUserQuery,
    useChangeUserPropsMutation,
    //Comment
    useGetAllCommentQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useDeleteReplyCommentMutation,
    useChangeCommentMutation,
} = commentApi;
