import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: '832085hn',
    dataset: 'production',
    apiVersion: '2024-04-25',
});