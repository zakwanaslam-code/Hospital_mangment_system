import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.jsx";
import { useEffect } from "react";
import socket from "./socket";


function App() {

  useEffect(() => {

    socket.on("connect", () => {
      console.log(
        "🟢 Socket connected:",
        socket.id
      );
    });


    socket.on("disconnect", () => {
      console.log(
        "🔴 Socket disconnected"
      );
    });


    return () => {

      socket.off("connect");

      socket.off("disconnect");

    };


  }, []);


  return (
    <>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1E293B",
            color: "#F8FAFC",
            border: "1px solid #334155",
          },
        }}
      />


      <AppRoutes />

    </>
  );
}


export default App;