import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import QuemSomos from "./pages/QuemSomos.tsx";
import Contato from "./pages/Contato.tsx";
import Blog from "./pages/Blog.tsx";
import TrocasDevolucoes from "./pages/TrocasDevolucoes.tsx";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade.tsx";
import NormasAcessibilidade from "./pages/NormasAcessibilidade.tsx";
import Produtos from "./pages/Produtos.tsx";
import ProdutoCategoria from "./pages/ProdutoCategoria.tsx";
import ProdutoDetalhe from "./pages/ProdutoDetalhe.tsx";
import Auth from "./pages/Auth.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminProductForm from "./pages/admin/AdminProductForm.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/trocas-e-devolucoes" element={<TrocasDevolucoes />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/normas-de-acessibilidade" element={<NormasAcessibilidade />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/:slug" element={<ProdutoCategoria />} />
            <Route path="/produto/:slug" element={<ProdutoDetalhe />} />

            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/produtos" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
            <Route path="/admin/produtos/novo" element={<ProtectedAdminRoute><AdminProductForm /></ProtectedAdminRoute>} />
            <Route path="/admin/produtos/:id" element={<ProtectedAdminRoute><AdminProductForm /></ProtectedAdminRoute>} />
            <Route path="/admin/categorias" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
