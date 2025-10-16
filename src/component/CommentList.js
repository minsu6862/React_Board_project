function CommentList({
  comments,
  user,
  editingCommentId,
  editCommentContent,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onSubmitEdit,
  onDelete,
  formatDate,
}) {
  return (
    <div>
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
                  onChange={onEditChange}
                  className="comment-edit-textarea"
                />
                <div className="button-group">
                  <button onClick={() => onSubmitEdit(c.id)}>수정 완료</button>
                  <button onClick={onCancelEdit} className="cancel-btn">
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
                    <button onClick={() => onStartEdit(c.id, c.content)}>
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
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
  );
}

export default CommentList;
