import { Bigtable, Instance } from '@google-cloud/bigtable';

const PROJECT_ID = 'voltz-v2-infra';
const INSTANCE_ID = 'test-id';

let bigtableClient: Bigtable | null;
export const getBigtableClient = (): Bigtable => {
  if (!bigtableClient) {
    bigtableClient = new Bigtable({ projectId: PROJECT_ID });
  }

  return bigtableClient;
};

let bigtableInstance: Instance | null;
export const getBigtableInstance = (): Instance => {
  if (!bigtableInstance) {
    const bigtableClient = getBigtableClient();
    bigtableInstance = bigtableClient.instance(INSTANCE_ID);
  }

  return bigtableInstance;
};
