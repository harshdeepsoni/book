import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const books = [
    {
      title: "Java Book",
      pdfUrl: "https://drive.google.com/uc?export=download&id=ABC123",
    },

    {
      title: "Python Book",
      pdfUrl: "",
    }
  ];

  return (
    <div>
      <h1>Library 📚</h1>

      {books.map((book, index) => (
        <div key={index}>
          <h3>{book.title}</h3>

          <button
            onClick={() =>
              navigate("/read", { state: { pdfUrl: book.pdfUrl } })
            }
          >
            Read Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;