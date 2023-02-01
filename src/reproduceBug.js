import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";

let myNumber = 1;

const query = gql`
  query {
    hello
  }
`;

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

export async function init() {
  client.writeQuery({
    query,
    data: { hello: "world! " + myNumber++ },
  });

  client
    .mutate({
      mutation: gql`
        mutation UpdateOtherField($otherData: Number!) {
          setOther(input: $otherData) {
            other
          }
        }
      `,
      variables: {
        otherData: "something",
      },
      optimisticResponse: {
        setOther: {
          __typename: "UpdateOtherResult",
          other: "something",
        },
      },
      update: () => {
        client.writeQuery({
          data: { anotherField: "test" },
          query: gql`
            query {
              anotherField
            }
          `,
        });
      },
    })
    .then(() => {
      console.log("finished mutation");
    });

  await writeCache(client);
}

export async function writeCache() {
  console.log("writing to cache");
  client.writeQuery({
    query,
    data: { hello: "world! " + myNumber++ },
  });

  console.log(
    "reading 'hello' through query:",
    (
      await client.query({
        query,
      })
    ).data
  );

  console.log(
    "reading 'hello' through cache:",
    await client.readQuery({
      query,
    })
  );
}

init();
