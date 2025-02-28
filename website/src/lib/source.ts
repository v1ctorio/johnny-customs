import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/info',
  source: docs.toFumadocsSource(),
});

export default source;
