import UrlGetForm from "./UrlForm";
import Urls from "./UrlList";
import { useEffect, useState } from "react";

function Home() {
  const [urls, setUrls] = useState([]);
  const [shortLink, setShortLink] = useState("");
  const [deleted, setDeleted] = useState(false);

  const fetchData = async () => {
    fetch("/api/urls")
      .then((data) => data.json())
      .then((data) => {
        setUrls(data);
        setDeleted(false);
        setShortLink("");
      });
  };

  useEffect(() => {
    fetchData();
  }, [shortLink, deleted]);

  return (
    <>
      <UrlGetForm notify={setShortLink} />
      <Urls urls={urls} notifyDelete={setDeleted} />
    </>
  );
}

export default Home;
