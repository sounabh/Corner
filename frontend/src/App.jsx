import { Route, Routes } from "react-router-dom";


import Signup from "./pages/auth/Signup";
import LandingPage from "./_components/LandingPage";
import LoginPage from "./pages/auth/login";
import ResetPasswordPage from "./pages/auth/resetPaaword";
import VerifyPage from "./pages/auth/verify";
import RoomPage from "./pages/room&Editor/roomPage";

import EditorComponent from "./Editor";
import PaymentButton from "./payment";
import ProjectsSection from "./pages/projects/ProjectComponent";
import CombinedEditorVideo from "./pages/EditorVideo";
import VideoConferenced from "./video";



const App = () => {
  return (
  
    <Routes>
       <Route path="/" element={<LandingPage></LandingPage>}></Route>
      <Route path="/signup" element={<Signup></Signup>}></Route>
      <Route path="/login" element={<LoginPage></LoginPage>}></Route>
      <Route path="/reset-password" element={<ResetPasswordPage></ResetPasswordPage>}></Route>
      <Route path="/verify" element={<VerifyPage></VerifyPage>}></Route>
      <Route path="/create-room" element={<RoomPage></RoomPage>}></Route>
      <Route path="/editor/:roomId" element={<EditorComponent/>}></Route>
      <Route path="/video" element={<VideoConferenced></VideoConferenced>}></Route>
      <Route path="/payment" element={<PaymentButton></PaymentButton>}></Route>
      <Route path="/projects" element={<ProjectsSection></ProjectsSection>}></Route>
      <Route path="/test" element={<CombinedEditorVideo></CombinedEditorVideo>}></Route>
      
    </Routes>
  
  );
};

export default  App
