import "./Navbar.css"
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">minsu board project</div>
            <div className="menu">
                <Link to="/">Home</Link>
                <Link to="/board">게시판</Link>
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
                <button></button>
            </div>
        </nav>
    );
}

export default Navbar;