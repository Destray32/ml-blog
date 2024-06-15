import React, { useEffect } from 'react';
import { useStaticQuery, graphql } from "gatsby"

import Header from '../components/header';

export default function BlogPost({ data }) {
  const post = data.markdownRemark;

  useEffect(() => {
    console.log('data');
    console.log(data);
  }, []);
  return (
    <>
      <Header siteTitle={`Jakub Bednarek - Machine Learning`} />
      <div style={
        {
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          margin: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px'
        }

      }>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
      </div>
    </>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;