/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {Helmet} from "react-helmet"

import Seo from "./seo"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Seo title={data.site.siteMetadata?.title}/>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <Helmet>
        <meta name="google-site-verification" content="FkZlVxoWpRjIP0BsOSRXh75I1zqsrB9IkHKxUutRuF0" />
      </Helmet>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
          padding: `var(--size-gutter)`,
        }}
      >
        <main>{children}</main>
        <footer
          style={{
            marginTop: `var(--space-5)`,
            fontSize: `var(--font-sm)`,
          }}
        >
          © {new Date().getFullYear()} &middot; Built by
          {` `}
          <p>Jakub Bednarek</p>
        </footer>
      </div>
    </>
  )
}

export default Layout
