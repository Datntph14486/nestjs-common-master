import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerUtils } from './app-module/utils/logging/log.utils';
import { InterceptorUtils } from './app-module/utils/interceptor/interceptor.utils';
import { WSAdapterUtils } from './app-module/utils/websocket/ws.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {

  });

  LoggerUtils.handlers.forEach((handler) => {
    app.useLogger(handler);
  })

  app.enableCors()
  InterceptorUtils.handlers.forEach((handler) => {
    app.useGlobalInterceptors(handler)
  })

  /**
   * Load WebSocketAdapter tùy chỉnh
   */
  if (WSAdapterUtils.adapterContructor) {
    const adapter = new WSAdapterUtils.adapterContructor(app)
    app.useWebSocketAdapter(adapter)
  }

  let __port: number = parseInt(process.env['server.port'] || '3000')
  await app.listen(__port);
}
bootstrap();
