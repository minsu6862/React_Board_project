function PostEdit({
  editTitle,
  editContent,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancel,
}) {
  return (
    <>
      <h2>글 수정</h2>
      <input
        type="text"
        className="edit-title"
        value={editTitle}
        onChange={onTitleChange}
        placeholder="제목을 입력하세요"
      />
      <textarea
        className="edit-content"
        value={editContent}
        onChange={onContentChange}
        placeholder="내용을 입력하세요"
      />
      <div className="button-group">
        <button onClick={onSubmit}>수정 완료</button>
        <button onClick={onCancel} className="cancel-btn">
          취소
        </button>
      </div>
    </>
  );
}

export default PostEdit;
