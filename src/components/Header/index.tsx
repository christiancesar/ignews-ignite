import { SignInButton } from '../SignInButton';
import Image from 'next/image';
import Link from 'next/link';
import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.scss';
import logo from "../../../public/images/logo.svg";


export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={logo} alt="ig.news" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a className={styles.active}>Home</a>
          </ActiveLink>

          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div >
    </header >
  )
}