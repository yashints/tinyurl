import hero from "../assets/hero.jpeg";

const Landing = () => {
  return (
    <div className="d-flex flex-column h-100 justify-content-center">
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <div className="jumbotron">
              <h1 className="display-4">Welcome to Tiny URL</h1>
              <p className="lead">This is a simple URL shortener service.</p>
            </div>
          </div>
          <div className="col-md-6">
            <img src={hero} alt="Hero" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
