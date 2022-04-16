import { KeyboardEventHandler, useCallback, useState } from "react";
import "./App.css";
import { GithubFolderResponse } from "./types";

type FetchStatus = "idle" | "pending" | "success" | "error";

function App() {
  const [data, setData] = useState<null | GithubFolderResponse>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");

  const load = useCallback((repo: string) => {
    if (!repo.includes("/")) {
      return;
    }
    const [owner, name] = repo.split("/");
    setFetchStatus("pending");
    fetch(`https://api.github.com/repos/${owner}/${name}/contents/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
          setFetchStatus("success");
        } else {
          console.log("Error: Received data", data);
          setFetchStatus("error");
        }
      })
      .catch(() => setFetchStatus("error"));
  }, []);

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter") {
        // @ts-ignore
        load(e.target.value);
      }
    },
    [load]
  );

  return (
    <div className="App">
      <h1>Github Courseware</h1>
      <input
        type="text"
        className="big-input"
        onKeyUp={onKeyUp}
        style={{ maxWidth: "20rem" }}
      />
      {fetchStatus === "pending" ? (
        <div>Loading...</div>
      ) : fetchStatus === "error" ? (
        <div>Error</div>
      ) : null}
      {data ? (
        <>
          {data.map((item) => {
            return <div key={item.name}>{item.name}</div>;
          })}
        </>
      ) : (
        "No data"
      )}
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </div>
  );
}

export default App;
