export default function app(req: any, res: any) {
  const html = `
    <!doctype html>
    <html>
      <head>
        <title>Commons | A Sidewalk Labs Urban Health Initiative</title>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <meta name='robots' content='noindex, nofollow'>
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-32x32.png">
        <link rel='stylesheet' href='/assets/styles/main.css'>
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,600" rel="stylesheet">
      </head>
      <body>
        <div id='app'></div>
        <script type='text/javascript' charset='utf-8' src='/assets/app.js'></script>
      </body>
    </html>`;

  return res.status(200).send(html);
}
