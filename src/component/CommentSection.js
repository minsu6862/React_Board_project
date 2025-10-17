import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

function CommentSection({ user, postId }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentErrors, setCommentErrors] = useState({});

  // 댓글 목록 불러오기
  const loadComments = async () => {
    try {
      const res = await api.get(`/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("댓글 작성은 로그인이 필요합니다.");
      return;
    }

    try {
      await api.post(`/api/comments/${postId}`, {
        content: newComment,
      });
      setNewComment("");
      setCommentErrors({});
      await loadComments();
      alert("댓글이 등록되었습니다.");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setCommentErrors(err.response.data);
      } else {
        console.error("댓글 등록에 실패했습니다:", err);
        alert("댓글 등록에 실패했습니다.");
      }
    }
  };

  // 댓글 수정 모드 시작
  const startEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  // 댓글 수정 완료
  const handleCommentEdit = async (commentId) => {
    if (!editCommentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await api.put(`/api/comments/${postId}/${commentId}`, {
        content: editCommentContent,
      });
      setEditingCommentId(null);
      setEditCommentContent("");
      await loadComments(); // await 추가
      alert("댓글이 수정되었습니다.");
    } catch (err) {
      console.error(err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/comments/${postId}/${commentId}`);
      await loadComments(); // await 추가
      alert("댓글이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <div className="comment-section">
      <CommentForm
        newComment={newComment}
        commentErrors={commentErrors}
        onCommentChange={(e) => setNewComment(e.target.value)}
        onSubmit={handleCommentSubmit}
      />

      <CommentList
        comments={comments}
        user={user}
        editingCommentId={editingCommentId}
        editCommentContent={editCommentContent}
        onStartEdit={startEditComment}
        onCancelEdit={cancelEditComment}
        onEditChange={(e) => setEditCommentContent(e.target.value)}
        onSubmitEdit={handleCommentEdit}
        onDelete={handleCommentDelete}
        formatDate={formatDate}
      />
    </div>
  );
}

export default CommentSection;
