import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
