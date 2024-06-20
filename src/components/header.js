import * as React from "react"
import { Link } from "gatsby"
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"
import styled from "styled-components"

const HeaderWrapper = styled.header`
  margin: 0 auto;
  padding: 1rem var(--size-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const SiteTitle = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--color-text);
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--color-primary);
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`

const SocialLink = styled.a`
  color: var(--color-text);
  transition: color 0.2s ease-in-out;
  font-size: 1.2rem;

  &:hover {
    color: var(--color-primary);
  }
`

const Header = ({ siteTitle }) => (
  <HeaderWrapper>
    <SiteTitle to="/ml-blog">{siteTitle}</SiteTitle>
    <SocialLinks>
      <SocialLink href="https://github.com/Destray32" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <FaGithub />
      </SocialLink>
      <SocialLink href="https://www.linkedin.com/in/jakub-bednarek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <FaLinkedin />
      </SocialLink>
    </SocialLinks>
  </HeaderWrapper>
)

export default Header