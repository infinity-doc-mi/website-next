export const Root = (ps: { title: string; children: React.ReactNode} ) => {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta 
          name='viewport'
          content='width=device-width, initial-scale=1.0' />
        <title>{ps.title}</title>
        <link href='/index.css' rel='stylesheet' />
        <link href='/favicon.ico' rel='shortcut icon' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link 
          rel='preconnect'
          href='https://fonts.gstatic.com' />
        <link 
          href='https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap'
          rel='stylesheet' />
      </head>
      <body>
        {ps.children}
      </body>
    </html>
  )
}
