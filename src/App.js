import { useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";

const AutocompleteLoader = () => (
  <ContentLoader
    speed={2}
    width={500}
    height={60}
    viewBox="0 0 500 60"
    backgroundColor="#f3f3f3"
    foregroundColor="#dedede"
  >
    <rect x="203" y="22" rx="0" ry="0" width="4" height="3" />
    <rect x="15" y="10" rx="0" ry="0" width="71" height="40" />
    <rect x="96" y="20" rx="0" ry="0" width="169" height="8" />
    <rect x="96" y="35" rx="0" ry="0" width="92" height="6" />
  </ContentLoader>
);

function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef();

  const isTyping = search.replace(/\s+/, "").length > 0;

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearch("");
    }
  };

  const getResultItem = (item) => {
    window.location.href = item.url;
  };

  useEffect(() => {
    if (isTyping) {
      setLoading(true);
      const getData = setTimeout(() => {
        fetch(`https://jsonplaceholder.typicode.com/albums`)
          .then((res) => res.json())
          .then((data) => {
            const filteredData = data.filter((album) =>
              album.title.toLowerCase().includes(search.toLowerCase())
            );
            setResult(filteredData.length > 0 ? filteredData : false);
            setLoading(false);
          });
      }, 500);

      return () => {
        clearTimeout(getData);
        setLoading(false);
      };
    } else {
      setResult(false);
    }
  }, [search]);

  return (
    <>
      <div className="search" ref={searchRef}>
        <input
          type="text"
          value={search}
          className={isTyping ? "typing" : null}
          placeholder="Search something.."
          onChange={(e) => setSearch(e.target.value)}
        />
        {isTyping && (
          <div className="search-result">
            {result &&
              loading === false &&
              result.map((item, index) => (
                <div
                  onClick={() => getResultItem(item)}
                  key={index}
                  className="search-result-item"
                >
                  <div className="title">{item.title}</div>
                </div>
              ))}
            {loading && new Array(3).fill().map(() => <AutocompleteLoader />)}
            {!result && loading === false && (
              <div className="result-not-found">
                No results found for "{search}"!
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
