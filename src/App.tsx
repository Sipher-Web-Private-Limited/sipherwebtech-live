import { BrowserRouter } from "react-router-dom";
import { CmsContentProvider } from "./content/CmsContentProvider";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <CmsContentProvider>
        <AppRoutes />
      </CmsContentProvider>
    </BrowserRouter>
  );
}
