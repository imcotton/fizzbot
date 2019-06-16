import fetch from 'node-fetch';

import { processWrap, fetchWrap } from '../web/lib.mjs';





export const process = processWrap(fetchWrap(() => fetch));

