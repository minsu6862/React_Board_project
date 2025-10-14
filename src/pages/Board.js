import { useEffect, useState } from "react";
import "./Board.css";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Board({ user }) {

    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();  // 추가

    //게시판 모든 글 요청
    const loadPosts = async () => {
        try {
            const res = await api.get("/api/board");    //모든글 가져오기 요청
            setPosts(res.data); //posts->전체 게시글
        } catch (err) {
            console.error(err);
        }
    };

    const handleWrite = () => {
        //로그인한 유저만 글쓰기 허용
        if(!user) {  //참이면 로그인하지 않은 경우임
            alert("글작성은 로그인을 해야합니다.");
            return;
        }

        navigate("/board/write");
    }

    // 글 상세 페이지로 이동
    const handlePostClick = (postId) => {
        navigate(`/board/${postId}`);
    }

    //처음 로딩될 때 한번만 실행
    useEffect(() => {
        loadPosts();
    }, []);

    //날짜 format함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR'); // 한국 날짜 형식
    }

    return (
        <div className="container">
            <h2>게시판</h2>
            <table className="board-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>글쓴이</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.slice().reverse().map((p, index) => (
                        <tr key={p.id}>
                            <td>{posts.length - index}</td>
                            <td 
                                className="title-cell"
                                onClick={() => handlePostClick(p.id)}
                            >
                                {p.title}
                            </td>
                            <td>{p.author.username}</td>
                            <td>{formatDate(p.createDate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="write-button-container">
                <button onClick={handleWrite} 
                className="write-button">글쓰기</button>
            </div>
        </div>
    );
}

export default Board;