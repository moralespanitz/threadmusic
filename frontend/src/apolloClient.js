import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://lb-proyecto-1487766841.us-east-1.elb.amazonaws.com/',
  cache: new InMemoryCache(),
});

export default client;
