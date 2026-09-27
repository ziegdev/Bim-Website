import { NextMiddleware } from 'next/server';
import { stackMiddlewares } from './middlewares';
import { withLocale } from './middlewares/with-locale';
import { withCrowdfunding } from './middlewares/with-crowdfunding';

export type MiddlewareFactory = (
  middleware: NextMiddleware,
) => NextMiddleware;

const middlewares = [withLocale, withCrowdfunding];

export default stackMiddlewares(middlewares);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.png|logo.png|videos|assets|sitemap.xml|robots.txt).*)',
  ],
};
