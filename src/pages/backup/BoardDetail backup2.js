import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import PostView from "../../component/PostView";
import PostEdit from "../../component/PostEdit";
import CommentForm from "../../component/CommentForm";
import CommentList from "../../component/CommentList";
import "./BoardDetail.css";
import "./Comment.css";

function BoardDetail({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // 게시글 상태
  const [post, setPost] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 댓글 상태
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentErrors, setCommentErrors] = useState({});

  // 게시글 불러오기
  const loadPost = async () => {
    try {
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data);
      setEditTitle(res.data.title);
      setEditContent(res.data.content);
    } catch (err) {
      console.error(err);
      alert("해당 글 불러오기에 실패했습니다.");
      navigate("/board");
    }
  };

  // 댓글 목록 불러오기
  const loadComments = async () => {
    try {
      const res = await api.get(`/api/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/api/board/${id}`);
      alert("글이 삭제되었습니다.");
      navigate("/board");
    } catch (err) {
      console.error(err);
      alert("글 삭제에 실패했습니다.");
    }
  };

  // 게시글 수정 모드 전환
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // 게시글 수정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // 게시글 수정 완료
  const handleSubmitEdit = async () => {
    if (!editTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!editContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await api.put(`/api/board/${id}`, {
        title: editTitle,
        content: editContent,
      });
      alert("글이 수정되었습니다.");
      setIsEditMode(false);
      loadPost();
    } catch (err) {
      console.error(err);
      alert("글 수정에 실패했습니다.");
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
      await api.post(`/api/comments/${id}`, {
        content: newComment,
      });
      setNewComment("");
      setCommentErrors({});
      loadComments();
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
      await api.put(`/api/comments/${id}/${commentId}`, {
        content: editCommentContent,
      });
      setEditingCommentId(null);
      setEditCommentContent("");
      loadComments();
      alert("댓글이 수정되었습니다.");
    } catch (err) {
      console.error(err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/api/comments/${id}/${commentId}`);
      loadComments();
      alert("댓글이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  // 로딩 중
  if (!post) {
    return <div className="detail-container">로딩 중...</div>;
  }

  return (
    <div className="detail-container">
      {/* 수정 모드 / 조회 모드 */}
      {isEditMode ? (
        <PostEdit
          editTitle={editTitle}
          editContent={editContent}
          onTitleChange={(e) => setEditTitle(e.target.value)}
          onContentChange={(e) => setEditContent(e.target.value)}
          onSubmit={handleSubmitEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <PostView
          post={post}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatDate={formatDate}
        />
      )}

      {/* 댓글 영역 */}
      {!isEditMode && (
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
      )}
    </div>
  );
}

export default BoardDetail;
