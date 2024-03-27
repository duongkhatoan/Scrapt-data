import { useRef, useState } from "react";
import "./App.css";
import fetchHtmlFromUrl from "../lib/action";
import classes from "./App.module.css";
import * as XLSX from "xlsx";
import qrCode from "./assets/qr_code.jpg";
function App() {
  const inputRef = useRef();
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHtmlContent("");
    setIsLoading(true);
    setIsError(false);

    try {
      const html = await fetchHtmlFromUrl(inputRef.current.value);
      setHtmlContent(html);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  const handleExportExcel = () => {
    if (!htmlContent) return;

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(htmlContent);
    // XLSX.utils.sheet_add_aoa(ws, [[htmlContent.monthAndYear]], {
    //   origin: "A1",
    // });
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <label className={classes.label} htmlFor="">
          Please enter a valid url
        </label>
        <div>
          <input
            className={classes.input}
            type="text"
            required
            ref={inputRef}
          />
        </div>
        <button className={classes.button}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>

      {isLoading && <p>Is loading....</p>}

      {isError && <p>Something went wrong or url is not correct</p>}

      {htmlContent && (
        <>
          <div className="table">
            <div className="center">
              <span>{htmlContent.monthAndYear}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>date</th>
                  <th>lunar-date</th>
                  <th>Month-year</th>
                </tr>
              </thead>
              <tbody>
                {htmlContent.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.month}</td>
                      <td>{item.date}</td>
                      <td>{item.lunarDate}</td>
                      <td>{item.monthAndYear}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="img">
            <h1>Chân thành cảm ơn và hậu tạ!</h1>
            <img src={qrCode} alt="qrcode" />
          </div>
          <button onClick={handleExportExcel}>Export to Excel</button>
        </>
      )}
    </>
  );
}

export default App;
