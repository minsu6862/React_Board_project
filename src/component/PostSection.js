import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import PostView from "./PostView";
import PostEdit from "./PostEdit";

function PostSection({ user, post, onPostUpdate }) {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // 게시글 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/board/${post.id}`);
      alert("글이 삭제되었습니다.");
      navigate("/board");
    } catch (err) {
      console.error(err);
      alert("글 삭제에 실패했습니다.");
    }
  };

  // 게시글 수정 모드 전환
  const handleEdit = () => setIsEditMode(true);

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
      await api.put(`/api/board/${post.id}`, {
        title: editTitle,
        content: editContent,
      });
      alert("글이 수정되었습니다.");
      setIsEditMode(false);
      onPostUpdate();
    } catch (err) {
      console.error(err);
      alert("글 수정에 실패했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  return isEditMode ? (
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
  );
}

export default PostSection;
