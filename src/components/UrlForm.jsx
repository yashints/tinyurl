import { useState } from "react";
import PropTypes from 'prop-types';
import hero from "../assets/hero.jpeg";

const UrlGetForm = ({ notify }) => {
  const [initialUrl, setInitialUrl] = useState("");
  const [short, setShort] = useState("");

  const handleUrl = async (e) => {
    e.preventDefault();

    try {
      let reqUrl = `/api/urls`;
      let result = await fetch(reqUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl: initialUrl, shortUrl: short }),
      });

      if (result.ok) {
        let data = await result.json();
        setInitialUrl("");
        notify(data.shortUrl);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-12 text-center">
            <img className="hero" src={hero} alt="Person using a computer" width="60%" />
          </div>
          <div className="col-lg-6 col-sm-12">
            <div className="d-flex flex-column h-100 justify-content-center">
              <h3>Start here</h3>
              <form>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={initialUrl}
                    placeholder="Enter your URL here"
                    onChange={(e) => setInitialUrl(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={short}
                    placeholder="Enter your suggested shortlink here"
                    onChange={(e) => setShort(e.target.value)}
                  />
                </div>
                <div className="text-end">
                  <button className="btn btn-info fw-bold w-25" type="submit" onClick={handleUrl}>
                    Tinify
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
UrlGetForm.propTypes = {
  notify: PropTypes.func.isRequired,
};

export default UrlGetForm;
