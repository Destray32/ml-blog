import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

export default function Home({ data }) {
  return (
    <Layout>
      <h1>My Blog</h1>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <a href={`/ml-blog/${node.fields.slug}`}>{node.frontmatter.title}</a>
            {/* <a href={`${node.fields.slug}`}>{node.frontmatter.title}</a> */}
            <br />
            <small>{node.frontmatter.date}</small>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

// wytłumaczenie: 

// P: Gdzie znadują się dane odnośnie postów?
// W propsach, które są przekazywane do komponentu Home
// P: Gdzie znajduje się lista postów?
// W data.allMarkdownRemark.edges
// P: Co zawiera każdy element listy?
// Obiekt z danymi o jednym poście
export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
