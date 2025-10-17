import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./BoardDetail.css";
import "./Comment.css";

function BoardDetail({ user }) {
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const { id } = useParams();

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

  // 글 삭제
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

  // 수정 모드로 전환
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // 수정 완료
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

  // 댓글 관련 상태
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editCommentContent, setEditCommentContent] = useState(""); // 수정 중인 댓글 내용
  const [commentErrors, setCommentErrors] = useState({});

  // 댓글 목록 불러오기
  const loadComments = async () => {
    try {
      const res = await api.get(`/api/comments/${id}`);
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
      await api.post(`/api/comments/${id}`, {
        content: newComment,
      });
      setNewComment("");
      setCommentErrors({}); // 성공 시 에러 초기화
      loadComments();
      alert("댓글이 등록되었습니다.");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // 백엔드 유효성 검증 에러 처리
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
      loadComments(); // 댓글 목록 새로고침
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
      loadComments(); // 댓글 목록 새로고침
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

  // 컴포넌트 마운트 시 글과 댓글 불러오기
  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  // 로딩 중
  if (!post) {
    return <div className="detail-container">로딩 중...</div>;
  }

  // 수정 모드일 때
  if (isEditMode) {
    return (
      <div className="detail-container">
        <h2>글 수정</h2>
        <input
          type="text"
          className="edit-title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
        <textarea
          className="edit-content"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="내용을 입력하세요"
        />
        <div className="button-group">
          <button onClick={handleSubmitEdit}>수정 완료</button>
          <button onClick={handleCancelEdit} className="cancel-btn">
            취소
          </button>
        </div>
      </div>
    );
  }

  // 조회 모드일 때
  return (
    <div className="detail-container">
      <h2>{post.title}</h2>
      <div className="post-info">
        <span className="author">작성자: {post.author.username}</span>
        <span className="date">작성일: {formatDate(post.createDate)}</span>
      </div>
      <div className="content">{post.content}</div>

      <div className="button-group">
        <button onClick={() => navigate("/board")}>글 목록</button>
        {user && post.author.username === user && (
          <>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete} className="delete-btn">
              삭제
            </button>
          </>
        )}
      </div>

      {/* 댓글 영역 시작 */}
      <div className="comment-section">
        {/* 댓글 입력 폼 */}
        <h3>댓글 쓰기</h3>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            placeholder="댓글을 입력하세요."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {commentErrors.content && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
              {commentErrors.content}
            </p>
          )}
          <button type="submit" className="comment-button">
            등록
          </button>
        </form>

        {/* 기존 댓글 리스트 */}
        <h3>댓글 목록 ({comments.length})</h3>
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{c.author.username}</span>
                <span className="comment-date">{formatDate(c.createDate)}</span>
              </div>

              {/* 댓글 수정 모드 */}
              {editingCommentId === c.id ? (
                <div className="comment-edit-mode">
                  <textarea
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    className="comment-edit-textarea"
                  />
                  <div className="button-group">
                    <button onClick={() => handleCommentEdit(c.id)}>
                      수정 완료
                    </button>
                    <button onClick={cancelEditComment} className="cancel-btn">
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                // 댓글 조회 모드
                <>
                  <div className="comment-content">{c.content}</div>
                  {user && c.author.username === user && (
                    <div className="button-group">
                      <button onClick={() => startEditComment(c.id, c.content)}>
                        수정
                      </button>
                      <button
                        onClick={() => handleCommentDelete(c.id)}
                        className="delete-btn"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* 댓글 영역 끝 */}
    </div>
  );
}

export default BoardDetail;
