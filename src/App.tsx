
import { SidebarProvider } from "@/components/context/SidebarContext";
import AppRouter from "./router/AppRouter";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <SidebarProvider>
      <AppRouter />
    </SidebarProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1A1A1A",
            color: "#fff",
            border: "1px solid #FFD700",
          },
        }}
      />
    </div>
  );
};





export default App;