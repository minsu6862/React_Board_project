function CommentForm({ newComment, commentErrors, onCommentChange, onSubmit }) {
  return (
    <div>
      <h3>댓글 쓰기</h3>
      <form onSubmit={onSubmit} className="comment-form">
        <textarea
          placeholder="댓글을 입력하세요."
          value={newComment}
          onChange={onCommentChange}
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
    </div>
  );
}

export default CommentForm;
