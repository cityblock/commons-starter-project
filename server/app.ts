import express from 'express';

export default function app(req: express.Request, res: express.Response) {
  const html = `
    <!doctype html>
    <html>
      <head>
        <title>Commons</title>
        <meta charset='utf-8' />
        <meta http-equiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='stylesheet' href='/assets/styles/main.css' />
      </head>
      <body>
        <div id='app'></div>
        <script type='text/javascript' charset='utf-8' src='/assets/app.js'></script>
      </body>
    </html>`;

  return res.status(200).send(html);
}
