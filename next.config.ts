import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O Keystatic, no modo GitHub, troca localhost por 127.0.0.1 (é o endereço
  // de retorno do login do GitHub). Sem isso o dev server bloqueia o painel.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
