const Urls = ({ urls, notifyDelete }) => {
  const deleteRow = async (partitionKey, rowKey) => {
    try {
      let reqUrl = `/api/urls`;
      let result = await fetch(reqUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ partitionKey, rowKey }),
      });

      if (result.ok) {
        notifyDelete(true);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="alert alert-info" role="alert">
              <strong>Current Urls</strong>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          {urls.map((url) => {
            return (
              <div className="col-sm-12 col-md-6 col-lg-3 col-xs-12 mt-1">
                <div className="card p-2" key={url.rowKey}>
                  <div className="card-body"></div>
                  <h5 className="card-title">
                    🌐 {url.short}&nbsp;
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {url.pageViewCount}
                    </span>
                  </h5>
                  <p className="card-text">{url.url}</p>
                  <button
                    className="btn btn-secondary btn-sm"
                    type="button"
                    onClick={() => deleteRow(url.partitionKey, url.rowKey)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Urls;
