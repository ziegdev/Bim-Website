import { stackMiddlewares } from './middlewares';
import { withLocale } from './middlewares/with-locale';

const middlewares = [withLocale];

export default stackMiddlewares(middlewares);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|videos|assets|sitemap.xml|robots.txt).*)',
  ],
};
