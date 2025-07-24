import { useSelector } from "react-redux";
import { selectActiveTheme } from "./features/themeSlice";
import Navbar from "./components/Navbar";

function App() {
  const activeTheme = useSelector(selectActiveTheme);

  return (
    <div className={`${activeTheme.bgColor} ${activeTheme.textColor} min-h-screen`}>
      {/* <Navbar /> */}
      {/* <Routes>... */}
    </div>
  );
}

export default App;
