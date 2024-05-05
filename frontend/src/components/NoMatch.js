import { useEffect } from "react";

const NoMatch = () => {
  useEffect(() => {
    const fetchUrl = async () => {
      const url = `/api/urls/${window.location.pathname}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        window.location.replace(data.url);
      } else {
        window.location.replace("/");
      }
    };

    fetchUrl();
  }, []);
};

export default NoMatch;
