import { useEffect, useState } from "react";
import "./Board.css";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Board({ user }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate(); // 추가

  //게시판 페이징된 글 리스트 요청
  const loadPosts = async (page = 0) => {
    try {
      const res = await api.get(`/api/board?page=${page}&size=10`); //모든글 가져오기 요청
      setPosts(res.data.posts); //posts->전체 게시글->게시글의 배열
      setCurrentPage(res.data.currentPage); //현재 페이지 번호
      setTotalPages(res.data.totalPages); //전체 페이지 수
      setTotalItems(res.data.totalItems); //모든 글의 갯수
    } catch (err) {
      console.error(err);
    }
  };

  const handleWrite = () => {
    //로그인한 유저만 글쓰기 허용
    if (!user) {
      //참이면 로그인하지 않은 경우임
      alert("글작성은 로그인을 해야합니다.");
      return;
    }

    navigate("/board/write");
  };

  // 글 상세 페이지로 이동
  const handlePostClick = (postId) => {
    navigate(`/board/${postId}`);
  };

  //처음 로딩될 때 한번만 실행
  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  //페이지 번호 그룹 배열 반환 함수(10개까지만 표시)
  //ex) 총 페이지 수 : 157 -> 총 16 페이지 필요 -> [0 1 2 3 4 5 6 7 8 9]
  // ▶ -> [10 11 12 13 14 15]
  const getPageNumbers = () => {
    const pageGroup = Math.floor(currentPage / 10); // 페이지 그룹 계산
    const start = pageGroup * 10; // 시작 번호
    const end = Math.min(start + 10, totalPages); // 끝 번호
    const pages = [];
    for (let i = start; i < end; i++) {
      pages.push(i); //
    }
    return pages;
  };

  // 첫 페이지로 이동
  const handleFirstPage = () => {
    setCurrentPage(0);
  };

  // 마지막 페이지로 이동
  const handleLastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  // 이전 페이지로 이동 (1페이지씩)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동 (1페이지씩)
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  //날짜 format함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR"); // 한국 날짜 형식
  };

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
          {posts.map((p, index) => (
            <tr key={p.id}>
              <td>{totalItems - currentPage * 10 - index}</td>
              <td className="title-cell" onClick={() => handlePostClick(p.id)}>
                {p.title}
              </td>
              <td>{p.author.username}</td>
              <td>{formatDate(p.createDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 네비게이션 */}
      <div className="pagination">
        {/* 첫 페이지로 이동 */}
        <button onClick={handleFirstPage} disabled={currentPage === 0}>
          ◀◀
        </button>

        {/* 이전 페이지 (1페이지 단위) */}
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          ◀
        </button>

        {/* 페이지 번호들 */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={currentPage === num ? "active" : ""}
          >
            {num + 1}
          </button>
        ))}

        {/* 다음 페이지 (1페이지 단위) */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
        >
          ▶
        </button>

        {/* 마지막 페이지로 이동 */}
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages - 1}
        >
          ▶▶
        </button>
      </div>

      <div className="write-button-container">
        <button onClick={handleWrite} className="write-button">
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default Board;
