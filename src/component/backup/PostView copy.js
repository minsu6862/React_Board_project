import { useNavigate } from "react-router-dom";

function PostView({ post, user, onEdit, onDelete, formatDate }) {
  const navigate = useNavigate();

  return (
    <>
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
            <button onClick={onEdit}>수정</button>
            <button onClick={onDelete} className="delete-btn">
              삭제
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default PostView;
