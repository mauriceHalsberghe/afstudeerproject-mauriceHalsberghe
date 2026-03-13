import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { User } from "@/types/UserTypes";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import CommentStyles from "@/app/styles/components/comment.module.css"

type Comment = {
    id: number;
    user: User;
    message: string;
    commentId?: number;
    createdAt: Date;
}

type Props = {
    recipeId: number;
    loggedUserId?: number;
}

export default function CommentPage({ recipeId, loggedUserId }: Props) {
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const auth = useContext(AuthContext);

    const fetchComments = async () => {
    setLoading(true);
    try {
        const res = await fetch(
        `${API_URL}/api/Comments/recipe/${recipeId}`
        );
        const data: Comment[] = await res.json();
        setComments(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
        if (auth?.loading) return;
        fetchComments();
    }, []);

    return (
        <div className={CommentStyles.page}>
            <h2 className={CommentStyles.title}>Comments - {comments.length}</h2>
            {comments.map((comment) => (
                <div key={comment.id} className={CommentStyles.commentCard}>
                    <Image
                        className={CommentStyles.avatar}
                        src={comment.user.avatar ? `${API_URL}/uploads/avatars/${comment.user.avatar}` : '/avatar.svg'} 
                        alt={`avatar`}
                        width={64}
                        height={64}
                    />
                    <div className={CommentStyles.text}>
                        <h3 className={CommentStyles.username}>{comment.user.username}</h3>
                        <p className={CommentStyles.comment}>{comment.message}</p>
                        <time>{new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</time>
                    </div>
                </div>
            ))}
        </div>
    );
}