import "./index.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

function MainLayout(props) {
  return (
    <div className="container">
      <div className="header">
        <Header name={props.name} />
      </div>
      <div className="body">{props.component}</div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
