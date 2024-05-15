const NoMatch = () => {
  console.log("NoMatch: window.location.pathname", window.location.pathname);
  window.location.href = `${window.location.pathname}.html`;
};

export default NoMatch;
