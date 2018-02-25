import { server } from './server';
import { log } from './utils';

log.info('server = ', typeof server);
// Start server.
server.listen(9090);
