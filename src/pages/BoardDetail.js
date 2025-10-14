import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardDetail.css";

function BoardDetail({ user }) {

    const navigate = useNavigate();

    const [post, setPost] = useState(null); //해당 글 id로 요청한 글 객체
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const {id} = useParams();

    const loadPost = async () => {  //특정 글 id로 글 1개
        try {
            const res = await api.get(`/api/board/${id}`);
            setPost(res.data);  //특정 글 id 객체
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
                content: editContent
            });
            alert("글이 수정되었습니다.");
            setIsEditMode(false);
            loadPost(); // 수정된 내용 다시 불러오기
        } catch (err) {
            console.error(err);
            alert("글 수정에 실패했습니다.");
        }
    };

    // 날짜 포맷
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    // 컴포넌트 마운트 시 글 불러오기
    useEffect(() => {
        loadPost();
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
                    <button onClick={handleCancelEdit} className="cancel-btn">취소</button>
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
                {/* 로그인한 유저가 본인이 쓴 글만 수정/삭제 가능 */}
                {user && post.author.username === user && (
                    <>
                        <button onClick={handleEdit}>수정</button>
                        <button onClick={handleDelete} className="delete-btn">삭제</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default BoardDetail;