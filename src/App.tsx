import { useGetAllCommentQuery } from "./Redux/apiSlice";
import { UserMessage } from "./components/UserMessage";
import { Comment } from "./components/Comment";

function App() {
    const { data: commentData } = useGetAllCommentQuery();

    return (
        <div className="flex min-h-screen w-full justify-center bg-Light-gray p-12">
            <div className="flex flex-col">
                {commentData?.map((commentContent, index) => {
                    return (
                        <div className="pb-4" key={index}>
                            <Comment commentContent={commentContent} />
                        </div>
                    );
                })}
                <UserMessage />
            </div>
        </div>
    );
}

export default App;
