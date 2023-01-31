import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloLink,
  Observable,
} from "@apollo/client";

let myNumber = 1;

(async function () {
  const voidLink = new ApolloLink((wow) => {
    console.log("stopped in voidLink: ", wow);
    return new Observable(() => undefined);
  });

  const client = new ApolloClient({
    link: voidLink,
    cache: new InMemoryCache(),
  });

  const query = gql`
    query {
      hello
    }
  `;

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

  client.writeQuery({
    query,
    data: { hello: "world! " + myNumber++ },
  });

  console.log(
    "reading hello through query:",
    (
      await client.query({
        query,
      })
    ).data
  );

  console.log(
    "reading hello through cache:",
    await client.readQuery({
      query,
    })
  );
})();
