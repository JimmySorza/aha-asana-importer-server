import HomePageTemplate from './view/homeTemplate.html';
import express, { Response as ExResponse, Request as ExRequest } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { AsanaOAuth } from './services/asanaOAuth';
import { RegisterRoutes } from './routes';

export const app = express();

app.use(cors());
// Use body parser to read sent json payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const options = {
  swaggerOptions: {
    oauth2RedirectUrl: AsanaOAuth.redirectURI,
    oauth: {
      clientId: AsanaOAuth.clientId,
      clientSecret: AsanaOAuth.clientSecret,
    },
  },
};

app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(swaggerUi.generateHTML(await import('./swagger.json'), options));
});

app.get('/', (req, res) => {
  res.send(HomePageTemplate).end();
});

RegisterRoutes(app);
