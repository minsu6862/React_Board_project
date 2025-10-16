import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardWrite.css";

function BoardWrite({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 글 등록 처리
  const handleSubmit = async (e) => {
    //새로고침 방지
    e.preventDefault();
    setErrors({});

    //로그인한 유저만 글쓰기 허용
    if (!user) {
      //참이면 로그인하지 않은 경우임
      alert("글작성은 로그인을 해야합니다.");
      return;
    }

    try {
      await api.post("/api/board", { title, content });
      alert("글 작성 완료!");
      navigate("/board");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        console.error(err);
        alert("글쓰기 작성에 실패했습니다.");
      }
    }
  };

  // 취소 버튼
  const handleCancel = () => {
    if (window.confirm("작성을 취소하시겠습니까?")) {
      navigate("/board"); // 게시판으로 돌아가기
    }
  };

  return (
    <div className="write-container">
      <h2>글쓰기</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
        {errors.content && <p style={{ color: "red" }}>{errors.content}</p>}

        <div className="button-group">
          <button type="submit">등록</button>
          <button type="button" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardWrite;
