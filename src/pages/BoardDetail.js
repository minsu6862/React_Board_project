import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import PostSection from "../component/PostSection";
import CommentSection from "../component/CommentSection";
import "./BoardDetail.css";
import "./Comment.css";

function BoardDetail({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);

  // 게시글 불러오기
  const loadPost = async () => {
    try {
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
      alert("해당 글 불러오기에 실패했습니다.");
      navigate("/board");
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  if (!post) {
    return <div className="detail-container">로딩 중...</div>;
  }

  return (
    <div className="detail-container">
      <PostSection user={user} post={post} onPostUpdate={loadPost} />
      <CommentSection user={user} postId={id} />
    </div>
  );
}

export default BoardDetail;
