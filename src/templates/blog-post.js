import React, { useEffect } from 'react';
import { useStaticQuery, graphql } from "gatsby"
import styled from 'styled-components';

import Header from '../components/header';

const MarkdownContent = styled.div`
  img {
    max-width: 60%;
    height: auto;
  }
`;



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
        <MarkdownContent dangerouslySetInnerHTML={{ __html: post.html }}></MarkdownContent>
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