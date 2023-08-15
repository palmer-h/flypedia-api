import 'module-alias/register.js';
import app from './src/app.js';

const port: string = process.env.PORT || '3000';

app.listen(port, () => console.log(`Server listening on ${port}`));
