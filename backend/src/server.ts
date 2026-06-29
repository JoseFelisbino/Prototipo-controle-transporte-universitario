import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`===========================================================`);
  console.log(`[Server] rodando com sucesso em http://localhost:${env.PORT}`);
  console.log(`[Docs] Swagger UI disponível em http://localhost:${env.PORT}/api-docs`);
  console.log(`===========================================================`);
});
