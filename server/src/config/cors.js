const { env } = require('./env');
const cors = require('cors');
const corsMiddleware = cors({
  origin : [env.CLIENT_URL],
  credentials : true
})