import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BusinessesPage from './pages/BusinessesPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditBusinessPage from './pages/EditBusinessPage';
import EditPostPage from './pages/EditPostPage';
import FavoritesPage from './pages/FavoritesPage';
import { AuthProvider } from './context/AuthContext';
import { UserActionsProvider } from './context/UserActionsContext';
import AnalyticsPage from './pages/AnaliticsPage';

function App() {
  return (
    <AuthProvider>
      <UserActionsProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/businesses" element={<BusinessesPage />} />
                <Route path="/business/:id" element={<BusinessDetailPage />} />
                <Route path="/business/:id/edit" element={<EditBusinessPage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/post/:id/edit" element={<EditPostPage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/analitics" element={<AnalyticsPage/>}/>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </UserActionsProvider>
    </AuthProvider>
  );
}

export default App;