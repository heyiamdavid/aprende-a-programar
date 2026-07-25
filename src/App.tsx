import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import EditorPage from './pages/EditorPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/*" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
