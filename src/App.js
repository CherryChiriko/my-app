import { useSelector } from "react-redux";
import { selectActiveTheme } from "./features/themeSlice";
import Navbar from "./components/Navbar";

function App() {
  const activeTheme = useSelector(selectActiveTheme);

  // Apply dynamic background and text color directly as inline styles
  const appContainerStyles = {
    backgroundColor: activeTheme.bgColor,
    color: activeTheme.textColor, 
    minHeight: '100vh', 
  };

  return (
    <div style={appContainerStyles}>
      <Navbar />
    </div>
  );
}

export default App;
